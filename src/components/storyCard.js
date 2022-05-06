import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal';
import NewLineText from "../components/newLineText";
import ShareStoryModal from './shareStoryModal';
Modal.setAppElement('#root')

function StoryCard({ story, index }) {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // utilities 
    const [options, setOptions] = useState(false)
    const [commentLenght, setCommentLenght] = useState(0)
    const [storyLike, setStoryLike] = useState(false)

    // comment 
    const [text, setText] = useState("")
    const [commentImg, setCommentImg] = useState(null)
    const [loading, setLoading] = useState(false)

    // comment image
    const addImage = () => {
        document.getElementById('add-image').click()
    }

    const comment = () => {
        setLoading(true)
        const fd = new FormData()
        fd.append('comment', text)
        if (commentImg !== null & commentImg !== undefined) {
            fd.append('image', commentImg)
        }

        console.log(Array.from(fd))

        axios({
            url: `${API.API_ROOT}/story/addcomment/${story._id}`,
            method: "patch",
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            console.log(response)
            setLoading(false)
            setText("")
            setCommentLenght(prev => prev + 1)
        }, (error) => {
            console.log(error)
            setLoading(false)
            // setError('Something went wrong, please try again')
        })
    }

    // like 
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

    // share story modal 
    const [shareStoryModal, setShareStoryModal] = useState(false)

    const handleShareStoryModal = (variable) => {
        setShareStoryModal(variable)
    }

    return (
        <div className="story">
            <div className="body">
                <div className="row mb-lg-5 mb-md-4 mb-sm-4 mb-4 align-items-center">
                    <div className="col-2 col-sm-1 col-md-1 col-lg-1">
                        <div className="img-container">
                            {story.userimage === null || story.userimage === undefined ?
                                <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                <img src={story.userimage} alt="avatar" id='profile-img' />
                            }
                        </div>
                    </div>
                    <div className="col-9 col-sm-10 col-md-10 col-lg-10 d-flex flex-column justify-content-center">
                        <h3>{story.fullname}</h3>
                        <div className="d-flex">
                            <p className="mb-0">{story.username}</p>
                            <p className="mb-0">{story.createdAt.substring(8, 10)}-{story.createdAt.substring(5, 7)}-{story.createdAt.substring(0, 4)} {parseInt(story.createdAt.substring(11, 13)) + 1}{story.createdAt.substring(13, 16)} {story.createdAt.substring(11, 13) >= 12 ? 'PM' : 'AM'}</p>
                        </div>
                    </div>
                    <div className="col-1" onClick={() => setOptions(!options)}>
                        <i className="fas fa-ellipsis-h" style={{ cursor: "pointer" }} />
                        {!options ? "" :
                            <div className="options">
                                {/* <div className="d-flex">
                                    <i className="fa-regular fa-bookmark" />
                                    <div>
                                        <h4>Save Story</h4>
                                        <p>Add story to your saved items</p>
                                    </div>
                                </div> */}
                                <div className="d-flex" onClick={() => navigator.clipboard.writeText(`https://polvote.com/stories/${story._id}`)}>
                                    <i className="fa-solid fa-link"></i>
                                    <h4>Copy Link</h4>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {/* images  */}
                <div className="row mb-4">
                    {story.image.length <= 1 ?
                        <div className="col-12" key={index}>
                            <img src={story.image[0]} alt="img" className="single-story-img" id="story-img" />
                        </div> :
                        <>
                            {
                                story.image.map((each, index) => {
                                    return (
                                        <div className="col-6" key={index}>
                                            <img src={each} alt="img" className="img-fluid" id="story-img" />
                                        </div>
                                    )
                                })
                            }
                        </>
                    }
                </div>
                {/* <h4>{story.story}</h4> */}
                <NewLineText text={story.story} />
                {/* share  */}
                {story.storyinfo.length !== 0 &&
                    <div className="shareStory mt-4">
                        <div className="row mb-3 align-items-center">
                            <div className="col-2 col-sm-1 col-md-1 col-lg-1">
                                <div className="img-container">
                                    {story.storyinfo.length === 0 ?
                                        <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                        <img src={story.storyinfo[0].userimage} alt="avatar" id='profile-img' />
                                    }
                                </div>
                            </div>
                            <div className="col-10 col-sm-11 col-md-11 col-lg-11 d-flex flex-column justify-content-center">
                                <h3>{story.storyinfo[0].fullname}</h3>
                                <div className="d-flex">
                                    <p className="mb-0">{story.storyinfo[0].username}</p>
                                    {/* <p className="mb-0">23 Hours Ago</p> */}
                                </div>
                            </div>
                        </div>
                        {story.storyinfo[0].image.length <= 1 ?
                            <div className="col-12 mt-4 mb-3" key={index}>
                                <img src={`${story.storyinfo[0].image[0]}`} alt="img" className="single-story-img" id="story-img" />
                            </div> :
                            <div className="row mb-2">
                                {story.storyinfo[0].image.map((each, index) => {
                                    return (
                                        <div className="col-6 mt-4 mb-3" key={index}>
                                            <img src={`${each}`} alt="img" className="img-fluid" id="story-img" />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {/* <h4>{story.storyinfo[0].story}</h4> */}
                        <NewLineText text={story.storyinfo[0].story} />
                    </div>
                }
            </div>
            <div className="widget">
                <div className="row justify-content-md-center">
                    <div className="col-5 d-flex align-items-center justify-content-center" onClick={() => navigate(`/stories/${story._id}`)}>
                        <img src="/img/comment.png" alt="comment" />
                        <span>{story.comments.length + commentLenght}</span>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                        <i className={storyLike === 0 ? "fa-regular fa-heart" : "fa-solid fa-heart"} onClick={like} />
                        <span>{story.likes.length + storyLike}</span>
                    </div>
                    <div className="col-5 d-flex align-items-center justify-content-center" onClick={() => setShareStoryModal(true)}>
                        <img src="/img/share.png" alt="share" />
                        <span>{story.shares.length}</span>
                    </div>
                </div>
            </div>
            {/* share modal  */}
            {shareStoryModal && <ShareStoryModal story={story} index={index} openModal={shareStoryModal} handleShareStoryModal={handleShareStoryModal} />}
            <div className="comment">
                <div className="row align-items-center">
                    <div className="col-1">
                        <div className="img-container">
                            {context.user.image !== null && context.user.image !== undefined ?
                                <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                            }
                        </div>
                    </div>
                    <div className="col-9">
                        {/* <input type="text" placeholder="Leave a comment..." value={text} onChange={(e) => setText(e.target.value)} /> */}
                        <div className="input d-flex justify-content-between align-items-center">
                            <input type="text" placeholder="Leave a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                            <input type="file" id='add-image' accept='image/*' hidden onChange={(e) => setCommentImg(e.target.files[0])} />
                            <i className="fa-regular fa-image" onClick={addImage} />
                            {/* <i class="fa-solid fa-image" ></i> */}
                        </div>
                    </div>
                    <div className="col-2">
                        <button onClick={comment}><img src="/img/send.png" alt="send" />{loading ? "loading" : "Send"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoryCard 