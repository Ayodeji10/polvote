import React, { useContext, useState } from "react";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import { setUserSession } from "../utils/common";
import axios from "axios";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login"
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import Modal from 'react-modal'
Modal.setAppElement('#root')


const Home = () => {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // modals 
    const [signupModal, setSignupModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
    const [verificationView, setVerificationView] = useState('email')

    // otp 
    const [otp, setOtp] = useState(new Array(6).fill(""))

    // handle change for otp 
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false
        setOtp([...otp.map((d, idx) => (idx === index) ? element.value : d)])
        // focus on next input box 
        if (element.nextSibling) {
            element.nextSibling.focus()
        }
    }

    // signup 
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("@")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [password, setPassword] = useState("")

    const handleSignUp = () => {
        setError(null)
        setLoading(true)
        axios.post(`${API.API_ROOT}/users/register`, { firstname: firstName, lastname: lastName, username: username, phonenumber: number, email: email, password: password }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                console.log(response)
                setLoading(false);
                setSignupModal(false)
                setVerificationModal(true)
            }).catch(error => {
                setLoading(false)
                if (error.response.status === 422) {
                    setError('this Email is already registered')
                } else if (error.response.status === 401 || error.response.status === 400) {
                    setError(error.response.data.message)
                }
                else {
                    setError('Something went wrong, please try again')
                }
                console.error(error)
            })
    }

    // login 
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        axios.post(`${API.API_ROOT}/users/signin`, { email: loginEmail, password: loginPassword })
            .then(response => {
                console.log(response)
                setLoading(false);
                if (response.status === 422) {
                    setError("kindly Check your mail to verify this account")
                    setPassword('')
                }
                else {
                    setUserSession(response.data.token);
                    setContext({ ...context, user: response.data, backupUser: response.data })
                    navigate('/')
                }
            }).catch(error => {
                console.log(error)
                setLoading(false)
                if (error.status === 500) {
                    setError("Invalid email or password")
                    setPassword('')
                }
                else {
                    setPassword('')
                    setError('Something went wrong, please try again')
                    console.error(error)
                }
            })
    }

    // google signup 
    const responseSuccessGoogle = (response) => {
        console.log(response)
        console.log(response.tokenId)
        setLoading(true)
        axios({
            method: "post",
            url: `${API.API_ROOT}/users/googleLogin`,
            data: { tokenId: response.tokenId }
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setLoading(false)
                setUserSession(response.data._id)
                setContext({ ...context, user: response.data, backupUser: response.data })
                // navigate('/')
            } else {
                setLoading(false)
                setError("Something went wrong... pls try again shrotly")
            }
        }
        )
    }

    const responseErrorGoogle = () => {
    }

    // facebook login 
    const responseFacebook = (response) => {
        console.log(response)
        setLoading(true)
        axios({
            method: "post",
            url: `${API.API_ROOT}/users/facebookLogin`,
            data: { accessToken: response.accessToken, userID: response.userID }
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setLoading(false)
                setUserSession(response.data.token)
                setContext({ ...context, user: response.data.user, backupUser: response.data })
                navigate('/')
            } else {
                setError('SOmething went wrong, pls try again later')
            }
        }
        )
    }

    // forgot password 
    // verify email 
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)
    const [verifyEmailError, setVerifyEmailError] = useState("")
    const [verifyEmailInput, setVerifyEmailInput] = useState("")

    // new password 
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const verifyEmail = () => {
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        axios.post(`${API.API_ROOT}/users/forgotpassword`, { email: verifyEmailInput }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                // console.log(response)
                setVerifyEmailLoading(false)
                if (response.data.status === 'error') {
                    setVerifyEmailError('Invalid Email Address')
                } else {
                    localStorage.setItem('temporaryId', response.data.userid)
                    setVerificationView("otp")
                    setVerifyEmailError('')
                }
            }).catch(error => {
                setVerifyEmailLoading(false)
                setVerifyEmailError('Something went wrong, please try again later')
                // console.error(error)
            })
    }

    // verfify otp 
    const handleOtp = () => {
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        axios.post(`${API.API_ROOT}/users/verifycode`, { code: otp.join("") }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                setVerifyEmailLoading(false)
                if (response.data.status === "SUCCESS") {
                    setVerificationView('reset')
                    setVerifyEmailError("")
                } else {
                    setVerifyEmailError(response.data.invalid)
                }
            }).catch(error => {
                setVerifyEmailLoading(false)
                setVerifyEmailError('Something went wrong, please try again later')
            })
    }

    // new password 
    const handleNewPassword = () => {
        console.log(localStorage.getItem('temporaryId'))
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        if (newPassword !== confirmPassword) {
            setVerifyEmailError("Please ensure both passwords match")
            setVerifyEmailLoading(false)
        } else {
            axios.patch(`${API.API_ROOT}/users/updatepassword/${localStorage.getItem('temporaryId')}`, { password: newPassword }, { headers: { 'content-type': 'application/json' } })
                .then(response => {
                    setVerifyEmailLoading(false)
                    if (response.data.status === "SUCCESS") {
                        localStorage.removeItem('temporaryId')
                        setVerificationView("success")
                    } else {
                        setVerifyEmailError('Something went wrong, please try again later')
                    }
                }).catch(error => {
                    console.log(error)
                    setVerifyEmailLoading(false)
                    setVerifyEmailError('Something went wrong, please try again later')
                })
        }
    }

    if (localStorage.getItem('ballotbox_token') == null) {
        return (
            <div className="container-fluid landing-page">
                {/* navigation */}
                <div className="navigation-container">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <div className="container-fluid">
                                <a href="#" className="navbar-brand logo"><img src="img/Logo2.png" /></a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span />
                                    <span />
                                    <span />
                                </button>
                                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                                    <ul className="navbar-nav mb-2 mb-lg-0">
                                        <li className="nav-item"><button id="login" onClick={() => setLoginModal(true)}>Login</button></li>
                                        <li className="nav-item"><button id="sign-up" onClick={() => setSignupModal(true)}>Create an account</button></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="container">
                    <div className="row content">
                        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-start">
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus id t
                                porta mauris eu lacus. Quam nulla pretium sed facilisis elementum
                                cursus massa. Orci sit donec elit, nibh eu. Tellus, enim sed faucibus ege</p>
                            <button onClick={() => setLoginModal(true)}>Login</button>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <img src="img/secured.png" alt="ballotbox" />
                        </div>
                    </div>
                    <footer>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <p>Advertise with us</p>
                                        </div>
                                        <div className="col-lg-2">
                                            <p>Terms and Condition</p>
                                        </div>
                                        <div className="col-lg-2">
                                            <p>Privacy Policy</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 d-flex justify-content-end">
                                    <img src="img/_2545301958192.png" alt="facebook" />
                                    <img src="img/insta.png" alt="instagram" />
                                    <img src="img/twitter.png" alt="twitter" />
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* signup modal  */}
                <Modal isOpen={signupModal} onRequestClose={() => setSignupModal(false)} id="signup">
                    <i className="fa-solid fa-circle-xmark" onClick={() => setSignupModal(false)} />
                    <h1>Signup on Ballot Box</h1>
                    <h4>Votes made on BallotBox are only limited to BallotBox and does not count for the National Election!</h4>
                    <div className="form">
                        <div className="row mb-3">
                            <div className="col-lg-6">
                                <GoogleLogin
                                    clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                    // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                    buttonText="Signup with your Googe Account"
                                    onSuccess={responseSuccessGoogle}
                                    onFailure={responseErrorGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                            <div className="col-lg-6">
                                <FacebookLogin
                                    appId="1162929354518536"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    // onClick={componentClicked}
                                    callback={responseFacebook}
                                    icon="fa-facebook"
                                    textButton="Signup with your Facebook Account"
                                />
                            </div>
                        </div>
                        <div className="or d-flex justify-content-between align-items-center mb-3">
                            <span />
                            <h5 className="mb-0">or</h5>
                            <span />
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <label htmlFor="fname">First Name</label>
                                <input id="fname" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="lname">Last Name</label>
                                <input id="lname" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="Username">Username</label>
                                <input id="Username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="Email">Email</label>
                                <input id="Email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="number">Phone Number</label>
                                <input id="number" type="tel" placeholder="+234  |   700234567891" value={number} onChange={(e) => setNumber(e.target.value)} />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="pass">Create Password</label>
                                <input id="pass" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <p>{error}</p>
                        <button id="create" className="mb-3" onClick={handleSignUp}>{loading ? "loading..." : "Create Account"}</button>
                        <h6>Already have an account? <span>Login</span></h6>
                    </div>
                </Modal>

                {/* verification modal */}
                <Modal isOpen={verificationModal} onRequestClose={() => setVerificationModal(false)} id="verification">
                    <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} />
                    <img src="img/verify.png" alt="email" />
                    <h1>One More Step!</h1>
                    <p>A Verification link has been sent to <span>{email}</span>. Please click on the link to verify
                        your account
                    </p>
                </Modal>

                {/* login modal */}
                <Modal isOpen={loginModal} onRequestClose={() => setLoginModal(false)} id="login-modal">
                    <i className="fa-solid fa-circle-xmark" onClick={() => setLoginModal(false)} />
                    <form action="">
                        <h1>Login to Vote on Ballot Box</h1>
                        <h2>Votes made on BallotBox are only limited to BallotBox and does not count for the National Election!
                        </h2>
                        <div className="d-flex flex-column align-items-center">
                            <GoogleLogin
                                clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                buttonText="Login with Googe Account"
                                onSuccess={responseSuccessGoogle}
                                onFailure={responseErrorGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                            <FacebookLogin
                                appId="1162929354518536"
                                autoLoad={false}
                                fields="name,email,picture"
                                // onClick={componentClicked}
                                callback={responseFacebook}
                                icon="fa-facebook"
                                textButton="Login with Facebook Account"
                            />
                        </div>
                        <div className="or d-flex justify-content-between align-items-center">
                            <span />
                            <h6 className="mb-0">or</h6>
                            <span />
                        </div>
                        <label htmlFor="username">Username or Phone Number</label>
                        <input type="text" id="username" placeholder="Username or Phone Number" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                        <label htmlFor="Password">Password</label>
                        <input type="password" id="Password" placeholder="***************" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        <div className="d-flex justify-content-between align-items-center remember mb-2">
                            <div>
                                <input type="checkbox" id="save" />
                                <label htmlFor="save">Remember Me</label>
                            </div>
                            <a href="#" onClick={() => {
                                setLoginModal(false)
                                setForgotPasswordModal(true)
                            }
                            }>Forgot Password?</a>
                        </div>
                        <p>{error}</p>
                        <button id="login-btn" onClick={(e) => handleLogin(e)}>{loading ? "loading..." : "Login"}</button>
                        <h6 className="mb-0">Don’t have an account? <span>Click Here to Create an Account</span></h6>
                    </form>
                </Modal>

                {/* forgot password modal */}
                <Modal isOpen={forgotPasswordModal} onRequestClose={() => setForgotPasswordModal(false)} id="forgot-password">
                    <i className="fa-solid fa-circle-xmark" onClick={() => setForgotPasswordModal(false)} />
                    <div className="content">
                        {/* enter email */}
                        {verificationView === 'email' &&
                            <>
                                <h1>Forgot Password</h1>
                                <label htmlFor="v-email">Input Email Address</label>
                                <input type="text" id="v-email" placeholder="xyz@email.com" value={verifyEmailInput} onChange={(e) => setVerifyEmailInput(e.target.value)} />
                                <p>{verifyEmailError}</p>
                                <button onClick={verifyEmail} >{verifyEmailLoading ? "loading..." : "Send"}</button>
                            </>
                        }

                        {/* otp */}
                        {verificationView === 'otp' &&
                            <>
                                <h2>Enter (OTP) One Time Password</h2>
                                <p>Kindly check your email xyz@email.com Enter the OTP sent from BallotBox</p>
                                <div className="otp-input d-flex justify-content-between">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                type="text"
                                                placeholder={index + 1}
                                                maxLength="1"
                                                key={index}
                                                value={data}
                                                onChange={e => handleChange(e.target, index)}
                                                onFocus={e => e.target.select()}
                                            />
                                        )
                                    })}
                                </div>
                                <p>{verifyEmailError}</p>
                                <button onClick={handleOtp} >{verifyEmailLoading ? "loading..." : "Send"}</button>
                            </>
                        }

                        {/* reset */}
                        {verificationView === 'reset' &&
                            <>
                                <h1>Reset your Password</h1>
                                <label htmlFor="">New Password</label>
                                <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <label htmlFor="">Confirm New Password</label>
                                <input type="password" placeholder="Enter New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <p>{verifyEmailError}</p>
                                <button onClick={handleNewPassword}>{verifyEmailLoading ? "loading..." : "Reset Password"}</button>
                            </>
                        }

                        {/* success */}
                        {verificationView === 'success' &&
                            <>
                                <h1>Password Successfully Reset</h1>
                                <h3>Password Successfully Reset</h3>
                                <button onClick={() => {
                                    setForgotPasswordModal(false)
                                    setVerificationView('email')
                                    setLoginModal(true)
                                }}>Login</button>
                            </>
                        }
                    </div>
                </Modal>
            </div>
        )
    }

    return (
        <div className="container-fluid">
            <Nav />
            {/* feed  */}
            <div className="home-feed container">
                <div className="row">
                    {/* aside  */}
                    <div className="col-lg-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8 main">
                        {/* header  */}
                        <div className="header">
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <div className="searchbar d-flex align-items-center justify-content-between">
                                <input type="text" placeholder="Search for Polls, Stories, Profiles or Courses" />
                                <img src="img/search-normal.png" alt="search" />
                            </div>
                        </div>
                        {/* advert  */}
                        <img src="img/newBanner.png" alt="advert" className="banner-add" />
                        {/* poll  */}
                        <div className="poll">
                            <div className="main">
                                <div className="header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3>2023 Presidential Poll</h3>
                                        <p className="mb-0">1,169,875 Total Polls</p>
                                    </div>
                                    <div className="d-flex">
                                        <button id="chart-btn"><img src="img/_3295429435616.svg" alt="Chart" />Chart</button>
                                        <button id="leaderboerd-btn" className="active"><img src="img/Group 376.svg" alt="Leaderboard" />Leaderboard</button>
                                    </div>
                                </div>
                                <div className="candidate mb-3">
                                    <div className="row align-items-center">
                                        <div className="col-lg-1">
                                            <img src="img/Candidate.png" className="img-fluid" alt="profile-img" />
                                        </div>
                                        <div className="col-lg-1 party">
                                            <img src="img/download 1.png" alt="party-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-1 gutter" />
                                        <div className="col-lg-6">
                                            <h4>Mike Jakande</h4>
                                            <p>Abundant Nigeria Renewal Party</p>
                                            <div className="bar">
                                                <div className="indicator" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                                            <h3>25%</h3>
                                            <h6 className=" mb-0">302,209 Votes</h6>
                                        </div>
                                        <div className="col-lg-1 d-flex justify-content-end">
                                            <div className="vote d-flex justify-content-center align-items-center">
                                                <img src="img/Vote.png" className="img-fluid" alt="vote" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="candidate mb-3">
                                    <div className="row align-items-center">
                                        <div className="col-lg-1">
                                            <img src="img/Candidate.png" className="img-fluid" alt="profile-img" />
                                        </div>
                                        <div className="col-lg-1 party">
                                            <img src="img/download 1.png" alt="party-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-1 gutter" />
                                        <div className="col-lg-6">
                                            <h4>Mike Jakande</h4>
                                            <p>Abundant Nigeria Renewal Party</p>
                                            <div className="bar">
                                                <div className="indicator" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                                            <h3>25%</h3>
                                            <h6 className=" mb-0">302,209 Votes</h6>
                                        </div>
                                        <div className="col-lg-1 d-flex justify-content-end">
                                            <div className="vote d-flex justify-content-center align-items-center">
                                                <img src="img/Vote.png" className="img-fluid" alt="vote" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="candidate mb-3">
                                    <div className="row align-items-center">
                                        <div className="col-lg-1">
                                            <img src="img/Candidate.png" className="img-fluid" alt="profile-img" />
                                        </div>
                                        <div className="col-lg-1 party">
                                            <img src="img/download 1.png" alt="party-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-1 gutter" />
                                        <div className="col-lg-6">
                                            <h4>Mike Jakande</h4>
                                            <p>Abundant Nigeria Renewal Party</p>
                                            <div className="bar">
                                                <div className="indicator" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                                            <h3>25%</h3>
                                            <h6 className=" mb-0">302,209 Votes</h6>
                                        </div>
                                        <div className="col-lg-1 d-flex justify-content-end">
                                            <div className="vote d-flex justify-content-center align-items-center">
                                                <img src="img/Vote.png" className="img-fluid" alt="vote" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="candidate mb-3">
                                    <div className="row align-items-center">
                                        <div className="col-lg-1">
                                            <img src="img/Candidate.png" className="img-fluid" alt="profile-img" />
                                        </div>
                                        <div className="col-lg-1 party">
                                            <img src="img/download 1.png" alt="party-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-1 gutter" />
                                        <div className="col-lg-6">
                                            <h4>Mike Jakande</h4>
                                            <p>Abundant Nigeria Renewal Party</p>
                                            <div className="bar">
                                                <div className="indicator" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                                            <h3>25%</h3>
                                            <h6 className=" mb-0">302,209 Votes</h6>
                                        </div>
                                        <div className="col-lg-1 d-flex justify-content-end">
                                            <div className="vote d-flex justify-content-center align-items-center">
                                                <img src="img/Vote.png" className="img-fluid" alt="vote" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer className="d-flex justify-content-between align-items-center">
                                <a href=""><i className="fas fa-share-alt" />Share Poll</a>
                                <button className="d-flex align-items-center">See Trending Polls<i className="fas fa-angle-right" /></button>
                            </footer>
                        </div>
                        {/* stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>Recent Stories</h3>
                                <div className="d-flex align-items-center">
                                    <h4><i className="fas fa-edit" />Write New Story</h4>
                                    <h4>See all Stories</h4>
                                </div>
                            </div>
                            <div className="carousel">
                                <div className="story">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" alt="story-img" className="mb-3" />
                                    <div className="like-btn d-flex justify-content-center align-items-center">
                                        <i className="far fa-heart" />
                                    </div>
                                    <p className="mb-1">President Buhari Receives Jersey No10 From Gianni Infantino</p>
                                </div>
                                <div className="story">
                                    <img src="img/pexels-greta-hoffman-9705698 1.png" alt="story-img" className="mb-3" />
                                    <div className="like-btn d-flex justify-content-center align-items-center">
                                        <i className="far fa-heart" />
                                    </div>
                                    <p className="mb-1">President Buhari Receives Jersey No10 From Gianni Infantino</p>
                                </div>
                                <div className="story">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" alt="story-img" className="mb-3" />
                                    <div className="like-btn d-flex justify-content-center align-items-center">
                                        <i className="far fa-heart" />
                                    </div>
                                    <p className="mb-1">President Buhari Receives Jersey No10 From Gianni Infantino</p>
                                </div>
                                <div className="story">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" alt="story-img" className="mb-3" />
                                    <div className="like-btn d-flex justify-content-center align-items-center">
                                        <i className="far fa-heart" />
                                    </div>
                                    <p className="mb-1">President Buhari Receives Jersey No10 From Gianni Infantino</p>
                                </div>
                                <div className="story">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" alt="story-img" className="mb-3" />
                                    <div className="like-btn d-flex justify-content-center align-items-center">
                                        <i className="far fa-heart" />
                                    </div>
                                    <p className="mb-1">President Buhari Receives Jersey No10 From Gianni Infantino</p>
                                </div>
                            </div>
                        </div>
                        {/* adds  */}
                        <div className="adds">
                            <div className="row">
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                        {/* profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">Recently Added Profile</h3>
                                <p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p>
                            </div>
                            <div className="profile">
                                <div className="row">
                                    <div className="col-lg-1">
                                        <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                                    </div>
                                    <div className="col-lg-11">
                                        <h3>Ahmed Bola Tinubu</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                                            leo dis viverra scelerisque volutpat
                                            quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                                            cursus enim, neque ipsum.</p>
                                        <footer>
                                            <div className="row align-items-center">
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Born: 8th February 1972</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Party: New Party</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <p className="mb-0"><i className="far fa-eye" />204</p>
                                                </div>
                                                <div className="col-lg-1">
                                                    <i className="fas fa-share-alt" id="views" />
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-between align-items-center">
                                                    <p className="mb-0">No Active Poll</p>
                                                    <img src="img/Group 515.png" alt="" />
                                                </div>
                                            </div>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                            <div className="profile">
                                <div className="row">
                                    <div className="col-lg-1">
                                        <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                                    </div>
                                    <div className="col-lg-11">
                                        <h3>Ahmed Bola Tinubu</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                                            leo dis viverra scelerisque volutpat
                                            quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                                            cursus enim, neque ipsum.</p>
                                        <footer>
                                            <div className="row align-items-center">
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Born: 8th February 1972</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Party: New Party</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <p className="mb-0"><i className="far fa-eye" />204</p>
                                                </div>
                                                <div className="col-lg-1">
                                                    <i className="fas fa-share-alt" id="views" />
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-between align-items-center">
                                                    <p className="mb-0">No Active Poll</p>
                                                    <img src="img/Group 516.png" alt="" />
                                                </div>
                                            </div>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                            <div className="profile">
                                <div className="row">
                                    <div className="col-lg-1">
                                        <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                                    </div>
                                    <div className="col-lg-11">
                                        <h3>Ahmed Bola Tinubu</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                                            leo dis viverra scelerisque volutpat
                                            quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                                            cursus enim, neque ipsum.</p>
                                        <footer>
                                            <div className="row align-items-center">
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Born: 8th February 1972</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4 className="mb-0">Party: New Party</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <p className="mb-0"><i className="far fa-eye" />204</p>
                                                </div>
                                                <div className="col-lg-1">
                                                    <i className="fas fa-share-alt" id="views" />
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-between align-items-center">
                                                    <p className="mb-0">No Active Poll</p>
                                                    <img src="img/Group 515.png" alt="" />
                                                </div>
                                            </div>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button>Go to Profiles</button>
                                <button>Load More Profiles</button>
                            </div>
                        </div>
                        {/* adds  */}
                        <div className="adds mt-5">
                            <div className="row">
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                                <div className="col-lg-4">
                                    <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                        {/* courses  */}
                        <div className="courses">
                            <div className="header d-flex justify-content-between align-items-center mb-2">
                                <h3>Courses (Hot Picks for you)</h3>
                                <a href>See All Courses<i className="fas fa-angle-right" /></a>
                            </div>
                            <div className="carousel">
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* add  */}
                        <img src="img/newBanner.png" alt="advert" />
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;