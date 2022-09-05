import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import NewLineText from "../components/newLineText";
import ShareStoryModal from './shareStoryModal';
import EditStoryModal from './editStoryModal';
import DeleteStoryModal from './deleteStoryModal';
import Comment from '../components/comments'
import LoginModal from './loginModal';
import ShareStoryModalOut from './shareStoryModalOut';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function StoryCard({ story, index, fetchStories }) {
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

    // login modal 
    const [loginModal, setLoginModal] = useState(false)

    // image modal 
    const [imageModal, setImageModal] = useState(false)

    const comment = () => {
        if (localStorage.getItem('ballotbox_token') !== null) {
            setLoading(true)
            const fd = new FormData()
            fd.append('comment', text)
            if (commentImg !== null & commentImg !== undefined) {
                fd.append('image', commentImg)
            }
            // console.log(Array.from(fd))
            axios({
                url: `${API.API_ROOT}/story/addcomment/${story._id}`,
                method: "patch",
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
                data: fd
            }).then((response) => {
                // console.log(response)
                setLoading(false)
                setText("")
                setCommentLenght(prev => prev + 1)
                fetchStories()
                // window.location.reload()
            }, (error) => {
                // console.log(error)
                setLoading(false)
                // setError('Something went wrong, please try again')
            })
        } else {
            setLoginModal(true)
        }
    }

    // lenght of comment showed 
    const [commentLength, setCommentLength] = useState(2)

    // like 
    const like = () => {
        if (localStorage.getItem('ballotbox_token') !== null) {
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
        } else {
            setLoginModal(true)
        }
    }

    // show like on load
    useEffect(() => {
        if (story.likes.filter(like => like.userid === context.user._id).length === 0) {
            setStoryLike(0)
        } else {
            setStoryLike(1)
        }
    }, [])

    // story modals
    const [shareStoryModal, setShareStoryModal] = useState(false)
    const [editStoryModal, setEditStoryModal] = useState(false)
    const [deleteStoryModal, setDeleteStoryModal] = useState(false)
    const [shareStoryModalOut, setShareStoryModalOut] = useState(false)

    // get time stamp 
    const [storytime, setStoryTIme] = useState("")
    const [storyDate, setStoryDate] = useState("")

    const getDate = () => {
        let today = new Date()  // today's date
        let d = new Date(story.createdAt) // story date

        // get days differenece
        const time = Math.abs(today - d)
        const days = Math.ceil(time / (1000 * 60 * 60 * 24))

        // set date 
        if (days <= 1) {
            setStoryTIme(`${parseInt(story.createdAt.substring(11, 13)) + 1}${story.createdAt.substring(13, 16)} ${story.createdAt.substring(11, 13) >= 12 ? 'PM' : 'AM'}`)
        } else {
            setStoryTIme(`${parseInt(story.createdAt.substring(11, 13)) + 1}${story.createdAt.substring(13, 16)} ${story.createdAt.substring(11, 13) >= 12 ? 'PM' : 'AM'}`)
            if (days < 30) {
                setStoryDate(`${days - 1} day${days - 1 > 1 ? "s" : ""} ago`)
            } else {
                setStoryDate(`${story.createdAt.substring(8, 10)}-${story.createdAt.substring(5, 7)}-${story.createdAt.substring(0, 4)}`)
            }
        }
    }

    useEffect(() => {
        getDate()
    }, [])

    // followers 
    const [followers, setFollowers] = useState([])
    const [followersLoading, setFollowersLoading] = useState(true)
    const fetchFollowers = () => {
        axios.get(`${API.API_ROOT}/follow/followers/${story.userid}`,
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                // console.log(response)
                setFollowers(response.data.followers)
                setFollowersLoading(false)
            }).catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchFollowers()
    }, [])

    // follow 
    const [followLoading, setFollowLoading] = useState(false)
    const follow = () => {
        setFollowLoading(true)
        axios.post(`${API.API_ROOT}/follow`,
            { followedid: story.userid },
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                // console.log(response)
                fetchFollowers()
                setFollowLoading(false)
                setOptions(false)
            }).catch(error => {
                console.error(error)
                setFollowLoading(false)
            })
    }

    // unfollow 
    const [unfollowLoading, setUnfollowLoading] = useState(false)
    const unfollow = () => {
        setUnfollowLoading(true)
        axios.patch(`${API.API_ROOT}/follow/unfollow/${story.userid}`,
            { followedid: story.userid },
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ballotbox_token')}` } })
            .then(response => {
                // console.log(response)
                fetchFollowers()
                setUnfollowLoading(false)
                setOptions(false)
            }).catch(error => {
                console.error(error)
                setUnfollowLoading(false)
            })
    }

    return (
        <div className="story">
            <div className="body">
                <div className="row mb-3 align-items-center">
                    <div className="col-11 d-flex align-items-center gap-lg-3 gap-md-3 gap-sm-2 gap-2">
                        <div className="img-container">
                            {story.userimage === null || story.userimage === undefined ?
                                <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                <img src={story.userimage} alt="avatar" id='profile-img' />
                            }
                        </div>
                        <div>
                            <h3 onClick={(e) => {
                                e.preventDefault()
                                navigate(`/user/${story.userid}`)
                            }}>{story.fullname}</h3>
                            <div className="d-flex">
                                <p className="mb-0">{story.username}</p>
                                {storyDate && <p>{storyDate}</p>}
                                {storytime && <p className='mb-0'>{storytime}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="col-1" onClick={() => setOptions(!options)}>
                        <i className="fas fa-ellipsis-h" style={{ cursor: "pointer" }} />
                        {!options ? "" :
                            <div className="options">
                                <div className="d-flex align-items-center mb-1" onClick={() => navigator.clipboard.writeText(`https://polvote.com/stories/${story.story.split("\r\n")[0].replaceAll(' ', '-').replaceAll('?', '')}/${story._id}`)}>
                                    <i className="fa-solid fa-copy" />
                                    <h4 className='mb-0'>Copy Link</h4>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="fa-solid fa-retweet" />
                                    <h4 className='mb-0' onClick={() => {
                                        if (localStorage.getItem('ballotbox_token') === null) {
                                            setLoginModal(true)
                                        } else {
                                            setShareStoryModal(true)
                                        }
                                    }}>Re-Post</h4>
                                </div>
                                <div className="d-flex align-items-center mb-1" onClick={() => navigate(`/stories/${story.story.split("\r\n")[0].replaceAll(' ', '-').replaceAll('?', '')}/${story._id}`)}>
                                    <i className="fa-solid fa-arrow-up-right-from-square" />
                                    <h4 className='mb-0'>Open Post</h4>
                                </div>
                                {/* {story.userid !== context.user._id && localStorage.getItem('ballotbox_token') !== null &&
                                    <>
                                        {!followersLoading &&
                                            <>
                                                {followers.filter(follower => follower.followerid === context.user._id && follower.status === 0).length === 0 ?
                                                    <div className="d-flex align-items-center mb-1" onClick={follow}>
                                                        {followLoading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-user-plus" />}
                                                        <h4 className='mb-0'>{followLoading ? "following" : "Follow"} {story.username}</h4>
                                                    </div> :
                                                    <div className="d-flex align-items-center mb-1" onClick={unfollow}>
                                                        {unfollowLoading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-user-minus" />}
                                                        <h4 className='mb-0'>{unfollowLoading ? "unfollowing" : "Unfollow"} {story.username}</h4>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </>
                                } */}
                                {story.userid === context.user._id && localStorage.getItem('ballotbox_token') !== null &&
                                    <>
                                        <div className="d-flex align-items-center mb-1" onClick={() => setEditStoryModal(true)}>
                                            <i className="fa-solid fa-pen-to-square" />
                                            <h4 className='mb-0'>Edit Post</h4>
                                        </div>
                                        <div className="d-flex align-items-center mb-1" onClick={() => setDeleteStoryModal(true)} >
                                            <i className="fa-solid fa-trash-can" />
                                            <h4 className='mb-0'>Delete Post</h4>
                                        </div>
                                    </>
                                }
                            </div>
                        }
                    </div>
                </div>
                {/* <h4>{story.story}</h4> */}
                <NewLineText text={story.story} />
                {/* images  */}
                <div className="row mb-4 story-img">
                    {story.image.length !== 0 &&
                        <>
                            {
                                story.image.length === 1 ?
                                    <div className="col-12" key={index}>
                                        <LazyLoadImage
                                            // alt={image.alt}
                                            // height={image.height}
                                            src={story.image[0]}
                                            className="single-story-img"
                                            placeholderSrc={process.env.PUBLIC_URL + 'img/persona.png'}
                                            onClick={() => setImageModal(true)}
                                        // width={image.width} 
                                        />
                                        {/* <img src={story.image[0]} alt="img" className="single-story-img" id="story-img" onClick={() => setImageModal(true)} /> */}
                                        <Modal isOpen={imageModal} onRequestClose={() => setImageModal(false)} id="profileImgModal" className={`${context.darkMode ? 'dm' : ""}`}>
                                            <i className="fas fa-times" onClick={() => setImageModal(false)} />
                                            {/* <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} onClick={() => setProfileImageModal(true)} alt="profile-img" className="img-fluid" /> */}
                                            <img src={story.image[0]} alt="img" className="img-fluid" id="story-img" />
                                        </Modal>
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
                        </>
                    }
                </div>
                {/* share  */}
                {story.storyinfo.length !== 0 &&
                    <div className="shareStory mt-4">
                        <div className="row mb-3 align-items-center">
                            <div className="col-2 col-sm-1 col-md-1 col-lg-1">
                                <div className="img-container">
                                    {story.storyinfo[0].userimage === null || story.storyinfo[0].userimage === undefined ?
                                        <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                        <img src={story.storyinfo[0].userimage} alt="avatar" id='profile-img' />
                                    }
                                </div>
                            </div>
                            <div className="col-10 col-sm-11 col-md-11 col-lg-11 d-flex flex-column justify-content-center">
                                <h3 onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/user/${story.storyinfo[0].userid}`)
                                }}>{story.storyinfo[0].fullname}</h3>
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
                        <img src={context.darkMode ? "/img/comments-lm.png" : "/img/comment.png"} alt="comment" />
                        <span>{story.comments.length + commentLenght}</span>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                        <i className={storyLike === 0 ? "fa-regular fa-heart" : "fa-solid fa-heart"} onClick={like} />
                        <span>{story.likes.length + storyLike}</span>
                    </div>
                    <div className="col-5 d-flex align-items-center justify-content-center" onClick={() => {
                        if (localStorage.getItem('ballotbox_token') !== null) {
                            setShareStoryModalOut(true)
                        } else {
                            setLoginModal(true)
                        }
                    }}>
                        <img src={context.darkMode ? "/img/share-lm.png" : "/img/share.png"} alt="share" />
                        <span>{story.shares.length}</span>
                    </div>
                </div>
            </div>
            {/* share modal  */}
            {shareStoryModal && <ShareStoryModal story={story} index={index} openModal={shareStoryModal} setShareStoryModal={setShareStoryModal} />}
            {/* edit story modal */}
            {editStoryModal && <EditStoryModal story={story} index={index} openModal={editStoryModal} setEditStoryModal={setEditStoryModal} />}
            {/* deleteStoryModal  */}
            {deleteStoryModal && <DeleteStoryModal story={story} openModal={deleteStoryModal} setDeleteStoryModal={setDeleteStoryModal} />}
            {/* share story out modal  */}
            {shareStoryModalOut && <ShareStoryModalOut story={story} openModal={shareStoryModalOut} setShareStoryModalOut={setShareStoryModalOut} />}
            {/* comments  */}
            {window.location.pathname !== "/user-profile" &&
                <>
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
                            <div className="col-8">
                                {/* <input type="text" placeholder="Leave a comment..." value={text} onChange={(e) => setText(e.target.value)} /> */}
                                <div className="input d-flex justify-content-between align-items-center">
                                    <input type="text" placeholder="Leave a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                                    <input type="file" id='add-image' accept='image/*' hidden onChange={(e) => setCommentImg(e.target.files[0])} />
                                    <i className="fa-regular fa-image" onClick={addImage} />
                                    {/* <i class="fa-solid fa-image" ></i> */}
                                </div>
                            </div>
                            <div className="col-3">
                                <button onClick={comment}><img src="/img/send.png" alt="send" />{loading ? "loading" : "Send"}</button>
                                {/* login modal */}
                                {loginModal && <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />}
                            </div>
                        </div>
                    </div>
                    {story.comments.length > 0 &&
                        <div className="comments">
                            <h2>Comments</h2>
                            {story.comments.slice(0, commentLength).map((comment, index) => {
                                return <Comment comment={comment} fetchStories={fetchStories} id={story._id} key={index} />
                            })}
                            {story.comments.length > 2 && <h5 id='loadMore' onClick={() => setCommentLength(story.comments.length)}>Load more comments</h5>}
                        </div>
                    }
                </>
            }
        </div>
        // }
    )
}

export default StoryCard 