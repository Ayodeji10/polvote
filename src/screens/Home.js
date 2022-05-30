import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../dataContext";
import { useNavigate, Link } from "react-router-dom";
import { setUserSession } from "../utils/common";
import axios from "axios";
import { API } from "../components/apiRoot";
import GoogleLogin from "react-google-login";
// import FacebookLogin from "react-facebook-login"
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import Modal from 'react-modal'
import HomeStoryCard from "../components/homeStoryCard";
import SingleProfileCard from "../components/singleProfileCard";
import HomePollCard from "../components/homePollCard";
import WriteStoryModal from "../components/writeStoryModal";
import EkitiPolls from "../components/ekitiPolls";
import OsunPolls from "../components/osunPolls";
import Helmet from "react-helmet";
// import Ad1 from "../components/ad1"
// import { Adsense } from '@ctrl/react-adsense';
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
    const [loginModal, setLoginModal] = useState(false)
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
                // console.log(response)
                setLoading(false);
                if (response.status === 422) {
                    setError("kindly Check your mail to verify this account")
                    setPassword('')
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
    // const responseFacebook = (response) => {
    //     // console.log(response)
    //     setLoading(true)
    //     if (response) {
    //         axios({
    //             method: "post",
    //             url: `${API.API_ROOT}/users/facebookLogin`,
    //             data: { accessToken: response.accessToken, userID: response.userID }
    //         }).then((response) => {
    //             console.log(response)
    //             if (response.status === 200) {
    //                 setLoading(false)
    //                 setUserSession(response.data.token)
    //                 setContext({ ...context, user: { token: response.data.token, ...response.data.user } })
    //                 window.location.reload()
    //             } else {
    //                 setError('SOmething went wrong, pls try again later')
    //             }
    //         }
    //         )
    //     }
    // }

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

    // home functions 
    // search 
    const search = () => {
        if (context.homeSearchKey !== "") {
            navigate(`/search=${context.homeSearchKey}`)
        }
    }

    // enter key to search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search()
        }
    }


    // story modal 
    const [writeStoryModal, setWriteStoryModal] = useState(false)

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    // fetch stories, aspirants, and presidential poll
    const [stories, setStories] = useState([])
    const [storyFetch, setStoryFetch] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setStories(response.data)
        setStoryFetch(false)
    }

    const [aspirants, setAspirants] = useState([])
    const [aspirantFetch, setAspirantFetch] = useState(true)
    const [profileLength, setProfileLength] = useState(3)
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
        setAspirantFetch(false)
    }

    useEffect(() => {
        fetchStories()
        fetchAspirants()
    }, [])

    // google ad
    // useEffect(() => {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }, [])
    // useEffect(() => {
    //     const pushAd = () => {
    //         try {
    //             const adsbygoogle = window.adsbygoogle
    //             console.log({ adsbygoogle })
    //             adsbygoogle.push({})
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }

    //     let interval = setInterval(() => {
    //         // Check if Adsense script is loaded every 300ms
    //         if (window.adsbygoogle) {
    //             pushAd()
    //             // clear the interval once the ad is pushed so that function isn't called indefinitely
    //             clearInterval(interval)
    //         }
    //     }, 300)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    if (localStorage.getItem('ballotbox_token') == null) {
        return (
            <>
                <div className={`home ${context.darkMode ? 'dm' : ""}`}>
                    <div className="container">
                        <header>
                            {context.darkMode ? <img src="/img/logo-dm.png" className="logo" alt="logo" /> : <img src="/img/logo.png" className="logo" alt="logo" />}
                            <div>
                                {context.darkMode ? <img src="/img/night.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: false })} /> : <img src="/img/theme.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: true })} />}
                                <button id="login-btn" onClick={() => setLoginModal(true)}>Login</button>
                                <button id="create-account-btn" onClick={() => setSignupModal(true)}>Create an account</button>
                            </div>
                        </header>
                        <div className="row">
                            <div className="col-lg-6 col-md-7">
                                <div className="main">
                                    <h1>Explore Politics, Learn and Share Insights Online</h1>
                                    <h2>Login with any of your social Accounts</h2>
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
                                            appId="1162929354518536"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            // onClick={componentClicked}
                                            callback={responseFacebook}
                                            icon="fa-facebook"
                                            textButton="Login with Facebook Account"
                                        />
                                    </div> */}
                                    <div className="or d-flex justify-content-between align-items-center">
                                        <span></span>
                                        <h6>or</h6>
                                        <span></span>
                                    </div>
                                    <button className="home-btn one" onClick={() => setSignupModal(true)}>Signup with email</button>
                                    <h3>By signing up, you agree to the <Link to={'/terms-and-conditions'}>Terms and condition</Link> and <Link to={'/privacy-policy'}>Privacy Policy.</Link></h3>
                                    <button className="home-btn two" onClick={() => setLoginModal(true)}>Login</button>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-5 d-flex align-items-center justify-content-end justify-content-sm-center">
                                <img src="/img/secured.png" alt="secured" className="img-fluid mb-sm-5 mb-3" />
                            </div>
                        </div>
                        {/* footer  */}
                        <footer id="footer" className={`${context.darkMode ? 'dm' : ""}`}>
                            <div className="row justify-content-lg-between justify-content-md-between top">
                                <div className="col-lg-8 col-md-8 d-flex align-items-start">
                                    {context.darkMode ? <img src="/img/pl.png" alt="logo" className="logo" /> : <img src="/img/p.png" alt="logo" className="logo" />}
                                    <div>
                                        <h1>Pol<span>vote</span></h1>
                                        <p className="mb-0">Polvote provides you with the ability to see profiles of Political Aspirants contesting for leadership, governance and economic positions near your locality. It also offers you a news feed which takes contributions from Political enthusiasts discussing simple to complex topics on social media including you. It also gives you the ability to vote for these aspiring leaders in contests created for the internet via Polvote.</p>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-3 d-flex flex-column justify-content-end mt-md-3 mt-sm-3 mt-4">
                                    <h5>FOLLOW US</h5>
                                    <div className="d-flex justify-content-between">
                                        <a href="https://youtube.com/channel/UCkcn0Kv_w_Qe0MfZ7Hhe6lg" target="_blank"><img src="/img/youtube.png" alt="youtube" className='social' /></a>
                                        <a href="https://www.facebook.com/Polvoteofficial-115809974445682/" target="_blank"><img src="/img/fb.png" alt="facebook" className='social' /></a>
                                        <a href="https://www.instagram.com/polvoteofficial/" target="_blank"><img src="/img/insta.png" alt="instagram" className='social' /></a>
                                        <a href="https://twitter.com/pol_vote?t=iVqZBrU9MA793b4K1-YLwQ" target="_blank"><img src="/img/twitter.png" alt="twitter" className='social' /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom d-flex">
                                {/* <Link>Advertise with us</Link> */}
                                <Link to={'/terms-and-conditions'}>Terms and Condition</Link>
                                <Link to={'/privacy-policy'}>Privacy Policy</Link>
                            </div>
                        </footer>
                    </div>
                </div>

                {/* signup modal  */}
                <Modal isOpen={signupModal} onRequestClose={() => setSignupModal(false)} id="signup" className={`${context.darkMode ? 'dm' : ""}`}>
                    <i className="fa-solid fa-circle-xmark" onClick={() => setSignupModal(false)} />
                    <h1>Signup on Polvote</h1>
                    <h4>Votes made on Polvote are only limited to Polvote and does not count for the National Election!</h4>
                    <div className="form">
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
                        <p>{error}</p>
                        <button id="create" className="mb-3" onClick={handleSignUp}>{loading ? "loading..." : "Create Account"}</button>
                    </div>
                </Modal>

                {/* login modal  */}
                <Modal isOpen={loginModal} onRequestClose={() => setLoginModal(false)} id="loginModal" className={`${context.darkMode ? 'dm' : ""}`}>
                    <i className="fa-solid fa-circle-xmark" onClick={() => setLoginModal(false)} />
                    <h1>Login to Vote on Ballot Box</h1>
                    <h4>Votes made on Polvote are only limited to Polvote and does not count for the National Election!</h4>
                    <div className="w-400">
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
                                textButton="Login with Facebook Account"
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
                        <h5 onClick={() => {
                            setLoginModal(false)
                            setForgotPasswordModal(true)
                        }}>Forgot Password?</h5>
                        <p className="error-msg">{error}</p>
                        <button id="proceed" onClick={(e) => handleLogin(e)}>{loading ? "loading..." : "Login"}</button>
                        <h6>Don’t have an account? <span onClick={() => setLoginModal(false)}>Signup</span></h6>
                    </div>
                </Modal>

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
        )
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`} >
            {/* nav  */}
            <Nav />
            {/* feed  */}
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1 col-md-0" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        {/* header  */}
                        <div className="header">
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <div className="searchbar d-flex align-items-center justify-content-between">
                                <input type="text" placeholder="Search for Polls, Stories, and Profiles" value={context.homeSearchKey} onChange={(e) => setContext({ ...context, homeSearchKey: e.target.value })} onKeyPress={handleKeyPress} />
                                <img src="img/search-normal.png" alt="search" onClick={search} />
                            </div>
                        </div>
                        {/* advert  */}
                        {/* <img src="img/newBanner.png" alt="advert" className="banner-add" /> */}
                        {/* <Ad1 /> */}
                        {/* <Adsense
                            client="ca-pub-7640562161899788"
                            slot="7259870550"
                            style={{ width: 500, height: 300 }}
                            format=""
                        /> */}
                        {/* poll  */}
                        <HomePollCard />
                        {/* stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>Recent Stories</h3>
                                <div className="d-flex align-items-center">
                                    <h4 onClick={() => setWriteStoryModal(true)}><i className="fas fa-edit" />Write New Story</h4>
                                    {/* write story modal  */}
                                    {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                                    <h4 onClick={() => navigate('/stories')}>See all Stories</h4>
                                </div>
                            </div>
                            <div className="carousel">
                                {!storyFetch &&
                                    <>
                                        {stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0).slice(Math.max(stories.filter(story => story.image.length !== 0).length - 7, 1)).map((story, index) => {
                                            return (
                                                <HomeStoryCard story={story} key={index} />
                                            )
                                        }).reverse()}
                                    </>
                                }
                            </div>
                        </div>
                        {/* adds  */}
                        {/* <div className="adds">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">Recently added profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(Math.max(aspirants.filter(aspirant => aspirant.status === "1").length - profileLength, 1)).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    }).reverse()}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="go-to-profile">Go to Profiles</button>
                                <button onClick={() => setProfileLength(prev => prev + 1)} id="load-more">Load More Profiles</button>
                            </div>
                        </div>
                        {/* Ekiti polls  */}
                        <EkitiPolls />
                        {/* more stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>More Stories</h3>
                                <div className="d-flex align-items-center">
                                    {/* <h4 onClick={() => setWriteStoryModal(true)}><i className="fas fa-edit" />Write New Story</h4> */}
                                    {/* write story modal  */}
                                    {/* {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />} */}
                                    <h4 onClick={() => navigate('/stories')}>See all Stories</h4>
                                </div>
                            </div>
                            <div className="carousel">
                                {!storyFetch &&
                                    <>
                                        {stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0).map((story, index) => {
                                            return (
                                                <HomeStoryCard story={story} key={index} />
                                            )
                                        })}
                                    </>
                                }
                            </div>
                        </div>
                        {/* more profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">More profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(0, 4).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    })}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="go-to-profile">Go to Profiles</button>
                                {/* <button onClick={() => setProfileLength(prev => prev + 1)} id="load-more">Load More Profiles</button> */}
                            </div>
                        </div>
                        {/* osun polls  */}
                        <OsunPolls />
                        {/* adds  */}
                        {/* <div className="adds mt-5">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* courses  */}
                        {/* <div className="courses">
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
                        </div> */}
                        {/* add  */}
                        {/* <img src="img/newBanner.png" alt="advert" /> */}
                        {/* <div>
                            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                crossorigin="anonymous"></script>
                            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                            <script>
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </script>
                        </div> */}
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;