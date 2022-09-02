import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../dataContext";
import AuthModals from "./authenticationModlas";
import NavAspirantsSvg from "./svg/NavAspirantsSvg";
import NavHomeSvg from "./svg/NavHomeSvg";
import NavPollsSvg from "./svg/NavPollsSvg";
import NavStoriesSvg from "./svg/NavStoriesSvg";

const Nav = () => {

    const { context, setContext } = useContext(DataContext)

    // modals 
    const [loginModal, setLoginModal] = useState(false)
    const [signupModal, setSignupModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)

    // toggle nav height 
    window.addEventListener('scroll', () => {
        let navContainer = document.querySelector(".navigation-container");
        let windowPosition = window.scrollY > 0;
        navContainer.classList.toggle('scroll-active', windowPosition)
    })

    return (
        <div className="navigation-container d-flex align-items-center fixed-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <Link to={"/"} className="navbar-brand logo">
                            {context.darkMode ? <img src="/img/logo-dm.png" alt="logo" /> : <img src="/img/logo.png" alt="logo" />}
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span />
                            <span />
                            <span />
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                                <li className={`nav-item br ${window.location.pathname === "/" && 'active'}`}>
                                    <Link to={"/"} className="nav-link">
                                        <NavHomeSvg />
                                        Home
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/polls") && 'active'}`}>
                                    <Link to={"/polls"} className="nav-link">
                                        <NavPollsSvg />
                                        Polls
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/stories") && 'active'}`}>
                                    <Link to={"/stories"} className="nav-link">
                                        <NavStoriesSvg />
                                        Posts
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/profiles") && 'active'}`}>
                                    <Link to={"/profiles"} className="nav-link">
                                        <NavAspirantsSvg />
                                        Aspirants
                                    </Link>
                                </li>
                                {/* <li className="nav-item br"><a className="nav-link" id="course" href="#">Take Course</a></li> */}
                            </ul>
                            <ul className="navbar-nav nav2 align-items-center">
                                <li className="nav-item d-flex align-items-center">
                                    {context.darkMode ? <img src="/img/night.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: false })} /> : <img src="/img/theme.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: true })} />}
                                    {/* <img src="/img/theme.png" alt="theme" onClick={() => setContext({ ...context, darkMode: !context.darkMode })} /> */}
                                </li>
                                {/* <li className="nav-item"><a className="nav-link" href="#"><img src="/img/Group 42.png" alt="country" /></a></li> */}
                                {/* <li className="nav-item"><a href className="nav-link"><img src="/img/Notification 1.png" alt="" /></a></li> */}
                                {localStorage.getItem('ballotbox_token') === null ?
                                    <>
                                        <li className={`nav-item ${window.location.pathname.includes("/stories") && 'active'}`}>
                                            <button onClick={() => setLoginModal(true)}>Login</button>
                                        </li>
                                        <li className={`nav-item ${window.location.pathname.includes("/stories") && 'active'}`}>
                                            <button id="signup-nav-btn" onClick={() => setSignupModal(true)}>Sign Up</button>
                                        </li>
                                    </> :
                                    <li className="nav-item profile-img d-flex align-items-center">
                                        <Link to={"/user-profile"} className="nav-link">
                                            {context.user.image !== null && context.user.image !== undefined ?
                                                <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                                <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                            }
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            {/* auth modals  */}
            <AuthModals loginModal={loginModal} setLoginModal={setLoginModal} signupModal={signupModal} setSignupModal={setSignupModal} verificationModal={verificationModal} setVerificationModal={setVerificationModal} />
        </div>
    );
};

export default Nav;





