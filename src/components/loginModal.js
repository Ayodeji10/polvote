import React, { useState, useContext } from 'react'
import Modal from 'react-modal'
import { API } from "../components/apiRoot";
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../dataContext";
import { setUserSession } from "../utils/common";
import axios from "axios";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login"
Modal.setAppElement('#root')

function LoginModal({ loginModal, setLoginModal }) {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // login 
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

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
                    setContext({ ...context, user: response.data });
                    setLoginModal(false)
                }
            }).catch(error => {
                console.log(error.response.status)
                setLoading(false)
                if (error.response.status === 401) {
                    setError("Invalid email or password")
                    setLoginPassword('')
                }
                if (error.response.status === 422) {
                    setLoginPassword('')
                    setError('Kindly check your mail to verify this account')
                    console.error(error)
                }
                if (error.response.status !== 401 && error.response.status !== 422) {
                    setError("Something went wrong, please try again later")
                    setLoginPassword('')
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
                setLoginModal(false)
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

    return (
        <Modal isOpen={loginModal} onRequestClose={() => setLoginModal(false)} id="loginModal" className={`${context.darkMode ? 'dm' : ""}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => setLoginModal(false)} />
            <form onSubmit={(e) => handleLogin(e)}>
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
                    <h5 onClick={() => navigate('/login')}>Forgot Password?</h5>
                </div>
                <p className="error-msg">{error}</p>
                <button id="proceed" onClick={(e) => handleLogin(e)}>{loading ? <>Loading...  <i className="fa-solid fa-spinner fa-spin" /></> : "Login"}</button>
                <h6>Don’t have an account? <span>Signup</span></h6>
            </form>
        </Modal>
    )
}

export default LoginModal