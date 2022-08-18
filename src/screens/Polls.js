import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import PollCard from '../components/pollCard';
import Loader from '../components/loader';
import LoginPrompt from '../components/loginPrompt';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function Polls() {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // const [filterModal, setFilterModal] = useState(false)
    const [activePolls, setActivePolls] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)
    const [options, setOptions] = useState(false)

    // fetch polls 
    const [polls, setPolls] = useState([])
    const [pollsList, setPollsList] = useState([])
    const fetchPolls = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/polls`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setPolls(response.data)
        setPollsList(response.data)
        setPageLoading(false)
    }
    useEffect(() => {
        fetchPolls()
    }, [])

    // fetch stories and aspirants
    const [stories, setStories] = useState([])
    const [storyFetch, setStoryFetch] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setStories(response.data)
        setStoryFetch(false)
    }

    const [aspirants, setAspirants] = useState([])
    const [aspirantFetch, setAspirantFetch] = useState(true)
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
        setAspirantFetch(false)
    }

    useEffect(() => {
        fetchStories()
        fetchAspirants()
    }, [])

    const searchPolls = (e) => {
        // console.log(e.target.value)
        const polls = pollsList.filter(poll => poll.polltitle.toLowerCase().includes(e.target.value.toLowerCase()) && poll.status == 0)
        // console.log(people)
        setPolls(polls)
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* main  */}
                    <div className="col-lg-6 col-md-9 polls">
                        <div className="d-flex justify-content-end align-items-center mb-lg-5 mb-md-2 mb-sm-4 mb-4">
                            <div className="searchbar d-flex align-items-center">
                                <input type="text" placeholder="Search Poll" onChange={(e) => searchPolls(e)} />
                                <img src="img/search-normal.png" alt="search" />
                            </div>
                            {/* <button onClick={() => setFilterModal(true)}><i className="fas fa-filter" />Filter</button> */}
                        </div>
                        <h1 onClick={() => setOptions(!options)}>{activePolls ? "Active Polls" : "Concluded Polls"}<i className="fa-solid fa-angle-down" /></h1>
                        {options &&
                            <div className="options">
                                <p className='mb-1' onClick={() => {
                                    setActivePolls(true);
                                    setOptions(false)
                                }}>Active Poll</p>
                                <p className='mb-0' onClick={() => {
                                    setActivePolls(false);
                                    setOptions(false)
                                }}>Concluded Poll</p>
                            </div>
                        }
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                <div className="header">
                                    <div className="row align-items-center">
                                        <div className="col-4">
                                            <p>Polls</p>
                                        </div>
                                        <div className="col-2">
                                            <p>Votes</p>
                                        </div>
                                        <div className="col-2">
                                            <p>Open Date</p>
                                        </div>
                                        <div className="col-2">
                                            <p>End Date</p>
                                        </div>
                                    </div>
                                </div>
                                {polls.filter(poll => poll.status === `${activePolls ? "0" : "1"}`).map((poll, index) => {
                                    // get total votes 
                                    let pollVotes = poll.aspirant.reduce((total, aspirant) => {
                                        let increament = aspirant.votes.length
                                        total += (increament)
                                        if (total !== 0) {
                                            return total
                                        } else {
                                            return 0.000000001
                                        }
                                    }, 0);
                                    let liveVotes = poll.aspirant.reduce((total, aspirant) => {
                                        let increament = parseInt(aspirant.livevote)
                                        total += (increament)
                                        if (total !== 0) {
                                            return total
                                        } else {
                                            return 0.000000001
                                        }
                                    }, 0)
                                    return (
                                        <PollCard poll={poll} pollVotes={pollVotes} liveVotes={liveVotes} key={index} fetchPolls={fetchPolls} />
                                    )
                                })}
                            </>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                    <div className="profile-widget col-lg-3">
                        <div className="aside-sticky">
                            <div className="story-recomentdations mb-3">
                                <h2>Recommended Stories</h2>
                                {stories.slice(0).sort(function () { return .5 - Math.random() }).slice(0, 3).map((each, index) => { ///slice(0) at the beginning is to duplicate the stories array
                                    return (
                                        <div className="story row" key={index}>
                                            <div className="col-2">
                                                <div className="img-container">
                                                    {each.userimage === null || each.userimage === undefined ?
                                                        <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                                        <img src={each.userimage} alt="avatar" id='profile-img' />
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-10 details">
                                                <h3>{each.fullname}</h3>
                                                <h4>{each.username}</h4>
                                                {each.story.split("\r\n").filter((each, index) => index === 0).map((text, index) => {
                                                    return <p key={index}>{text.substring(0, 200)}{text.length > 200 && "..."}</p>
                                                })}
                                                <button onClick={() => navigate(`/stories/${each._id}`)}>Read more</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="profile-recomentdations">
                                <h2>Recommended Aspirants</h2>
                                {aspirants.slice(0).sort(function () { return .5 - Math.random() }).slice(0, 4).map((each, index) => {
                                    return (
                                        <div className="profile row" key={index}>
                                            <div className="col-lg-2 col-md-1">
                                                <div className="img-container">
                                                    <img src={each.image === null || each.image === undefined ? `img/user (1) 1.png` : `${each.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                                                </div>
                                            </div>
                                            <div className="col-lg-10 col-md-11 details">
                                                <h3>{each.overview.substring(0, 160)}...</h3>
                                                <button onClick={() => navigate(`/profiles/single/${each._id}`)}>Read more</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* filter modal */}
            {/* <Modal isOpen={filterModal} onRequestClose={() => setFilterModal(false)} id="polls-modal">
                <div className="header d-flex justify-content-between align-items-center">
                    <i className="fas fa-filter" />
                    <h3 className="mb-0">Filter Polls</h3>
                    <i className="fas fa-times-circle" onClick={() => setFilterModal(false)} />
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <h6>Sort By Popularity</h6>
                        <div>
                            <input type="checkbox" id="trending" />
                            <label htmlFor="trending">Trending Poll</label>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h6>Sort By Category</h6>
                        <div className="mb-3">
                            <input type="checkbox" id="All" />
                            <label htmlFor="All">All</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Presidential" />
                            <label htmlFor="Presidential">Presidential</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Gubernatorial" />
                            <label htmlFor="Gubernatorial">Gubernatorial</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Senatorial" />
                            <label htmlFor="Senatorial">Senatorial</label>
                        </div>
                        <div className="mb">
                            <input type="checkbox" id="house" />
                            <label htmlFor="house">House of Representative</label>
                        </div>
                    </div>
                </div>
                <button>Show Result</button>
            </Modal> */}
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt />}
        </div>
    )
}

export default Polls