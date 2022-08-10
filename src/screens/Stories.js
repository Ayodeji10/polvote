import React, { useState, useContext, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import StoryCard from '../components/storyCard';
import LoginPrompt from '../components/loginPrompt';
import { useNavigate } from "react-router-dom";
import Loader from '../components/loader';
import WriteStoryModal from '../components/writeStoryModal';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function Stories() {
    // context 
    const { context } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    // fetch stories
    const [stories, setStories] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setStories(response.data)
        setPageLoading(false)
    }
    useEffect(() => {
        fetchStories()
        // const interval = setInterval(() => {
        //     fetchStories()
        // }, 10000)
        // return () => clearInterval(interval)
    }, [])

    // write story
    const [writeStoryModal, setWriteStoryModal] = useState(false)

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3  aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="story col-lg-6 col-md-9">
                        {/* new story  */}
                        <div className="stories-header">
                            <div className="row">
                                <div className="col-lg-7 col-md-6 col-sm-6">
                                    <div className="searchbar d-flex justify-content-between align-items-center">
                                        <input type="text" placeholder='Search for Stories' />
                                        <img src="/img/search-normal.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6 col-sm-6">
                                    <button className='d-flex align-items-center justify-content-center' onClick={() => setWriteStoryModal(true)}><img src="/img/edit.png" alt="write" />Write New Story</button>
                                    {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                                </div>
                            </div>
                        </div>
                        {/* stories  */}
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                {stories.filter(story => story.status !== "1").map((story, index) => {
                                    return (
                                        <StoryCard story={story} index={index} key={index} />
                                    )
                                }).reverse()
                                }
                            </>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                    <div className="col-lg-3">
                        <div className="aside-sticky">
                            <div className="story-recomentdations">
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
                                                    return <p key={index}>{text}</p>
                                                })}
                                                <button>Read more</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt />}
        </div>
    )
}

export default Stories