import React, { useState, useContext, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import StoryCard from '../components/storyCard';
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

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    // fetch stories
    const [stories, setStories] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        console.log(response.data)
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
        <div className="container-fluid">
            <Nav />
            <div className="home-feed container">
                <div className="row">
                    {/* aside  */}
                    <div className="col-lg-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8 story">
                        {/* new story  */}
                        <div className="create-story">
                            <h3>Create New Story</h3>
                            <div className="row align-items-center mb-4">
                                <div className="col-1">
                                    <div className="img-container">
                                        {context.user.image !== null && context.user.image !== undefined ?
                                            <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                            <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                        }
                                        {/* <img src="img/Candidate.png" className="profile-img" alt="profile-img" /> */}
                                    </div>
                                </div>
                                <div className="col-11">
                                    <input type="text" placeholder="Share your thought" onClick={() => setWriteStoryModal(true)} value="" />
                                </div>
                                {/* write modal  */}
                                {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                            </div>
                            <div className="d-flex justify-content-end">
                                <p onClick={() => setWriteStoryModal(true)} className="mb-0 d-flex align-items-center"><img src="img/clarity_camera-solid.png" alt="image" /><span>Photo</span></p>
                                <p onClick={() => setWriteStoryModal(true)} className="mb-0 d-flex align-items-center"><img src="img/link.png" alt="link" /><span>Attach
                                    link</span></p>
                            </div>
                        </div>
                        {/* stories  */}
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                {stories.map((story, index) => {
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
                </div>
            </div>
        </div>
    )
}

export default Stories