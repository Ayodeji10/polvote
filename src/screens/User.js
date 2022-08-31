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

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

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
                // console.log(response)
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

    // get story likes
    const [userTotalLikes, setUserTotalLikes] = useState()
    let storyTotalLikes = stories.filter(story => story.userid === id).reduce((total, story) => {
        let increament = story.likes.length
        total += (increament)
        return total
    }, 0)
    useEffect(() => {
        setUserTotalLikes(storyTotalLikes)
    }, [stories])

    // users array 
    const [users, setUsers] = useState([])
    const fetchUsers = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/users/allusers`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // console.log(response)
        setUsers(response.data)
    }

    // followers 
    const [followers, setFollowers] = useState([])
    const [followersLoading, setFollowersLoading] = useState(true)
    const fetchFollowers = () => {
        axios.get(`${API.API_ROOT}/follow/followers/${id}`,
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                // console.log(response)
                setFollowers(response.data.followers)
                setFollowersLoading(false)
            }).catch(error => {
                console.error(error)
            })
    }

    // following 
    const [following, setFollowing] = useState([])
    const fetchFollowing = () => {
        axios.get(`${API.API_ROOT}/follow/following/${id}`,
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                // console.log(response)
                setFollowing(response.data.followers)
            }).catch(error => {
                console.error(error)
            })
    }

    // follow 
    const [followLoading, setFollowLoading] = useState(false)
    const follow = () => {
        setFollowLoading(true)
        axios.post(`${API.API_ROOT}/follow`,
            { followedid: id },
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                console.log(response)
                fetchFollowers()
                setFollowLoading(false)
                // setFollowers(response.data.followers)
                // setFollowersLoading(false)
            }).catch(error => {
                console.error(error)
                setFollowLoading(false)
            })
    }

    // unfollow 
    const [unfollowLoading, setUnfollowLoading] = useState(false)
    const unfollow = () => {
        setUnfollowLoading(true)
        axios.patch(`${API.API_ROOT}/follow/unfollow/${id}`,
            { followedid: id },
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                console.log(response)
                fetchFollowers()
                setUnfollowLoading(false)
                // setFollowers(response.data.followers)
                // setFollowersLoading(false)
            }).catch(error => {
                console.error(error)
                setUnfollowLoading(false)
            })
    }

    useEffect(() => {
        fetchUsers()
        fetchFollowers()
        fetchFollowing()
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
                            <div className="col-lg-9 col-12">
                                <div className="user-main">
                                    <div className="user-widget" style={{
                                        backgroundImage: currentUser.coverimage != undefined && `url(${currentUser.coverimage})`,
                                        // backgroundImage: context.user.coverimage != undefined && `url(${context.user.coverimage})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}>
                                        <div className="img-container">
                                            {currentUser.image !== null && currentUser.image !== undefined ?
                                                <img src={currentUser.image} alt="profile-img" id='profile-img' /> :
                                                <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                            }
                                        </div>
                                    </div>
                                    <div className="bio">
                                        <div className="d-flex justify-content-end mt-3 mb-lg-5 mb-md-4 mb-sm-3 mb-2">
                                            {/* follow btn  */}
                                            {/* {!followersLoading &&
                                                <> */}
                                            {followers.filter(follower => follower.followerid === context.user._id && follower.status === 0).length === 0 ?
                                                <button onClick={follow}>{followLoading ? <><i className="fa-solid fa-spinner fa-spin" />following</> : <><i className="fa-solid fa-plus" />Follow</>}</button> :
                                                <button onClick={unfollow}>{unfollowLoading ? <><i className="fa-solid fa-spinner fa-spin" />unfollowing</> : "Unfollow"}</button>
                                            }
                                            {/* </>
                                            } */}
                                            {/* <button onClick={unfollow}>{unfollowLoading ? <><i className="fa-solid fa-spinner fa-spin" />unfollowing</> : <><i className="fa-solid fa-minus" />Unfollow</>}</button> :
                                            <button onClick={follow}>{followLoading ? <><i className="fa-solid fa-spinner fa-spin" />following</> : <><i className="fa-solid fa-plus" />Follow</>}</button> */}
                                        </div>
                                        <h1 className='mb-0'>{currentUser.firstname} {currentUser.lastname}</h1>
                                        <h4>{currentUser.username}</h4>
                                        {/* followers  */}
                                        <div className="row mb-3">
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                                                <h3>{followers.filter(follower => follower.status === 0).length} <span>Followers</span></h3>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                                                <h3>{following.length} <span>Following</span></h3>
                                            </div>
                                        </div>
                                        <div className="row mb-lg-4 mb-md-3 mb-sm-3 mb-3 impresssions">
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                                                <h3>{stories.length} <span>Stories</span></h3>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                                                <h3>{userTotalLikes} <span>Like{userTotalLikes !== 0 && "s"}</span></h3>
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
                            <div className="col-lg-3 col-md-3">
                                <div className="aside-sticky">
                                    <div className="story-recomentdations user-rec mb-3">
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
                                                        <button onClick={() => {
                                                            navigate(`/user/${each._id}`);
                                                            window.location.reload()
                                                        }}>View Profile</button>
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