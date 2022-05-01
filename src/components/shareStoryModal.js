import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function ShareStoryModal({ story, index, handleShareStoryModal, openModal }) {
    // context 
    const { context } = useContext(DataContext)

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
                console.log(response)
                setShareLoading(false)
                window.location.reload()
            }, (error) => {
                console.log(error)
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
                console.log(response)
                setShareLoading(false)
                window.location.reload()
            }, (error) => {
                console.log(error)
                setShareLoading(false)
                setShareError('Something went wrong, please try again')
            })
        }
    }

    return (
        <Modal isOpen={openModal} onRequestClose={() => handleShareStoryModal(false)} className="story-write-modal" id='share-story-modal'>
            <i className="far fa-times-circle" onClick={() => handleShareStoryModal(false)} />
            <h2>Write New Story</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                    <div className="img-container">
                        {context.user.image !== null && context.user.image !== undefined ?
                            <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                            <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                        }
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
                        {story.storyinfo.length === 0 ?
                            <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                            <img src={story.storyinfo[0].userimage} alt="avatar" id='profile-img' />
                        }
                    </div>
                    <div>
                        <h3>{story.storyinfo.length === 0 ? story.fullname : story.storyinfo[0].fullname}</h3>
                        <h4 className="mb-0">{story.storyinfo.length === 0 ? story.username : story.storyinfo[0].username}</h4>
                    </div>
                </div>
                <p>{story.storyinfo.length === 0 ? story.story : story.storyinfo[0].story}</p>
                <div className="row">
                    {story.storyinfo.length === 0 ?
                        <>
                            {story.image.map((each, index) => {
                                return (
                                    <div className="col-6" key={index}>
                                        <img src={`${each}`} alt="img" className="img-fluid" id="story-img" />
                                    </div>
                                )
                            })}
                        </>
                        :
                        <>
                            {story.storyinfo[0].image.map((each, index) => {
                                return (
                                    <div className="col-6" key={index}>
                                        <img src={`${each}`} alt="img" className="img-fluid" id="story-img" />
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
                    {/* <i className="fas fa-microphone" /> */}
                    {/* <i className="far fa-smile" /> */}
                </div>
                <div>
                    {/* <button id="draft">Save as Draft</button> */}
                    <p>{shareError}</p>
                    <button id="post" onClick={shareStory}>{shareLoading ? "loading..." : "Post Story"}</button>
                </div>
            </div>
        </Modal>
    )
}

export default ShareStoryModal 