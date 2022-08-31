import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import { setUserSession } from "../utils/common";
import axios from "axios";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login"
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SignUpModal({ signupModal, setSignupModal }) {
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // signup 
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("@")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [password, setPassword] = useState("")

    const handleSignUp = (e) => {
        e.preventDefault()
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
                    // setVerificationModal(true)
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

    return (
        <Modal isOpen={signupModal} onRequestClose={() => setSignupModal(false)} id="signupModal" className={`${context.darkMode ? 'dm' : ""}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => setSignupModal(false)} />
            <form className="signup" onSubmit={(e) => handleSignUp(e)}>
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
                <h6>Already have an account? <span>Login</span></h6>
            </form>
        </Modal>
    )
}

export default SignUpModal