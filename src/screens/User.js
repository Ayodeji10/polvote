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
    const [view, setView] = useState('story')

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
    const getUser = () => {
        axios.post(`${API.API_ROOT}/users/viewprofile`, { userid: id }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${context.user.token}` } })
            .then(response => {
                console.log(response)
                setStories(response.data.story)
                setAspirants(response.data.aspirant)
            }).catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            {/* navigation */}
            <Nav />
            {pageLoading ?
                <Loader pageLoading={pageLoading} /> :
                <div className="home-feed container">
                    <div className="user-widget" style={{
                        backgroundImage: currentUser.coverimage != undefined && `url(${currentUser.coverimage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                        // backgroundColor: 'unset' 
                    }}>
                        <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-3 col-3">
                                <div className="position-relative">
                                    <div className="img-container">
                                        {currentUser.image !== null && currentUser.image !== undefined ?
                                            <img src={currentUser.image} alt="profile-img" id='profile-img' /> :
                                            <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-5 col-9 d-flex flex-column justify-content-center">
                                <h1 className="mb-0">{currentUser.firstname} {currentUser.lastname}</h1>
                                <h4 className="mb-0">{currentUser.username}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-lg-between">
                        {/* aside  */}
                        <div className="col-lg-3 col-md-3 user-aside">
                            <section>
                                <button className={view === "story" && "active"} onClick={() => setView("story")}>
                                    {context.darkMode ?
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="#0A183D" fillOpacity="0.5" />
                                        </svg> :
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="white" fillOpacity="0.6" />
                                        </svg>
                                    }
                                    Stories
                                </button>
                                <button className={view === "aspirant" && "active"} onClick={() => setView("aspirant")} >
                                    {context.darkMode ?
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="#0A183D" fillOpacity="0.5" />
                                        </svg> :
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="white" fillOpacity="0.6" />
                                        </svg>
                                    }
                                    Aspirant Profiles
                                </button>
                            </section>
                        </div>
                        {/* main  */}
                        <div className="col-lg-8 col-md-9 mt-sm-3 mt-md-0 mt-lg-0 mt-3">
                            {/* stories */}
                            {view === "story" &&
                                <>
                                    <div className="story-header">
                                        <h1 className="mb-0">Stories</h1>
                                    </div>
                                    {stories.filter(story => story.userid === currentUser._id).length === 0 ?
                                        <div className="empty">
                                            {context.darkMode ?
                                                <img src="/img/empty-stories-lt.png" alt="no stories" /> :
                                                <img src="/img/empty-stories.png" className="img-fluid" alt="no stories" />
                                            }
                                            <p>No Stories Yet</p>
                                        </div> :
                                        <div className="story">
                                            {stories.filter(story => story.userid === currentUser._id).map((story, index) => {
                                                return (
                                                    <StoryCard story={story} key={index} />
                                                )
                                            }).reverse()}
                                        </div>
                                    }
                                </>
                            }

                            {/* profiles */}
                            {view === 'aspirant' &&
                                <>
                                    <div className="aspirant-header">
                                        <h1 className="mb-0">Aspirant Profiles</h1>
                                    </div>
                                    {aspirants.filter(aspirant => aspirant.creatorid === currentUser._id).length === 0 ?
                                        <div className="empty">
                                            {context.darkMode ?
                                                <img src="/img/empty-profile-lt.png" className="img-fluid" alt="no stories" /> :
                                                <img src="/img/empty-profile.png" className="img-fluid" alt="no stories" />
                                            }
                                            <p>No Profiles Created Yet</p>
                                        </div> :
                                        <div className="profile">
                                            {aspirants.filter((aspirant) => aspirant.creatorid === currentUser._id && aspirant.status === "1").map((aspirant, index) => {
                                                return (
                                                    <SingleProfileCard aspirant={aspirant} key={index} />
                                                )
                                            }).reverse()}
                                        </div>
                                    }
                                </>
                            }

                            {/* footer  */}
                            <Footer />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default User 