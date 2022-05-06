import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../dataContext";

const Nav = () => {

    const { context } = useContext(DataContext)

    return (
        <div className="navigation-container fixed-top">
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
                            <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                                <li className={`nav-item br ${window.location.pathname === "/" && 'active'}`}>
                                    <Link to={"/"} className="nav-link">
                                        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.91667 10.4957V13.9957H12.25C13.2165 13.9957 14 13.2122 14 12.2457V6.92511C14.0001 6.62206 13.8824 6.33084 13.6716 6.11311L8.71443 0.754002C7.83975 -0.192366 6.36352 -0.250471 5.41715 0.624201C5.3722 0.665764 5.32889 0.709049 5.28735 0.754002L0.338926 6.11136C0.121762 6.33 -8.19898e-05 6.62569 4.13938e-08 6.93386V12.2457C4.13938e-08 13.2122 0.783508 13.9957 1.75 13.9957H4.08332V10.4957C4.09423 8.90504 5.37849 7.6061 6.92907 7.5687C8.53152 7.53003 9.90445 8.85109 9.91667 10.4957Z" fill="#007AF3" />
                                            <path d="M7 8.74561C6.03351 8.74561 5.25 9.52911 5.25 10.4956V13.9956H8.75V10.4956C8.75 9.52911 7.96649 8.74561 7 8.74561Z" fill="#007AF3" />
                                        </svg>
                                        Home
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/polls") && 'active'}`}>
                                    <Link to={"/polls"} className="nav-link">
                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_2963_15355)">
                                                <path d="M15.182 5.14726C14.8694 4.787 14.483 4.49812 14.0491 4.30017C13.6151 4.10222 13.1437 3.99983 12.6667 3.99993H10.0073L10.2313 2.63926C10.3106 2.1601 10.215 1.66842 9.9619 1.25389C9.70884 0.839356 9.3152 0.529602 8.85279 0.381121C8.39037 0.23264 7.88999 0.255327 7.4429 0.445043C6.99582 0.634759 6.63183 0.978864 6.41732 1.41459L5.33331 3.61126V13.9999H12.2C13.0023 13.9967 13.7768 13.7055 14.3825 13.1794C14.9883 12.6533 15.3851 11.9272 15.5007 11.1333L15.9707 7.79993C16.0371 7.32708 16.0011 6.84547 15.865 6.38777C15.7289 5.93007 15.496 5.507 15.182 5.14726Z" fill="white" />
                                                <path d="M0 7.33333L0 10.6667C0.00105857 11.5504 0.352588 12.3976 0.97748 13.0225C1.60237 13.6474 2.4496 13.9989 3.33333 14H4V4H3.33333C2.4496 4.00106 1.60237 4.35259 0.97748 4.97748C0.352588 5.60237 0.00105857 6.4496 0 7.33333H0Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2963_15355">
                                                    <rect width={16} height={16} fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        Polls
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/stories") && 'active'}`}>
                                    <Link to={"/stories"} className="nav-link">
                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.4444 2H2.55556C1.7 2 1 2.7 1 3.55556V14.4444C1 15.3 1.7 16 2.55556 16H13.4444C14.3 16 15 15.3 15 14.4444V3.55556C15 2.7 14.3 2 13.4444 2ZM7.22222 12.8889H4.11111C3.68333 12.8889 3.33333 12.5389 3.33333 12.1111C3.33333 11.6833 3.68333 11.3333 4.11111 11.3333H7.22222C7.65 11.3333 8 11.6833 8 12.1111C8 12.5389 7.65 12.8889 7.22222 12.8889ZM9.55556 9.77778H6.44444C6.01667 9.77778 5.66667 9.42778 5.66667 9C5.66667 8.57222 6.01667 8.22222 6.44444 8.22222H9.55556C9.98333 8.22222 10.3333 8.57222 10.3333 9C10.3333 9.42778 9.98333 9.77778 9.55556 9.77778ZM11.8889 6.66667H8.77778C8.35 6.66667 8 6.31667 8 5.88889C8 5.46111 8.35 5.11111 8.77778 5.11111H11.8889C12.3167 5.11111 12.6667 5.46111 12.6667 5.88889C12.6667 6.31667 12.3167 6.66667 11.8889 6.66667Z" fill="white" />
                                        </svg>
                                        Stories
                                    </Link>
                                </li>
                                <li className={`nav-item br ${window.location.pathname.includes("/profiles") && 'active'}`}>
                                    <Link to={"/profiles"} className="nav-link">
                                        <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6722 3C11.2534 3 9.72541 3.29104 8.67039 4.09141C7.61536 3.29104 6.08739 3 4.66857 3C3.61354 3 2.49303 3.16007 1.55442 3.57481C1.02327 3.81492 0.666748 4.33151 0.666748 4.92087V13.1282C0.666748 14.0741 1.55442 14.7726 2.4712 14.5398C3.18426 14.3579 3.94096 14.2779 4.66857 14.2779C5.80363 14.2779 7.01145 14.467 7.98644 14.9472C8.423 15.1655 8.91777 15.1655 9.34706 14.9472C10.322 14.4598 11.5299 14.2779 12.6649 14.2779C13.3925 14.2779 14.1492 14.3579 14.8623 14.5398C15.7791 14.7799 16.6667 14.0814 16.6667 13.1282V4.92087C16.6667 4.33151 16.3102 3.81492 15.7791 3.57481C14.8477 3.16007 13.7272 3 12.6722 3ZM15.2188 12.2624C15.2188 12.7208 14.7968 13.0555 14.3457 12.9754C13.8 12.8736 13.2325 12.8299 12.6722 12.8299C11.4353 12.8299 9.65265 13.3029 8.67039 13.9213V5.54661C9.65265 4.92815 11.4353 4.45521 12.6722 4.45521C13.3416 4.45521 14.0037 4.52069 14.6367 4.65894C14.9714 4.7317 15.2188 5.03001 15.2188 5.37199V12.2624Z" fill="white" />
                                            <path d="M10.3201 7.33974C10.1067 7.33974 9.91342 7.20641 9.84675 6.99307C9.76008 6.73307 9.90675 6.44641 10.1667 6.36641C11.1934 6.03307 12.5201 5.92641 13.7401 6.06641C14.0134 6.09974 14.2134 6.34641 14.1801 6.61974C14.1467 6.89307 13.9001 7.09307 13.6267 7.05974C12.5467 6.93307 11.3667 7.03307 10.4734 7.31974C10.4201 7.32641 10.3667 7.33974 10.3201 7.33974ZM10.3201 9.11307C10.1067 9.11307 9.91342 8.97974 9.84675 8.76641C9.76008 8.50641 9.90675 8.21974 10.1667 8.13974C11.1867 7.80641 12.5201 7.69974 13.7401 7.83974C14.0134 7.87307 14.2134 8.11974 14.1801 8.39307C14.1467 8.66641 13.9001 8.86641 13.6267 8.83307C12.5467 8.70641 11.3667 8.80641 10.4734 9.09307C10.4233 9.10585 10.3718 9.11256 10.3201 9.11307ZM10.3201 10.8864C10.1067 10.8864 9.91342 10.7531 9.84675 10.5397C9.76008 10.2797 9.90675 9.99307 10.1667 9.91307C11.1867 9.57974 12.5201 9.47307 13.7401 9.61307C14.0134 9.64641 14.2134 9.89307 14.1801 10.1664C14.1467 10.4397 13.9001 10.6331 13.6267 10.6064C12.5467 10.4797 11.3667 10.5797 10.4734 10.8664C10.4233 10.8792 10.3718 10.8859 10.3201 10.8864Z" fill="white" />
                                        </svg>
                                        Profiles
                                    </Link>
                                </li>
                                {/* <li className="nav-item br"><a className="nav-link" id="course" href="#">Take Course</a></li> */}
                            </ul>
                            <ul className="navbar-nav nav2 align-items-center">
                                {/* <li className="nav-item d-flex align-items-center"><img src="/img/theme.png" alt="theme" /></li> */}
                                {/* <li className="nav-item"><a className="nav-link" href="#"><img src="/img/Group 42.png" alt="country" /></a></li> */}
                                {/* <li className="nav-item"><a href className="nav-link"><img src="/img/Notification 1.png" alt="" /></a></li> */}
                                <li className="nav-item profile-img d-flex align-items-center">
                                    <Link to={"/user-profile"} className="nav-link">
                                        {context.user.image !== null && context.user.image !== undefined ?
                                            <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                            <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                        }
                                    </Link>
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





