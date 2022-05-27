import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { removeUserSession } from "../utils/common"
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import WriteStoryModal from './writeStoryModal';
// import Ad1 from './ad1';
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

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    // google ads
    // useEffect(() => {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }, [])
    // useEffect(() => {
    //     const pushAd = () => {
    //         try {
    //             const adsbygoogle = window.adsbygoogle
    //             console.log({ adsbygoogle })
    //             adsbygoogle.push({})
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }

    //     let interval = setInterval(() => {
    //         // Check if Adsense script is loaded every 300ms
    //         if (window.adsbygoogle) {
    //             pushAd()
    //             // clear the interval once the ad is pushed so that function isn't called indefinitely
    //             clearInterval(interval)
    //         }
    //     }, 300)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    // logout modal 
    const [logoutModal, setLogoutModal] = useState(false)

    return (
        <>
            {/* user  */}
            <div className="user d-flex justify-content-between align-items-center mb-lg-5 mb-3" >
                <div className="d-flex" style={{ cursor: "pointer" }} onClick={() => navigate("/user-profile")}>
                    <div className="avatar">
                        {context.user.image !== null && context.user.image !== undefined ?
                            <img src={context.user.image} alt="avatar" id='profile-img' /> :
                            <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' />
                        }
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
            {/* <div>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                    crossOrigin="anonymous"></script>
                <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={2804702051} data-ad-format="auto" data-full-width-responsive="true" />
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div> */}
            {/* <Ad1 /> */}

            {/* Stories  */}
            <div className="content">
                <span className='d-flex align-items-center mb-3' onClick={() => setWriteStoryModal(true)}>
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14 2.00002C14.197 2.19698 14.3533 2.43083 14.4599 2.6882C14.5666 2.94558 14.6215 3.22143 14.6215 3.50002C14.6215 3.77861 14.5666 4.05447 14.4599 4.31184C14.3533 4.56922 14.197 4.80306 14 5.00002L4.5 14.5L0.5 15.5L1.5 11.556L11.004 2.00402C11.3786 1.62759 11.8811 1.40579 12.4116 1.38263C12.9422 1.35947 13.462 1.53666 13.868 1.87902L14 2.00002Z" stroke="#0A183D" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.5 15.5H14.5" stroke="#0A183D" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.5 4.5L13.5 5.5" stroke="#0A183D" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Write a Story</span>
                </span>

                {/* write modal  */}
                {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                <Link to={"/create-aspirant"} className="d-flex align-items-center mb-0">
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 2.5C8.11807 2.5 8.72226 2.68328 9.23616 3.02666C9.75006 3.37004 10.1506 3.85809 10.3871 4.42911C10.6236 5.00013 10.6855 5.62847 10.565 6.23466C10.4444 6.84085 10.1467 7.39767 9.70971 7.83471C9.27267 8.27175 8.71585 8.56937 8.10966 8.68995C7.50347 8.81053 6.87514 8.74865 6.30412 8.51212C5.7331 8.2756 5.24504 7.87506 4.90166 7.36116C4.55828 6.84725 4.375 6.24307 4.375 5.625C4.375 4.7962 4.70424 4.00134 5.29029 3.41529C5.87634 2.82924 6.6712 2.5 7.5 2.5ZM7.5 1.25C6.63471 1.25 5.78885 1.50659 5.06938 1.98732C4.34992 2.46805 3.78916 3.15133 3.45803 3.95076C3.1269 4.75019 3.04026 5.62985 3.20907 6.47852C3.37788 7.32719 3.79456 8.10674 4.40641 8.71859C5.01826 9.33045 5.79782 9.74712 6.64648 9.91593C7.49515 10.0847 8.37482 9.99811 9.17424 9.66697C9.97367 9.33584 10.657 8.77508 11.1377 8.05562C11.6184 7.33615 11.875 6.49029 11.875 5.625C11.875 4.46468 11.4141 3.35188 10.5936 2.53141C9.77312 1.71094 8.66032 1.25 7.5 1.25Z" fill="#0A183D" />
                        <path d="M13.75 18.75H12.5V15.625C12.5 14.7962 12.1708 14.0013 11.5847 13.4153C10.9987 12.8292 10.2038 12.5 9.375 12.5H5.625C4.7962 12.5 4.00134 12.8292 3.41529 13.4153C2.82924 14.0013 2.5 14.7962 2.5 15.625V18.75H1.25V15.625C1.25 14.4647 1.71094 13.3519 2.53141 12.5314C3.35188 11.7109 4.46468 11.25 5.625 11.25H9.375C10.5353 11.25 11.6481 11.7109 12.4686 12.5314C13.2891 13.3519 13.75 14.4647 13.75 15.625V18.75Z" fill="#0A183D" />
                        <path d="M13.75 2.5H20V3.75H13.75V2.5Z" fill="#0A183D" />
                        <path d="M13.75 5.625H20V6.875H13.75V5.625Z" fill="#0A183D" />
                        <path d="M13.75 8.75H18.125V10H13.75V8.75Z" fill="#0A183D" />
                    </svg>
                    <span>Create Aspirant Profile</span>
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