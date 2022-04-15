import React, { useState, useContext, useEffect } from 'react'
import Footer from '../components/footer'
import Nav from '../components/nav'
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../dataContext";
import { removeUserSession } from "../utils/common"
import { API } from "../components/apiRoot";
import axios from "axios";

function UserProfile() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [currentView, setCurrentView] = useState("aspirants")
    const [walletView, setWalletView] = useState('stories')

    // profile setting 
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
    const [profileUpdateError, setProfileUpdateError] = useState("")

    // handle profile update 
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setProfileUpdateError(null)
        setProfileUpdateLoading(true)
        axios.post(`${API.API_ROOT}/users/editprofile`, { firstname: context.user.firstname, lastname: context.user.lastname, email: context.user.email, username: context.user.username, phonenumber: context.user.phonenumber }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${context.user.token}` } })
            .then(response => {
                console.log(response)
                setContext({ ...context, user: response.data, backupUser: response.data })
                setProfileUpdateLoading(false);
                window.location.reload()
            }).catch(error => {
                setProfileUpdateLoading(false)
                setProfileUpdateError('Something went wrong, please try again')
                console.error(error)
            })
    }

    // password change 
    const [oldPasswoord, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false)
    const [passwordUpdateError, setPasswordUpdateError] = useState("")

    // handl update password 
    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setPasswordUpdateError(null)
        setPasswordUpdateLoading(true)
        if (newPassword !== confirmPassword) {
            setPasswordUpdateError('New passwords dont match')
        } else {
            axios.post(`${API.API_ROOT}/users/changepassword`, { password: oldPasswoord, passwordnew: newPassword }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${context.user.token}` } })
                .then(response => {
                    console.log(response)
                    // setContext({ ...context, user: response.data, backupUser: response.data })
                    setPasswordUpdateLoading(false);
                    // window.location.reload()
                }).catch(error => {
                    setPasswordUpdateLoading(false)
                    setPasswordUpdateError('Something went wrong, please try again')
                    console.error(error)
                })
        }
    }

    // fetch aspirants 
    const [aspirants, setAspirants] = useState([])

    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
    }

    useEffect(() => {
        fetchAspirants()
    }, [])

    return (
        <div className="container-fluid">
            {/* navigation */}
            <Nav />
            <div className="container">
                <div className="user-widget">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="position-relative">
                                <div className="img-container">
                                    <img id="profile-img" src="img/Candidate.png" alt="profile-img" />
                                    <img id="change-img" src="img/add-img.png" alt="change-profile-pic" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 d-flex flex-column justify-content-center">
                            <h1 className="mb-0">James Jackson</h1>
                            <h4 className="mb-0">@Jackie</h4>
                        </div>
                        <div className="col-lg-3 d-flex justify-content-end align-items-start">
                            <button>Change Cover Picture</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* aside  */}
                    <div className="col-lg-3 user-aside">
                        <section>
                            <button className={currentView === "aspirants" && "active"} onClick={() => setCurrentView('aspirants')} ><img src="img/aspirant.png" alt="aspirant" />Aspirant Profiles</button>
                            <button className={currentView === "stories" && "active"} onClick={() => setCurrentView('stories')}><img src="img/stories.png" alt="stories" />Stories</button>
                            <button className={currentView === "wallet" && "active"} onClick={() => setCurrentView('wallet')}><img src="img/wallet.png" alt="wallet" />My Wallet</button>
                            <button><img src="img/courses.png" alt="courses" />My Courses</button>
                        </section>
                        <section>
                            <button><img src="img/notification 2.png" alt="notification" />Notifications</button>
                            <button className={currentView === "edit" && "active"} onClick={() => setCurrentView('edit')}><img src="img/edit2.png" alt="edit" />Edit Profile</button>
                        </section>
                        <section>
                            <button onClick={(e) => {
                                e.preventDefault();
                                removeUserSession();
                                setContext({ ...context, user: {} });
                                navigate("/")
                            }}><img src="img/power.png" alt="logout" />Logout</button>
                        </section>
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8 search">
                        {/* profiles */}
                        {currentView === 'aspirants' &&
                            <>
                                <div className="aspirant-header d-flex justify-content-between align-items-center">
                                    <h1 className="mb-0">Aspirant Profiles</h1>
                                    <button onClick={() => navigate("/create-aspirant")}><img src="img/edit.png" alt="create" />Create Aspirant Profile</button>
                                </div>
                                {/* {aspirants.filter((aspirant) => aspirant.creatorid === context.user._id).map((each) => {
                                    return (
                                        <div className="profile">
                                            <div className="row">
                                                <div className="col-lg-1">
                                                    <img src={each.image === undefined ? "/img/user (1) 1.png" : `https://olf.online/ballot/${each.image}`} id="profile-img" alt="profile-img" className="img-fluid" />

                                                </div>
                                                <div className="col-lg-11">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h3>{each.firstname} {each.lastname}</h3>
                                                        <Link to={`/edit-aspirant/${each._id}`}><img src="img/profile-edit-icon.png" alt="edit" /></Link>
                                                    </div>
                                                    <p>{each.overview}</p>
                                                    <footer>
                                                        <div className="row align-items-center">
                                                            <div className="col-lg-3">
                                                                <h4 className="mb-0">Born: {each.dob.substring(4, 15)}</h4>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <h4 className="mb-0">Party: {each.pparty}</h4>
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <p className="mb-0"><i className="far fa-eye" />204</p>
                                                            </div>
                                                            <div className="col-lg-1">
                                                                <i className="fas fa-share-alt" id="views" />
                                                            </div>
                                                            <div className="col-lg-3 d-flex justify-content-between align-items-center">
                                                                <p className="mb-0">No Active Poll</p>
                                                                <img src="img/Group 515.png" alt="" />
                                                            </div>
                                                        </div>
                                                    </footer>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })} */}
                            </>
                        }

                        {/* stories */}
                        {currentView === "stories" &&
                            <>
                                <div className="story-header">
                                    <div className="row align-items-center">
                                        <div className="col-lg-3">
                                            <h1 className="mb-0">My Stories</h1>
                                        </div>
                                        <div className="col-lg-2">
                                            <a href="#"><img src="img/saved-story.png" alt="saved" />Saved Stories</a>
                                        </div>
                                        <div className="col-lg-2">
                                            <a href="#"><img src="img/saved-story.png" alt="draft" />Drafts</a>
                                        </div>
                                        <div className="col-lg-2">
                                            <a href="#"><img src="img/sort.png" alt="sort" />Sort by</a>
                                        </div>
                                        <div className="col-lg-3">
                                            <button><img src="img/edit.png" alt="edit" />Write New Story</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="story">
                                    <div className="body">
                                        <div className="row mb-5 align-items-center">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-10 d-flex flex-column justify-content-center">
                                                <h3>Aaron Dabson</h3>
                                                <div className="d-flex">
                                                    <p className="mb-0">@AAron</p>
                                                    <p className="mb-0">23 Hours Ago</p>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <i className="fas fa-ellipsis-h" />
                                            </div>
                                        </div>
                                        <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget">
                                        <div className="row justify-content-md-center">
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/comment.png" alt="comment" />
                                                <span>8</span>
                                            </div>
                                            <div className="col-md-auto d-flex align-items-center justify-content-center">
                                                <img src="img/like.png" alt="like" />
                                                <span>24</span>
                                            </div>
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/share.png" alt="share" />
                                                <span>2</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comment">
                                        <div className="row">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-9">
                                                <input type="text" placeholder="Leave a comment..." />
                                            </div>
                                            <div className="col-2">
                                                <button><img src="img/send.png" alt="send" /> Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="story">
                                    <div className="body">
                                        <div className="row mb-5 align-items-center">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-10 d-flex flex-column justify-content-center">
                                                <h3>Aaron Dabson</h3>
                                                <div className="d-flex">
                                                    <p className="mb-0">@AAron</p>
                                                    <p className="mb-0">23 Hours Ago</p>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <i className="fas fa-ellipsis-h" />
                                            </div>
                                        </div>
                                        <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget">
                                        <div className="row justify-content-md-center">
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/comment.png" alt="comment" />
                                                <span>8</span>
                                            </div>
                                            <div className="col-md-auto d-flex align-items-center justify-content-center">
                                                <img src="img/like.png" alt="like" />
                                                <span>24</span>
                                            </div>
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/share.png" alt="share" />
                                                <span>2</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comment">
                                        <div className="row">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-9">
                                                <input type="text" placeholder="Leave a comment..." />
                                            </div>
                                            <div className="col-2">
                                                <button><img src="img/send.png" alt="send" /> Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="story">
                                    <div className="body">
                                        <div className="row mb-5 align-items-center">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-10 d-flex flex-column justify-content-center">
                                                <h3>Aaron Dabson</h3>
                                                <div className="d-flex">
                                                    <p className="mb-0">@AAron</p>
                                                    <p className="mb-0">23 Hours Ago</p>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <i className="fas fa-ellipsis-h" />
                                            </div>
                                        </div>
                                        <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                            <div className="col-6">
                                                <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget">
                                        <div className="row justify-content-md-center">
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/comment.png" alt="comment" />
                                                <span>8</span>
                                            </div>
                                            <div className="col-md-auto d-flex align-items-center justify-content-center">
                                                <img src="img/like.png" alt="like" />
                                                <span>24</span>
                                            </div>
                                            <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                                                <img src="img/share.png" alt="share" />
                                                <span>2</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comment">
                                        <div className="row">
                                            <div className="col-1">
                                                <div className="img-container">
                                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                                </div>
                                            </div>
                                            <div className="col-9">
                                                <input type="text" placeholder="Leave a comment..." />
                                            </div>
                                            <div className="col-2">
                                                <button><img src="img/send.png" alt="send" /> Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        {/* wallet */}
                        {currentView === "wallet" &&
                            <div className="wallet">
                                <div className="header mb-3">
                                    <div className="row">
                                        <div className="col-lg-7">
                                            <section className="category">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'stories' && 'active'} onClick={() => setWalletView('stories')} ><img src="img/stories.png" alt="stories" />Stories</button>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'profiles' && 'active'} onClick={() => setWalletView('profiles')}><img src="img/aspirant.png" alt="aspirant" />Aspirant
                                                            Profiles</button>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'courses' && 'active'} onClick={() => setWalletView('courses')}><img src="img/courses.png" alt="courses" />Courses</button>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-lg-1">
                                            <section className="history d-flex align-items-center justify-content-center">
                                                <button className={walletView === 'history' && 'active'} onClick={() => setWalletView('history')}>
                                                    <i class="fas fa-history"></i>
                                                </button>
                                            </section>
                                        </div>
                                        <div className="col-lg-4">
                                            <section className="withdrawl">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <p>Total Wallet Balance</p>
                                                        <h2 className="mb-0">$27,826</h2>
                                                    </div>
                                                    <div className="col-6">
                                                        <button><img src="img/withdrawl.png" alt="withdrawl" />Withdraw</button>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                {/* wallet stories */}
                                {walletView === 'stories' &&
                                    <div className="stories">
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* profile */}
                                {walletView === 'profiles' &&
                                    <div className="profiles">
                                        <div className="head mb-2">
                                            <div className="row align-items-center">
                                                <div className="col-lg-4">
                                                    <h4>Aspirant’s Name</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Profile Worth</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Views</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Amount Earned</h4>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body  */}
                                        <div className="body">
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* courses */}
                                {walletView === "courses" &&
                                    <div className="profiles">
                                        <div className="head mb-2">
                                            <div className="row align-items-center">
                                                <div className="col-lg-5">
                                                    <h4>Course Title</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Course Fee</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Quantity sold</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Amount Earned</h4>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body  */}
                                        <div className="body">
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* wallet history */}
                                {walletView === "history" &&
                                    <div className="history">
                                        <h1>Transaction History</h1>
                                        <div className="row header">
                                            <div className="col-lg-1">
                                                <p>Status</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Account Name</p>
                                            </div>
                                            <div className="col-lg-1">
                                                <p>Amount</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Bank Name</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Acct Number</p>
                                            </div>
                                            <div className="col-lg-1">
                                                <p>Currency</p>
                                            </div>
                                            <div className="col-lg-3">
                                                <p>Date &amp; Time</p>
                                            </div>
                                        </div>
                                        <div className="transactions">
                                            <div className="row align-items-center">
                                                <div className=" col-lg-1">
                                                    <img src="img/trans-done.png" alt="done" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake Akintola</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-lg-1">
                                                    <img src="/img/trans1.png" alt="cancelled" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className=" col-lg-1">
                                                    <img src="img/trans-done.png" alt="done" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake Akintola</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        {/* edit */}
                        {currentView === "edit" &&
                            <div>
                                <div className="settings mb-4">
                                    <header className="d-flex justify-content-between align-items-center">
                                        <h1 className="mb-0">Profile</h1>
                                        <i className="fas fa-angle-down" />
                                    </header>
                                    <div className="body">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label htmlFor="fname">First Name</label>
                                                <input type="text" id="fname" placeholder="First Name" value={context.user.firstname} onChange={(e) => setContext({ ...context, user: { ...context.user, firstname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="lname">Last Name</label>
                                                <input type="text" id="lname" placeholder="Last Name" value={context.user.lastname} onChange={(e) => setContext({ ...context, user: { ...context.user, lastname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Username">Username</label>
                                                <input type="text" id="Username" placeholder="Username" value={context.user.username} onChange={(e) => setContext({ ...context, user: { ...context.user, username: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Email">Email</label>
                                                <input type="text" id="Email" placeholder="Email" value={context.user.email} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Phone">Phone Number</label>
                                                <input type="text" id="Phone" placeholder="Phone Number" value={context.user.phonenumber} onChange={(e) => setContext({ ...context, user: { ...context.user, phonenumber: e.target.value } })} />
                                            </div>
                                        </div>
                                        <p>{profileUpdateError}</p>
                                        <button onClick={(e) => handleProfileUpdate(e)}>{profileUpdateLoading ? "loading..." : "Update Changes"}</button>
                                    </div>
                                </div>
                                <div className="settings">
                                    <header className="d-flex justify-content-between align-items-center">
                                        <h1 className="mb-0">Password</h1>
                                        <i className="fas fa-angle-up" />
                                    </header>
                                    <div className="body">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label htmlFor="cpass">Current Password</label>
                                                <input type="password" id="cpass" placeholder="***************************" value={oldPasswoord} onChange={(e) => setOldPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6" />
                                            <div className="col-lg-6">
                                                <label htmlFor="new">New Password</label>
                                                <input type="password" id="new" placeholder="***************************" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6" />
                                            <div className="col-lg-6">
                                                <label htmlFor="confirm">Confirm Password</label>
                                                <input type="password" id="confirm" placeholder="***************************" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6">
                                                <p>{passwordUpdateError}</p>
                                                <button onClick={handleUpdatePassword}>{passwordUpdateLoading ? "loading..." : "Update Password"}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile