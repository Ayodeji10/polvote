import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function StoryCard({ story, index }) {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // share modal 
    const [shareStoryModal, setShareStoryModal] = useState(false)

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
            setLoading(false)
            setText("")
            setCommentLenght(prev => prev + 1)
        }, (error) => {
            console.log(error)
            setLoading(false)
            // setError('Something went wrong, please try again')
        })
    }

    // const comment = () => {
    //     setLoading(true)
    //     axios({
    //         url: `${API.API_ROOT}/story/addcomment/${story._id}`,
    //         method: "patch",
    //         headers: { "Content-Type": "Application/JSON", 'Authorization': `Bearer ${context.user.token}` },
    //         data: { comment: text }
    //     }).then((response) => {
    //         setLoading(false)
    //         setText("")
    //         setCommentLenght(prev => prev + 1)
    //         console.log(response)
    //         // window.location.reload()
    //     }, (error) => {
    //         setLoading(false)
    //         // console.log(error)
    //         // setError('Something went wrong, please try again')
    //     })
    // }

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

    // share story 
    const [shareImages, setShareImages] = useState([])
    const [shareText, setShareText] = useState("")
    const [shareAnonymous, setShareAnonymous] = useState(false)

    const addShareImage = (index) => {
        document.getElementById(`add-image${index}`).click()
    }

    const handleSharePreviewer = (e) => {
        const selectedFiles = e.target.files;
        const selectedFileArray = Array.from(selectedFiles);
        setShareImages((prev => prev.concat(selectedFileArray)))
    }

    const [shareLoading, setShareLoading] = useState(false)
    const [shareError, setShareError] = useState("")
    const shareStory = () => {
        setShareLoading(true);
        setShareError("")
        if (story.storyinfo.length === 0) {
            const fd = new FormData()
            fd.append('sharecomment', shareText)
            fd.append('ananymous', shareAnonymous)
            for (const key of Object.keys(shareImages)) {
                fd.append('image', shareImages[key])
            }
            axios({
                url: `${API.API_ROOT}/story/sharestory/${story._id}`,
                method: "patch",
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
                data: fd
            }).then((response) => {
                setShareLoading(false)
                window.location.reload()
            }, (error) => {
                setShareLoading(false)
                setShareError('Something went wrong, please try again')
            })
        } else {
            const fd = new FormData()
            fd.append('sharecomment', shareText)
            fd.append('ananymous', shareAnonymous)
            for (const key of Object.keys(shareImages)) {
                fd.append('image', shareImages[key])
            }
            axios({
                url: `${API.API_ROOT}/story/sharestory/${story.storyinfo[0].storyid}`,
                method: "patch",
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
                data: fd
            }).then((response) => {
                setShareLoading(false)
                window.location.reload()
            }, (error) => {
                setShareLoading(false)
                setShareError('Something went wrong, please try again')
            })
        }
    }

    return (
        // <Link to={`/stories/${story._id}`}>
        <div className="story">
            <div className="body">
                <div className="row mb-5 align-items-center">
                    <div className="col-1">
                        <div className="img-container">
                            <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column justify-content-center">
                        <h3>{story.fullname}</h3>
                        <div className="d-flex">
                            <p className="mb-0">{story.username}</p>
                            <p className="mb-0">23 Hours Ago</p>
                        </div>
                    </div>
                    <div className="col-1" onClick={() => setOptions(!options)}>
                        <i className="fas fa-ellipsis-h" />
                        {!options ? "" :
                            <div className="options">
                                <div className="d-flex">
                                    <i className="fa-regular fa-bookmark" />
                                    <div>
                                        <h4>Save Story</h4>
                                        <p>Add story to your saved items</p>
                                    </div>
                                </div>
                                <div className="d-flex" onClick={() => navigator.clipboard.writeText(`http://localhost:3000/stories/${story._id}`)}>
                                    <i className="fa-solid fa-link"></i>
                                    <h4>Copy Link</h4>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <h4>{story.story}</h4>
                <div className="row mb-2">
                    {story.image.map((each, index) => {
                        return (
                            <div className="col-6" key={index}>
                                <img src={`https://polvote.com/ballot/${each}`} alt="img" className="img-fluid" id="story-img" />
                            </div>
                        )
                    })}
                </div>

                {/* share  */}
                {story.storyinfo.length !== 0 &&
                    <div className="shareStory mt-4">
                        <div className="row mb-3 align-items-center">
                            <div className="col-1">
                                <div className="img-container">
                                    <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                                </div>
                            </div>
                            <div className="col-10 d-flex flex-column justify-content-center">
                                <h3>{story.storyinfo[0].fullname}</h3>
                                <div className="d-flex">
                                    <p className="mb-0">{story.storyinfo[0].username}</p>
                                    <p className="mb-0">23 Hours Ago</p>
                                </div>
                            </div>
                        </div>
                        <h4>{story.storyinfo[0].story}</h4>
                        <div className="row mb-2">
                            {story.storyinfo[0].image.map((each, index) => {
                                return (
                                    <div className="col-6" key={index}>
                                        <img src={`https://polvote.com/ballot/${each}`} alt="img" className="img-fluid" id="story-img" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
            <div className="widget">
                <div className="row justify-content-md-center">
                    <div className="col col-lg-3 d-flex align-items-center justify-content-center" onClick={() => navigate(`/stories/${story._id}`)}>
                        <img src="img/comment.png" alt="comment" />
                        <span>{story.comments.length + commentLenght}</span>
                    </div>
                    <div className="col-md-auto d-flex align-items-center justify-content-center">
                        <i className={storyLike === 0 ? "fa-regular fa-heart" : "fa-solid fa-heart"} onClick={like} />
                        <span>{story.likes.length + storyLike}</span>
                    </div>
                    <div className="col col-lg-3 d-flex align-items-center justify-content-center" onClick={() => setShareStoryModal(true)}>
                        <img src="img/share.png" alt="share" />
                        <span>{story.shares.length}</span>
                    </div>
                </div>
            </div>
            {/* share modal  */}
            <Modal isOpen={shareStoryModal} onRequestClose={() => setShareStoryModal(false)} className="story-write-modal" id='share-story-modal'>
                <i className="far fa-times-circle" onClick={() => setShareStoryModal(false)} />
                <h2>Write New Story</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <div className="img-container">
                            <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                        <div>
                            <h3>{context.user.firstname} {context.user.lastname}</h3>
                            <h4 className="mb-0">{context.user.username}</h4>
                        </div>
                    </div>
                    <select name="status" id="status" onChange={(e) => setShareAnonymous(e.target.value)}>
                        <option value={false}>Public</option>
                        <option value={true}>Stay Anonymous</option>
                    </select>
                </div>
                <textarea name id cols={30} rows={2} placeholder="Share your thought" value={shareText} onChange={(e) => setShareText(e.target.value)} />
                <div className="row">
                    {shareImages.map((image, index) => {
                        return (
                            <div className="col-lg-4" key={index}>
                                <img src={URL.createObjectURL(image)} alt="img" id='post-img' className="img-fluid mb-3" />
                            </div>
                        )
                    })}
                </div>
                <div className="story">
                    <div className="d-flex">
                        <div className="img-container">
                            <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                        <div>
                            <h3>{story.storyinfo.length === 0 ? story.fullname : story.storyinfo[0].fullname}</h3>
                            <h4 className="mb-0">{story.storyinfo.length === 0 ? story.username : story.storyinfo[0].username}</h4>
                        </div>
                    </div>
                    <p>{story.story}</p>
                    <div className="row">
                        {story.storyinfo.length === 0 ?
                            <>
                                {story.image.map((each, index) => {
                                    return (
                                        <div className="col-6" key={index}>
                                            <img src={`https://polvote.com/ballot/${each}`} alt="img" className="img-fluid" id="story-img" />
                                        </div>
                                    )
                                })}
                            </>
                            :
                            <>
                                {story.storyinfo[0].image.map((each, index) => {
                                    return (
                                        <div className="col-6" key={index}>
                                            <img src={`https://polvote.com/ballot/${each}`} alt="img" className="img-fluid" id="story-img" />
                                        </div>
                                    )
                                })}
                            </>}
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <span>Add to your story</span>
                        <i className="fas fa-camera" onClick={() => addShareImage(index)} />
                        <input type="file" hidden id={`add-image${index}`} accept='image/*' multiple max="3" onChange={handleSharePreviewer} />
                        <i className="fas fa-microphone" />
                        <i className="far fa-smile" />
                    </div>
                    <div>
                        {/* <button id="draft">Save as Draft</button> */}
                        <p>{shareError}</p>
                        <button id="post" onClick={shareStory}>{shareLoading ? "loading" : "Post Story"}</button>
                    </div>
                </div>
            </Modal>
            <div className="comment">
                <div className="row">
                    <div className="col-1">
                        <div className="img-container">
                            <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
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
                        <button onClick={comment}><img src="img/send.png" alt="send" />{loading ? "loading" : "Send"}</button>
                    </div>
                </div>
            </div>
        </div>
        // </Link>
    )
}

export default StoryCard 