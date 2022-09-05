import React, { useState, useEffect, useContext, useRef } from 'react'
import Nav from '../components/nav'
import Aside from '../components/aside'
import Footer from '../components/footer'
// import Comment from '../components/comments'
import LoginPrompt from '../components/loginPrompt'
import { Link, useParams, useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import StoryCard from '../components/storyCard'
import AuthModals from '../components/authenticationModlas'
import Loader from '../components/loader';
import RecommendedStories from '../components/recommendedStories'
// import { Helmet } from 'react-helmet'
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SingleStory() {
    // context 
    const { context } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    // auth modals 
    const [loginModal, setLoginModal] = useState(false)
    const [signupModal, setSignupModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)

    // params 
    const { any, id } = useParams()

    // increase views 
    useEffect(() => {
        if (id && id !== '') {
            axios({
                url: `${API.API_ROOT}/story/storyviews/${id}`,
                method: "patch",
                headers: { 'Authorization': `Bearer ${context.user.token}` },
            }).then((response) => {
                // console.log(response)
            }, (error) => {
                // console.log(error)
            })
        }
    }, [id])

    // fetch single story 
    const [story, setStory] = useState({})
    const [storyLike, setStoryLike] = useState(0)
    const [pageLoading, setPageLoading] = useState(true)
    const fetchStory = () => {
        axios({
            url: `${API.API_ROOT}/story/${id}`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` },
        }).then((response) => {
            setStory(response.data)
            setPageLoading(false)
            // show like 
            if (response.data.likes.filter(like => like.userid === context.user._id).length === 0) {
                setStoryLike(0)
            } else {
                setStoryLike(1)
            }
        }, (error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (id && id !== '') fetchStory()
    }, [id])


    // useRef to fetch more stories 
    const myRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (entry.isIntersecting) {
                setPageNumber(prev => {
                    return prev + 1
                });
            }
            // console.log(entry)
        })
        observer.observe(myRef.current)
    }, [])

    // fetch stories
    const [stories, setStories] = useState([])
    const [loadMore, setLoadMore] = useState(true)
    const [pageNumber, setPageNumber] = useState(1)

    const fetchStories = () => {
        axios({
            method: "GET",
            url: `${API.API_ROOT}/story?page=${pageNumber}&limit=10`
        }).then(response => {
            if (stories.length === 0) {
                setStories(response.data.stories)
            } else {
                setStories(prevStories => {
                    return [...prevStories, ...response.data.stories]
                })
            }
            if (response.data.next === null || response.data.next === undefined) {
                setLoadMore(false)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchStories()
    }, [pageNumber])

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-6 col-md-9 story">
                        <Link to={"/stories"}><i className="fa-solid fa-arrow-left-long mb-4"></i>
                        </Link>
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                {/* helmet  */}
                                {/* <Helmet>
                                    <title>{story.story.split("\r\n")[0]}</title>

                                    <meta property="og:type" content="website" />
                                    <meta property="og:url" content="https://polvote.com/" />
                                    <meta property="og:title" content={story.story.split("\r\n")[0]} />
                                    <meta property="og:description" content="Explore Politics, Learn and Share Insights Online" />
                                    <meta property="og:image" content={story.image[0]} />

                                    <meta property="twitter:card" content="summary_large_image" />
                                    <meta property="twitter:url" content="https://polvote.com/" />
                                    <meta property="twitter:title" content={story.story.split("\r\n")[0]} />
                                    <meta property="twitter:description" content="Explore Politics, Learn and Share Insights Online" />
                                    <meta property="twitter:image" content={story.image[0]} />
                                </Helmet> */}
                                <StoryCard story={story} />
                                <h4 className='mb-3'>other stories</h4>
                                {stories.filter(story => story.status !== "1").map((story, index) => {
                                    return <StoryCard story={story} index={index} key={index} fetchStories={fetchStories} />
                                })
                                }
                                <Loader pageLoading={loadMore} />
                            </>
                        }
                        <div ref={myRef}></div>
                        {/* footer  */}
                        <Footer />
                    </div>
                    <div className="col-lg-3">
                        <div className="aside-sticky">
                            <RecommendedStories />
                        </div>
                    </div>
                </div >
            </div >
            {/* authentication */}
            <AuthModals loginModal={loginModal} setLoginModal={setLoginModal} signupModal={signupModal} setSignupModal={setSignupModal} verificationModal={verificationModal} setVerificationModal={setVerificationModal} />
            {/* login prompt  */}
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt setLoginModal={setLoginModal} setSignupModal={setSignupModal} />}
        </div >
    )
}

export default SingleStory 