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

    const [anonymous, setAnonymous] = useState(false)
    const [storyText, setStoryText] = useState("")
    const [images, setImages] = useState([])

    // handle image click 
    const addImage = () => {
        document.getElementById('add-image1').click()
    }

    // handlePreviewer 
    const handlePreviewer = (e) => {
        const selectedFiles = e.target.files;
        const selectedFileArray = Array.from(selectedFiles);
        setImages((prev => prev.concat(selectedFileArray)))
    }

    // write story 
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const writeStory = () => {
        setLoading(true);
        setError("")
        const fd = new FormData()
        fd.append('ananymous', anonymous)
        fd.append('story', storyText)
        for (const key of Object.keys(images)) {
            fd.append('image', images[key])
        }
        // console.log(Array.from(fd))
        axios({
            url: `${API.API_ROOT}/story/addstory`,
            method: "POST",
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            // console.log(context.user.token)
            setLoading(false)
            // console.log(response)
            window.location.reload()
        }, (error) => {
            setLoading(false)
            // console.log(error)
            setError('Something went wrong, please try again')
        })
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
                                <Modal isOpen={writeStoryModal} onRequestClose={() => setWriteStoryModal(false)} className="story-write-modal">
                                    <i className="far fa-times-circle" onClick={() => setWriteStoryModal(false)} />
                                    <h2>Write New Story</h2>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="img-container">
                                                {context.user.image !== null && context.user.image !== undefined ?
                                                    <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                                    <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                                }
                                                {/* <img src="img/Candidate.png" className="profile-img" alt="profile-img" /> */}
                                            </div>
                                            <div>
                                                <h3>{context.user.firstname} {context.user.lastname}</h3>
                                                <h4 className="mb-0">{context.user.username}</h4>
                                            </div>
                                        </div>
                                        {/* <select name="status" id="status" onChange={(e) => setAnonymous(e.target.value)}>
                                            <option value={false}>Public</option>
                                            <option value={true}>Stay Anonymous</option>
                                        </select> */}
                                    </div>
                                    <textarea name id cols={30} rows={6} placeholder="Share your thought" autoFocus={writeStoryModal} value={storyText} onChange={(e) => setStoryText(e.target.value)} />
                                    <div className="row mb-3">
                                        {images.map((image, index) => {
                                            return (
                                                <div className="col-lg-4" key={index}>
                                                    <img src={URL.createObjectURL(image)} alt="img" id='post-img' className="img-fluid mb-3" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <span>Add to your story</span>
                                            <i className="fas fa-camera" onClick={addImage} />
                                            <input type="file" hidden id='add-image1' accept='image/*' multiple onChange={handlePreviewer} />
                                            {/* <i className="fas fa-microphone" /> */}
                                            {/* <i className="far fa-smile" /> */}
                                        </div>
                                        <div>
                                            <p>{error}</p>
                                            {/* <button id="draft">Save as Draft</button> */}
                                            <button id="post" onClick={writeStory}>{loading ? "loading..." : "Post Story"}</button>
                                        </div>
                                    </div>
                                </Modal>
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