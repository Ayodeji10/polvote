import React, { useContext } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../dataContext";
Modal.setAppElement('#root')

function LoginModal({ loginModal, setLoginModal }) {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    return (
        <Modal isOpen={loginModal} onRequestClose={() => setLoginModal(false)} id="loginModal" className={`${context.darkMode ? 'dm' : ""}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => setLoginModal(false)} />
            {context.darkMode ?
                <img src="/img/logo-dm.png" alt="polvote" /> :
                <img src="/img/logo.png" alt="polvote" />
            }
            <p>Login or Sign up to participate in a poll, read political stories, discover political aspirants, earn and many more.</p>
            <div className="d-flex justify-content-center gap-5">
                <button id='bt-1' onClick={() => navigate("/login")}>Login</button>
                <button id='bt-2' onClick={() => navigate("/login")}>Sign Up</button>
            </div>
        </Modal>
    )
}

export default LoginModal