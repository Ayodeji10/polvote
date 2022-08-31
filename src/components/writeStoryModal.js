import React, { useState, useContext } from 'react'
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function WriteStoryModal({ openModal, handleWriteStoryModal }) {
    // context 
    const { context } = useContext(DataContext)

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
    const [storyLoading, setStoryLoading] = useState(false)
    const [storyError, setStoryError] = useState("")
    // const writeStory = () => {
    //     setStoryLoading(true);
    //     setStoryError("")
    //     const fd = new FormData()
    //     fd.append('ananymous', anonymous)
    //     fd.append('story', storyText)
    //     for (const key of Object.keys(images)) {
    //         fd.append('image', images[key])
    //     }
    //     // console.log(Array.from(fd))
    //     axios({
    //         url: `${API.API_ROOT}/story/addstory`,
    //         method: "POST",
    //         headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
    //         data: fd
    //     }).then((response) => {
    //         // console.log(context.user.token)
    //         setStoryLoading(false)
    //         // console.log(response)
    //         window.location.reload()
    //     }, (error) => {
    //         setStoryLoading(false)
    //         // console.log(error)
    //         setStoryError('Something went wrong, please try again')
    //     })
    // }

    const writeStory = () => {
        setStoryLoading(true);
        setStoryError("")
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
            headers: { "Content-Type": "application/x-www-form-urlencoded", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            // setStoryLoading(false)
            // console.log(response)
            window.location.reload()
        }, (error) => {
            setStoryLoading(false)
            // console.log(error)
            setStoryError('Something went wrong, please try again')
        })
    }

    return (
        <Modal isOpen={openModal} onRequestClose={() => handleWriteStoryModal(false)} className={`story-write-modal ${context.darkMode ? 'dm' : ""}`}>
            <i className="far fa-times-circle" onClick={() => handleWriteStoryModal(false)} />
            <h2>New Post</h2>
            <div className="d-flex justify-content-between align-items-center mb-1 mb-md-2 mb-lg-3 mb-sm-3">
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
            <textarea name id cols={30} rows={6} placeholder="Share your thought" autoFocus={openModal} value={storyText} onChange={(e) => setStoryText(e.target.value)} />
            <div className="row mb-3">
                {images.map((image, index) => {
                    return (
                        <div className="col-lg-4" key={index}>
                            <img src={URL.createObjectURL(image)} alt="img" id='post-img' className="img-fluid mb-3" />
                        </div>
                    )
                })}
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span>Add Image</span>
                    <i className="fas fa-camera" onClick={addImage} />
                    <input type="file" hidden id='add-image1' accept='image/*' multiple onChange={handlePreviewer} />
                    {/* <i className="fas fa-microphone" /> */}
                    {/* <i className="far fa-smile" /> */}
                </div>
                <div>
                    <p>{storyError}</p>
                    {/* <button id="draft">Save as Draft</button> */}
                    {storyLoading ? <button id="post" disabled >Loading...</button> : <button id="post" onClick={writeStory}>Post</button>}
                </div>
            </div>
        </Modal>
    )
}

export default WriteStoryModal 