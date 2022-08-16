import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import SingleProfileCard from "../components/singleProfileCard";
import StoryCard from "../components/storyCard";
import Footer from "../components/footer";
import Loader from '../components/loader';
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useParams, useNavigate } from "react-router-dom";

function User() {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // params 
    const { id } = useParams()

    // view 
    const [view, setView] = useState('stories')

    // loader 
    const [pageLoading, setPageLoading] = useState(true)
    // current user 
    const [currentUser, setCurrentUser] = useState(null)

    // fetch current user 
    const fetchCurrentUser = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/users/singleuser/${id}`)
        // console.log(response.data)
        setCurrentUser(response.data)
        setPageLoading(false)
    }
    useEffect(() => {
        if (id && id !== '') fetchCurrentUser()
    }, [id])

    const [stories, setStories] = useState([])
    const [aspirants, setAspirants] = useState([])
    const [dataLoading, setDataLoading] = useState(true)
    const getUserData = () => {
        axios.post(`${API.API_ROOT}/users/viewprofile`, { userid: id }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("ballotbox_token")}` } })
            .then(response => {
                console.log(response)
                if (response.data.message !== "Token is not valid") {
                    setStories(response.data.story)
                    setAspirants(response.data.aspirant)
                }
                setDataLoading(false)
            }).catch(error => {
                console.error(error)
                setDataLoading(false)
            })
    }

    useEffect(() => {
        getUserData()
    }, [])

    // users array 
    const [users, setUsers] = useState([])
    const fetchUsers = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/users/allusers`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        console.log(response)
        setUsers(response.data)
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <>
            <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
                {/* navigation */}
                <Nav />
                <div className="home-feed container">
                    {pageLoading ?
                        <Loader pageLoading={pageLoading} /> :
                        <div className="row">
                            <div className="col-lg- col-md-9 col-12 order-lg-1 order-md-1 order-sm-2 order-2">
                                <div className="user-main">
                                    <div className="user-widget" style={{
                                        backgroundImage: currentUser.coverimage != undefined && `url(${currentUser.coverimage})`,
                                        // backgroundImage: context.user.coverimage != undefined && `url(${context.user.coverimage})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}>
                                        {/* <button onClick={coverPhoto}><i className="fa-solid fa-pen" /></button> */}
                                        {/* <input type="file" accept='image/*' id='cover-pic' hidden onChange={(e) => setCoverImage(e.target.files[0])} /> */}
                                        <div className="img-container">
                                            {currentUser.image !== null && currentUser.image !== undefined ?
                                                <img src={currentUser.image} alt="profile-img" id='profile-img' /> :
                                                <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                            }
                                            {/* <input type="file" accept='image/*' hidden id='profile-pic' onChange={(e) => {
                                            setProfilePic(e.target.files[0]);
                                        }} /> */}
                                        </div>
                                        {/* {context.darkMode ? <img id="change-img" src="img/add-img2.png" alt="change-profile-pic" onClick={profilePhoto} /> : <img id="change-img" src="img/add-img.png" alt="change-profile-pic" onClick={profilePhoto} />} */}
                                    </div>
                                    <div className="bio">
                                        <div className="d-flex justify-content-end mt-3 mb-lg-5 mb-md-4 mb-sm-3 mb-2">
                                            <button><i className="fa-solid fa-plus" />Follow</button>
                                        </div>
                                        <h1 className='mb-0'>{currentUser.firstname} {currentUser.lastname}</h1>
                                        <h4>{currentUser.username}</h4>
                                        <div className="row mb-3">
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                                                <h3>0 <span>Followers</span></h3>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                                                <h3>0 <span>Following</span></h3>
                                            </div>
                                        </div>
                                        <div className="row mb-lg-4 mb-md-3 mb-sm-3 mb-3 impresssions">
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                                                <h3>{stories.length} <span>Stories</span></h3>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                                                <h3>200 <span>Likes</span></h3>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-4">
                                                <h3>{aspirants.length} <span>Aspirant Profiles</span></h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* view  */}
                                    <div className="d-flex justify-content-between page-nav">
                                        <button className={view === "stories" && "active"} onClick={() => setView("stories")}>Stories</button>
                                        <button className={view === "aspirants" && "active"} onClick={() => setView("aspirants")}>Aspirant Profiles</button>
                                        <button className={view === "courses" && "active"} onClick={() => setView("courses")}>Courses</button>
                                    </div>

                                    {/* stories */}
                                    {view === "stories" &&
                                        <>
                                            {dataLoading ?
                                                <Loader pageLoading={dataLoading} /> :
                                                <>
                                                    {stories.length < 1 ?
                                                        <div className="empty">
                                                            {context.darkMode ?
                                                                <img src="/img/empty-stories-lt.png" alt="no stories" /> :
                                                                <img src="/img/empty-stories.png" className="img-fluid" alt="no stories" />
                                                            }
                                                            <p>No Stories Yet</p>
                                                        </div> :
                                                        <>
                                                            {/* {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />} */}
                                                            <div className="story">
                                                                {stories.map((story, index) => {
                                                                    return (
                                                                        <StoryCard story={story} key={index} />
                                                                    )
                                                                }).reverse()}
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </>
                                    }

                                    {/* profile  */}
                                    {view === 'aspirants' &&
                                        <>
                                            {dataLoading ?
                                                <Loader pageLoading={dataLoading} /> :
                                                <>
                                                    {aspirants.length < 1 ?
                                                        <div className="empty">
                                                            {context.darkMode ?
                                                                <img src="/img/empty-profile-lt.png" className="img-fluid" alt="no stories" /> :
                                                                <img src="/img/empty-profile.png" className="img-fluid" alt="no stories" />
                                                            }
                                                            <p>No Profiles Created Yet</p>
                                                        </div> :
                                                        <div className="profile">
                                                            {aspirants.map((aspirant, index) => {
                                                                return (
                                                                    <SingleProfileCard aspirant={aspirant} key={index} />
                                                                )
                                                            }).reverse()}
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </>
                                    }

                                    {view == "courses" &&
                                        <div className='empty'>
                                            <h1>Coming Soon!!!</h1>
                                        </div>
                                    }
                                </div>
                                <Footer />
                            </div>
                            <div className="col-lg-3 col-md-3 col-12 order-lg-2 order-md-2 order-sm-1 order-1 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                                <div className="aside-sticky">
                                    <div className="story-recomentdations mb-3">
                                        <h2>People also viewed</h2>
                                        {users.sort(function () { return .5 - Math.random() }).slice(0, 4).map((each, index) => {
                                            return (
                                                <div className="story row" key={index}>
                                                    <div className="col-2">
                                                        <div className="img-container">
                                                            {each.image === null || each.image === undefined ?
                                                                <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                                                <img src={each.image} alt="avatar" id='profile-img' />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-10 details">
                                                        <h3>{each.firstname} {each.lastname}</h3>
                                                        <h4 className="mb-2">{each.username}</h4>
                                                        <button>Read more</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default User 