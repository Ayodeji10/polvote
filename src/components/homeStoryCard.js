import React, { useState, useEffect, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";

function HomeStoryCard({ story }) {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // like check 
    const [storyLike, setStoryLike] = useState(false)

    // like story 
    const like = () => {
        axios({
            url: `${API.API_ROOT}/story/likers/${story._id}`,
            method: "patch",
            headers: { 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` },
        }).then((response) => {
            if (response.data.message === "New Likes Added Successfully") {
                setStoryLike(1)
            }
            if (response.data.Success === "Unliked Successfully") {
                setStoryLike(0)
            }
        }, (error) => {
        })
    }

    // show like on load
    useEffect(() => {
        if (story.likes.filter(like => like.userid === context.user._id).length === 0) {
            setStoryLike(0)
        } else {
            setStoryLike(1)
        }
    }, [])

    return (
        <div className="story" onClick={() => navigate(`/stories/${story._id}`)}>
            <div className="img-container mb-3">
                <img src={story.image[0]} alt="story-img" />
            </div>
            <div className="like-btn d-flex justify-content-center align-items-center">
                <i className={storyLike === 0 ? "fa-regular fa-heart" : "fa-solid fa-heart"} onClick={(e) => {
                    e.stopPropagation();
                    like()
                }} />
                {/* <i className="far fa-heart" /> */}
            </div>
            <p className="mb-1">{story.story.length > 40 ? `${story.story.substring(0, 40)}...` : story.story}</p>
        </div>
    )
}

export default HomeStoryCard 