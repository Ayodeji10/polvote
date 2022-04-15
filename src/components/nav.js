import React from "react";
import { Link } from "react-router-dom";


const Nav = () => {

    return (
        <div className="navigation-container">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <Link to={"/"} className="navbar-brand logo"><img src="/img/Logo.png" alt="logo" /></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span />
                            <span />
                            <span />
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav mb-2 mb-lg-0">
                                <li className="nav-item br"><Link to={"/polls"} className="nav-link">Polls</Link></li>
                                <li className="nav-item br"><Link to={"/stories"} className="nav-link">Stories</Link></li>
                                <li className="nav-item br"><Link to={"/profiles"} className="nav-link">Profiles</Link></li>
                                <li className="nav-item br"><a className="nav-link" id="course" href="#">Take Course</a>
                                </li>
                            </ul>
                            <ul className="navbar-nav nav2">
                                <li className="nav-item d-flex align-items-center"><img src="/img/theme.png" alt="theme" /></li>
                                <li className="nav-item"><a className="nav-link" href="#"><img src="/img/Group 42.png" alt="country" /></a></li>
                                <li className="nav-item"><a href className="nav-link"><img src="/img/Notification 1.png" alt="" /></a></li>
                                <li className="nav-item profile-img d-flex align-items-center">
                                    <Link to={"/user-profile"} className="nav-link"><img src="/img/unsplash_g7oN-4RMV_M.png" alt="profile-img" /></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Nav;





