import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Aside from '../components/aside'
import Footer from '../components/footer'
import Comment from '../components/comments'
import { Link, useParams, useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import StoryCard from '../components/storyCard'
import Loader from '../components/loader';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SingleStory() {
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
                    <div className="col-lg-8 col-md-9 story">
                        <Link to={"/stories"}><i className="fa-solid fa-arrow-left-long mb-4"></i>
                        </Link>
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                <StoryCard story={story} />
                                {/* comments  */}
                                {story.comments.length > 0 &&
                                    <div className="comments">
                                        {story.comments.map((comment, index) => {
                                            return <Comment comment={comment} id={id} key={index} />
                                        })}
                                    </div>
                                }
                            </>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                </div >
            </div >
        </div >
    )
}

export default SingleStory 