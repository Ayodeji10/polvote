import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import { useParams, useNavigate } from "react-router-dom";
import { setUserSession } from "../utils/common";
import axios from "axios";
import Modal from 'react-modal'
Modal.setAppElement('#root')


const Login = () => {
    // context 
    const { context, setContext } = useContext(DataContext)

    // params 
    const { Id } = useParams()

    // history 
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // modals 
    const [signupModal, setSignupModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)
    const [loginModal, setLoginModal] = useState(true)

    // signin 
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
                console.log({ email: loginEmail, password: loginPassword })
                setLoading(false);
                console.log(response)
                setUserSession(response.data.token);
                setContext({ ...context, user: response.data })
                navigate('/')
            }).catch(error => {
                setLoading(false)
                if (error.response.status === 401 || error.response.status === 400) {
                    setError(error.response.data.message)
                    setPassword('')
                }
                else {
                    setError('Something went wrong, please try again')
                }
                console.error(error)
            })
    }

    // activate user 
    const activateUser = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/users/activate/${Id}`)
    }

    useEffect(() => {
        if (Id && Id !== '') activateUser()
    }, [Id])

    return (
        <div className="container-fluid landing-page">
            {/* navigation */}
            <div className="navigation-container">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            <a href="#" className="navbar-brand logo"><img src="/img/Logo2.png" /></a>
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
                        <img src="/img/secured.png" alt="ballotbox" />
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
                            <button>Signup with your Googe Account</button>
                        </div>
                        <div className="col-lg-6">
                            <button>Signup with your Facebook Account</button>
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
                    {error}
                    <button id="create" className="mb-3" onClick={handleSignUp}>{loading ? "loading..." : "Create Account"}</button>
                    <h6>Already have an account? <span>Login</span></h6>
                </div>
            </Modal>

            {/* verification modal */}
            <Modal isOpen={verificationModal} onRequestClose={() => setVerificationModal(false)} id="verification">
                <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} />
                <img src="img/verify.png" alt="email" />
                <h1>One More Step!</h1>
                <p>A Verification link has been sent to <span>examplemail@xyz.com</span>. Please click on the link to verify
                    your account
                </p>
            </Modal>

            {/* login modal */}
            <Modal isOpen={loginModal} onRequestClose={() => setLoginModal(false)} id="login-modal">
                <i className="fa-solid fa-circle-xmark" onClick={() => setLoginModal(false)} />
                <form action>
                    <h1>Login to Vote on Ballot Box</h1>
                    <h2>Votes made on BallotBox are only limited to BallotBox and does not count for the National Election!
                    </h2>
                    <button>Login with Googe Account</button>
                    <button>Login with Facebook Account</button>
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
                        <a href>Forgot Password?</a>
                    </div>
                    <button id="login-btn" onClick={(e) => handleLogin(e)}>{loading ? "loading..." : "Login"}</button>
                    <h6 className="mb-0">Don’t have an account? <span>Click Here to Create an Account</span></h6>
                </form>
            </Modal>
        </div>
    );
}
export default Login;