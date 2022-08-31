import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function LoginPrompt({ setLoginModal, setSignupModal }) {
    // history 
    const navigate = useNavigate()

    const [prompt, setPrompt] = useState(true)
    return (
        <>
            {prompt &&
                <div className="login-prompt">
                    <i class="fa-solid fa-xmark" onClick={() => setPrompt(false)}></i>
                    <div className="row align-items-center">
                        <div className="col-lg-9 col-md-8 col-sm-7">
                            <p className='mb-0'>Login or Sign up to participate in a poll, read political stories, discover political aspirants, earn and many more</p>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-5 d-flex justify-content-lg-end justify-content-md-end justify-content-sm-end">
                            <button id='login-btn' onClick={() => setLoginModal(true)}>Login</button>
                            <button id='signup-btn' onClick={() => setSignupModal(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default LoginPrompt