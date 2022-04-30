import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { removeUserSession } from "../utils/common"
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function Aside() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [userOPtions, setUserOptions] = useState(false)

    // fetch polls 
    const [polls, setPolls] = useState([])
    const fetchPolls = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/polls`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // console.log(response.data)
        setPolls(response.data)
    }
    useEffect(() => {
        fetchPolls()
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

    const [logoutModal, setLogoutModal] = useState(false)

    return (
        <>
            {/* user  */}
            <div className="user d-flex justify-content-between align-items-center mb-lg-5" >
                <div className="d-flex">
                    <div className="avatar">
                        <Link to={"/user-profile"}>
                            {context.user.image !== null && context.user.image !== undefined ?
                                <img src={context.user.image} alt="avatar" id='profile-img' /> :
                                <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' />
                            }
                        </Link>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                        <p>Welcome</p>
                        <h3 className="mb-0">{context.user.email}</h3>
                    </div>
                </div>
                <i style={{ cursor: "pointer" }} className="fas fa-ellipsis-v" onMouseOver={() => setUserOptions(true)} />
            </div >

            {/* settings  */}
            {userOPtions &&
                <div className="settings mb-4" onMouseLeave={() => setUserOptions(false)}>
                    <p onClick={() => {
                        setContext({ ...context, profileView: "edit" })
                        navigate('/user-profile')
                    }}>Account Settings</p>
                    <p onClick={() => {
                        setContext({ ...context, profileView: "aspirants" })
                        navigate('/user-profile')
                    }}>Aspirant Profiles</p>
                    <p onClick={() => {
                        setContext({ ...context, profileView: "stories" })
                        navigate('/user-profile')
                    }}>My Stories</p>
                    <p onClick={() => setLogoutModal(true)}>Logout</p>

                    {/* logout modal  */}
                    <Modal isOpen={logoutModal} onRequestClose={() => setLogoutModal(false)} id="logoutModal">
                        <div className="d-flex flex-column align-items-center">
                            <h3>Are you sure you want to Logout?</h3>
                            <button id="log-out" onClick={(e) => {
                                e.preventDefault();
                                removeUserSession();
                                setContext({ ...context, user: {} });
                                navigate("/")
                            }} >Logout</button>
                            <button id='cancel-log' onClick={() => {
                                setLogoutModal(false)
                                setUserOptions(false)
                            }}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            }

            {/* courses  */}
            {/* <div className="course">
                <h3 className="mb-2">Sponsored Courses</h3>
                <div className="card">
                    <div className="header" />
                    <div className="body">
                        <h3>The Politics of Skepticism</h3>
                        <span className="d-flex align-items-center mb-lg-4">
                            <i className="fas fa-star" />
                            <h4 className="mb-0">4.9</h4>
                            <h5 className="mb-0">4,709 Ratings</h5>
                        </span>
                        <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipisci
                            ng elit. Dui orci enim habitant ornare eget sem.
                            Ipsum nibh nisl donec lacus. Consequat, ac phas
                            ellus augue nunc sed. Molestie sodales feugiat d
                            iam, metus, elementum ipsum hendrerit.</p>
                        <button>Enrol Now</button>
                    </div>
                </div>
            </div> */}

            {/* ad  */}
            {/* <div className='ad mb-4'>
                <span className='mb-2'>Close Ad <i className="fas fa-times-circle" /></span>
                <img src="/img/EZ-Cash-loan 2.png" alt="" />
            </div> */}
            <div>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                    crossorigin="anonymous"></script>
                <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>

            {/* Stories  */}
            <div className="content">
                <span className='d-flex align-items-center mb-3' onClick={() => setWriteStoryModal(true)}>
                    <img src="/img/Group.png" alt="" /><span>Write a Story</span>
                </span>

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
                <Link to={"/create-aspirant"} className="d-flex align-items-center mb-0">
                    <img src="/img/carbon_user-profile.png" alt="" /><span>Create Aspirant Profile</span>
                </Link>
            </div>

            {/* courses  */}
            {/* <div className="courses">
                <h3>My Courses</h3>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector.png" alt="" />
                    <h4 className="mb-0">In Progress</h4>
                </a>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector (1).png" alt="" />
                    <h4 className="mb-0">Completed</h4>
                </a>
                <a href className="d-flex align-items-center mb-0"><img src="/img/Vector (2).png" alt="" />
                    <h4 className="mb-0">My Certificates</h4>
                </a>
            </div> */}

            {/* polls  */}
            <div className="polls">
                <h3>Active Polls</h3>
                <div className="active-polls">
                    {polls.map(poll => {
                        return (
                            <Link to={`/polls/${poll._id}`} className="d-flex justify-content-between align-items-center" key={poll._id}>
                                <h4 className="mb-0">{poll.polltitle}</h4><i className="fas fa-angle-right" />
                            </Link>
                        )
                    })}
                    {/* <a href className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">2023 Presidential Poll</h4><i className="fas fa-angle-right" />
                    </a> */}
                </div>
            </div>
        </>
    )
}

export default Aside