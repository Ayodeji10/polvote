import React, { useState, useContext } from "react";
import { API } from "../components/apiRoot";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../dataContext";
import { setUserSession } from "../utils/common";
import axios from "axios";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login"
import Modal from 'react-modal'
Modal.setAppElement('#root')

const Login = () => {
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // modals 
    const [view, setView] = useState("main")
    const [verificationModal, setVerificationModal] = useState(false)
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
        if (firstName === "" || lastName === "" || username === "" || email === "" || number === "" || password === "") {
            setError("Please fill all Input Spaces")
            setLoading(false)
        } else if (username.charAt(0) !== "@") {
            setError("Username must start with '@'")
            setLoading(false)
        } else {
            axios.post(`${API.API_ROOT}/users/register`, { firstname: firstName, lastname: lastName, username: username, phonenumber: number, email: email.toLowerCase(), password: password }, { headers: { 'content-type': 'application/json' } })
                .then(response => {
                    setLoading(false);
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
    }

    // login 
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        axios.post(`${API.API_ROOT}/users/signin`, { email: loginEmail.toLowerCase(), password: loginPassword })
            .then(response => {
                // console.log(response)
                setLoading(false);
                if (response.status === 422) {
                    setError("kindly Check your mail to verify this account")
                    setLoginPassword('')
                }
                else {
                    setUserSession(response.data.token);
                    setContext({ ...context, user: response.data })
                    navigate('/')
                }
            }).catch(error => {
                console.log(error.response.status)
                setLoading(false)
                if (error.response.status === 401) {
                    setError("Invalid email or password")
                    setPassword('')
                }
                if (error.response.status === 422) {
                    setPassword('')
                    setError('Kindly check your mail to verify this account')
                    console.error(error)
                }
                if (error.response.status !== 401 && error.response.status !== 422) {
                    setError("Something went wrong, please try again later")
                    setPassword('')
                }
            })
    }

    // google signup 
    const responseSuccessGoogle = (response) => {
        // console.log(response)
        // console.log(response.tokenId)
        setLoading(true)
        axios({
            method: "post",
            url: `${API.API_ROOT}/users/googleLogin`,
            data: { tokenId: response.tokenId }
        }).then((response) => {
            // console.log(response)
            if (response.status === 200) {
                setLoading(false)
                setUserSession(response.data.token)
                setContext({ ...context, user: { token: response.data.token, ...response.data.user } })
                navigate('/')
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
        // console.log(response)
        setLoading(true)
        if (response) {
            axios({
                method: "post",
                url: `${API.API_ROOT}/users/facebookLogin`,
                data: { accessToken: response.accessToken, userID: response.userID }
            }).then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setLoading(false)
                    setUserSession(response.data.token)
                    setContext({ ...context, user: { token: response.data.token, ...response.data.user } })
                    window.location.reload()
                } else {
                    setError('SOmething went wrong, pls try again later')
                }
            }
            )
        }
    }

    const responseCancel = () => {
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

    return (
        <>
            <div className={`home ${context.darkMode ? 'dm' : ""}`}>
                <div className="container">
                    <header>
                        {context.darkMode ? <img src="/img/logo-dm.png" className="logo" alt="logo" onClick={() => navigate("/")} /> : <img src="/img/logo.png" className="logo" alt="logo" onClick={() => navigate("/")} />}
                        <div>
                            {context.darkMode ? <img src="/img/night.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: false })} /> : <img src="/img/theme.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: true })} />}
                            <button id="login-btn" onClick={() => {
                                if (view === 'main' || view === "signup") {
                                    setView('login')
                                } else {
                                    setView('signup')
                                }
                            }}>{view === 'signup' || view === 'main' ? "Login" : "Signup"}</button>
                        </div>
                    </header>
                    <div className="row body justify-content-lg-between align-items-center">
                        <div className="text col-lg-5 col-md-6 order-lg-1 order-md-1 order-sm-2 order-2 d-flex flex-column align-items-lg-end align-items-md-end align-items-sm-center align-items-center">
                            <img src="/img/secured.png" alt="secured" />
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <p>Polvote provides you with the ability to see profiles of Political Aspirants contesting for leadership, governance and economic positions near your locality. It also offers you a news feed which takes contributions from Political enthusiasts discussing simple to complex topics on social media including you. It also gives you the ability to vote for these aspiring leaders in contests created for the internet via Polvote.</p>
                        </div>
                        <div className={`order-lg-2 order-md-2 order-sm-1 order-1 ${view === 'signup' ? "col-lg-6 col-md-6" : "col-lg-4 col-md-6"} `} >
                            {/* main  */}
                            {view === "main" &&
                                <div className="main">
                                    <h3>By signing up, you agree to the <Link to={'/terms-and-conditions'}>Terms and condition</Link> and <Link to={'/privacy-policy'}>Privacy Policy.</Link></h3>
                                    <div id="google-btn">
                                        <GoogleLogin
                                            clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                            // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                            buttonText="Signup with Google"
                                            onSuccess={responseSuccessGoogle}
                                            onFailure={responseErrorGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>
                                    {/* <div id="google-btn">
                                        <FacebookLogin
                                            appId="1164223311085368"
                                            autoLoad={false}
                                            isMobile={false}
                                            fields="name,email,picture"
                                            onFailure={responseCancel}
                                            callback={responseFacebook}
                                            icon="fa-facebook"
                                            textButton="Sign up with Facebook "
                                        />
                                    </div> */}
                                    <div className="or d-flex justify-content-between align-items-center">
                                        <span></span>
                                        <h6>or</h6>
                                        <span></span>
                                    </div>
                                    <button className="home-btn" onClick={() => setView('signup')}>Signup with email</button>
                                    <h5 className="mb-0" onClick={() => setView("login")}>Already have an account? <span>Login</span></h5>
                                </div>
                            }
                            {/* login  */}
                            {view === "login" &&
                                <form className="login" onSubmit={(e) => handleLogin(e)}>
                                    <h1>Login to Vote on Ballot Box</h1>
                                    <h4>Votes made on Polvote are only limited to Polvote and does not count for the National Election!</h4>
                                    <div id="google-btn">
                                        <GoogleLogin
                                            clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                            // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                            buttonText="Login with Google"
                                            onSuccess={responseSuccessGoogle}
                                            onFailure={responseErrorGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>
                                    {/* <div id="google-btn">
                                        <FacebookLogin
                                            appId="1162929354518536"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            // onClick={componentClicked}
                                            callback={responseFacebook}
                                            icon="fa-facebook"
                                            textButton="Login with Facebook "
                                        />
                                    </div> */}
                                    <div className="or d-flex justify-content-between align-items-center">
                                        <span></span>
                                        <h6>or</h6>
                                        <span></span>
                                    </div>
                                    <label htmlFor="login-email">Email Address</label>
                                    <input type="text" id="login-email" placeholder="Email Address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                    <label htmlFor="login-password">Password</label>
                                    <input type="password" id="login-password" placeholder="***************" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <input type="checkbox" id="remember" />
                                            <label htmlFor="remember" id="remember-label">Remember me</label>
                                        </div>
                                        <h5 onClick={() => { setForgotPasswordModal(true) }}>Forgot Password?</h5>
                                    </div>
                                    <p className="error-msg">{error}</p>
                                    <button id="proceed" onClick={(e) => handleLogin(e)}>{loading ? <>Loading...  <i className="fa-solid fa-spinner fa-spin" /></> : "Login"}</button>
                                    <h6>Don’t have an account? <span onClick={() => setView("signup")}>Signup</span></h6>
                                </form>
                            }
                            {/* signup  */}
                            {view === "signup" &&
                                <form className="signup" onSubmit={handleSignUp}>
                                    <h1>Signup on Polvote</h1>
                                    <h4>Votes made on Polvote are only limited to Polvote and does not count for the National Election!</h4>
                                    <div className="row justify-content-center mb-4">
                                        <div className="col-lg-7 col-12">
                                            <div id="google-btn">
                                                <GoogleLogin
                                                    clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                                    // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                                    buttonText="Login with Google"
                                                    onSuccess={responseSuccessGoogle}
                                                    onFailure={responseErrorGoogle}
                                                    cookiePolicy={'single_host_origin'}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className="col-lg-6">
                                            <div id="google-btn">
                                                <FacebookLogin
                                                    appId="1162929354518536"
                                                    autoLoad={false}
                                                    fields="name,email,picture"
                                                    // onClick={componentClicked}
                                                    callback={responseFacebook}
                                                    icon="fa-facebook"
                                                    textButton="Login with Facebook "
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="or d-flex justify-content-between align-items-center">
                                        <span></span>
                                        <h6>or</h6>
                                        <span></span>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="fname">First Name</label>
                                            <input id="fname" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="lname">Last Name</label>
                                            <input id="lname" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="Username">Username</label>
                                            <input id="Username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="Email">Email</label>
                                            <input id="Email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="number">Phone Number</label>
                                            <input id="number" type="tel" placeholder="+234  |   700234567891" value={number} onChange={(e) => setNumber(e.target.value)} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <label htmlFor="pass">Create Password</label>
                                            <input id="pass" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <p className="error-msg">{error}</p>
                                    <button id="create" className="mb-3" onClick={handleSignUp}>{loading ? <>Loading...  <i className="fa-solid fa-spinner fa-spin" /></> : "Create Account"}</button>
                                    <h6 onClick={() => setView("login")}>Already have an account? <span>Login</span></h6>
                                </form>
                            }
                        </div>
                    </div>
                    {/* footer  */}
                    <footer id="footer" className={`${context.darkMode ? 'dm' : ""}`}>
                        <div className="row">
                            <div className="col-lg-8 col-md-7 col-sm-6 col-7 d-flex text">
                                {/* <Link>Advertise with us</Link> */}
                                <Link to={'/terms-and-conditions'}>Terms and Condition</Link>
                                <Link to={'/privacy-policy'}>Privacy Policy</Link>
                            </div>
                            <div className="col-lg-4 col-md-5 col-sm-6 col-5 d-flex justify-content-lg-end justify-content-md-end justify-content-sm-end justify-content-between">
                                <a href="https://youtube.com/channel/UCkcn0Kv_w_Qe0MfZ7Hhe6lg" target="_blank"><img src="/img/youtube.png" alt="youtube" className='social' /></a>
                                <a href="https://www.facebook.com/Polvoteofficial-115809974445682/" target="_blank"><img src="/img/fb.png" alt="facebook" className='social' /></a>
                                <a href="https://www.instagram.com/polvoteofficial/" target="_blank"><img src="/img/insta.png" alt="instagram" className='social' /></a>
                                <a href="https://twitter.com/pol_vote?t=iVqZBrU9MA793b4K1-YLwQ" target="_blank"><img src="/img/twitter.png" alt="twitter" className='social' /></a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            {/* verification modal */}
            <Modal isOpen={verificationModal} onRequestClose={() => setVerificationModal(false)} id="verification" className={`${context.darkMode ? 'dm' : ""}`}>
                <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} />
                <img src="img/verify.png" alt="email" />
                <h1>One More Step!</h1>
                <p>A Verification link has been sent to <span>{email}</span>. Please click on the link to verify
                    your account. <span id="spam-text">Also check your SPAM folder in case it didn't drop in your Inbox</span>
                </p>
            </Modal>

            {/* forgot password modal */}
            <Modal isOpen={forgotPasswordModal} onRequestClose={() => setForgotPasswordModal(false)} id="forgot-password" className={`${context.darkMode ? 'dm' : ""}`}>
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
                            <i className="fa-solid fa-arrow-left-long otp-back" onClick={() => setVerificationView("email")} />
                            <h2>Enter (OTP) One Time Password</h2>
                            <p>Kindly check your email {verifyEmailInput}. Enter the OTP sent from Polvote, <span>Also check your SPAM folder in case it didn't drop in your Inbox</span></p>
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
                            }}>Login</button>
                        </>
                    }
                </div>
            </Modal>
        </>
    );
}
export default Login;