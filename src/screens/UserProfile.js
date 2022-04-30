import React, { useState, useContext, useEffect } from 'react'
import Footer from '../components/footer'
import Nav from '../components/nav'
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import { removeUserSession } from "../utils/common"
import { API } from "../components/apiRoot";
import axios from "axios";
import StoryCard from '../components/storyCard';
import SingleProfileCard from '../components/singleProfileCard';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function UserProfile() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    // const [walletView, setWalletView] = useState('stories')

    // profile setting 
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
    const [profileUpdateError, setProfileUpdateError] = useState("")

    // handle profile update 
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setProfileUpdateError(null)
        setProfileUpdateLoading(true)
        axios.post(`${API.API_ROOT}/users/editprofile`, { firstname: context.user.firstname, lastname: context.user.lastname, email: context.user.email, username: context.user.username, phonenumber: context.user.phonenumber }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("ballotbox_token")}` } })
            .then(response => {
                console.log(response)
                setContext({ ...context, user: { ...context.user, ...response.data } })
                setProfileUpdateLoading(false);
                // window.location.reload()
            }).catch(error => {
                setProfileUpdateLoading(false)
                setProfileUpdateError('Something went wrong, please try again')
                console.error(error)
            })
    }

    // password change 
    const [oldPasswoord, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false)
    const [passwordUpdateError, setPasswordUpdateError] = useState("")

    // handl update password 
    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setPasswordUpdateError(null)
        setPasswordUpdateLoading(true)
        if (newPassword !== confirmPassword) {
            setPasswordUpdateError('New passwords dont match')
        } else {
            axios.post(`${API.API_ROOT}/users/changepassword`, { password: oldPasswoord, passwordnew: newPassword }, { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${context.user.token}` } })
                .then(response => {
                    // console.log(response)
                    // setContext({ ...context, user: response.data, backupUser: response.data })
                    setPasswordUpdateLoading(false);
                    // window.location.reload()
                }).catch(error => {
                    setPasswordUpdateLoading(false)
                    setPasswordUpdateError('Something went wrong, please try again')
                    console.error(error)
                })
        }
    }

    // fetch aspirants, stories
    const [aspirants, setAspirants] = useState([])
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // const persons = response.data.filter((aspirant) => aspirant.creatorid === context.user._id)
        // setAspirants(persons)
        setAspirants(response.data)
    }

    const [stories, setStories] = useState([])
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // const stories = response.data.filter(story => story.userid === context.user._id)
        // setStories(stories)
        setStories(response.data)
    }

    useEffect(() => {
        fetchAspirants()
        fetchStories()
    }, [])

    // cover picture 
    // click cover photo input 
    const coverPhoto = () => {
        document.getElementById('cover-pic').click()
    }

    // cover image and looader
    const [coverImgae, setCoverImage] = useState(null)
    const [coverPhotoLoader, setCoverPhotoLoader] = useState(false)

    // upload cover image 
    useEffect(() => {
        if (coverImgae !== null) {
            const fd = new FormData()
            fd.append('image', coverImgae)
            console.log(coverImgae)
            console.log(Array.from(fd))
            setCoverPhotoLoader(true)
            axios({
                url: `${API.API_ROOT}/users/coverimage`,
                method: "post",
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
                data: fd
            }).then((response) => {
                setCoverPhotoLoader(false)
                console.log(response)
                // navigate(`/edit-aspirant/setup-aspirant/${id}`)
                setContext({ ...context, user: { ...context.user, coverimage: response.data.coverimage } })
            }, (error) => {
                setCoverPhotoLoader(false)
                // setError('Something went wrong, please try again')
                console.log(error)
            })
        }
    }, [coverImgae])

    // profile picture 
    // click profile photo input 
    const profilePhoto = () => {
        document.getElementById('profile-pic').click()
    }

    // // cover image and looader
    const [profilePic, setProfilePic] = useState(null)
    const [profilePicLoader, setProfilePicLoader] = useState(false)

    // // upload profile pic, check if it is updated and upload immediately
    useEffect(() => {
        if (profilePic !== null) {
            const fd = new FormData()
            fd.append('image', profilePic)
            // console.log(profilePic)
            // console.log(Array.from(fd))
            setProfilePicLoader(true)
            axios({
                url: `${API.API_ROOT}/users/addimage`,
                method: "post",
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
                data: fd
            }).then((response) => {
                setProfilePicLoader(false)
                console.log(response)
                setContext({ ...context, user: { ...context.user, image: response.data.image } })
            }, (error) => {
                setProfilePicLoader(false)
                console.log(error)
            })
        }
    }, [profilePic])

    // log out 
    const [logoutModal, setLogoutModal] = useState(false)

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
            {/* navigation */}
            <Nav />
            <div className="home-feed container">
                <div className="user-widget" style={{
                    backgroundImage: context.user.coverimage != undefined && `url(${context.user.coverimage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                    // backgroundColor: 'unset' 
                }}>
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="position-relative">
                                <div className="img-container">
                                    {context.user.image !== null && context.user.image !== undefined ?
                                        <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                        <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                    }
                                    <img id="change-img" src="img/add-img.png" alt="change-profile-pic" onClick={profilePhoto} />
                                    <input type="file" accept='image/*' hidden id='profile-pic' onChange={(e) => {
                                        setProfilePic(e.target.files[0]);
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 d-flex flex-column justify-content-center">
                            <h1 className="mb-0">{context.user.firstname} {context.user.lastname}</h1>
                            <h4 className="mb-0">{context.user.username}</h4>
                        </div>
                        <div className="col-lg-3 d-flex justify-content-end align-items-start">
                            <button onClick={coverPhoto}>{coverPhotoLoader ? "loading..." : "Change Cover Picture"}</button>
                            <input type="file" accept='image/*' id='cover-pic' hidden onChange={(e) => setCoverImage(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* aside  */}
                    <div className="col-lg-3 user-aside">
                        <section>
                            <button className={context.profileView === "aspirants" && "active"} onClick={() => setContext({ ...context, profileView: "aspirants" })} >
                                <svg width={24} height={26} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 4.875C15.55 4.875 13.45 5.30833 12 6.5C10.55 5.30833 8.45 4.875 6.5 4.875C5.05 4.875 3.51 5.11333 2.22 5.73083C1.49 6.08833 1 6.8575 1 7.735V19.955C1 21.3633 2.22 22.4033 3.48 22.0567C4.46 21.7858 5.5 21.6667 6.5 21.6667C8.06 21.6667 9.72 21.9483 11.06 22.6633C11.66 22.9883 12.34 22.9883 12.93 22.6633C14.27 21.9375 15.93 21.6667 17.49 21.6667C18.49 21.6667 19.53 21.7858 20.51 22.0567C21.77 22.4142 22.99 21.3742 22.99 19.955V7.735C22.99 6.8575 22.5 6.08833 21.77 5.73083C20.49 5.11333 18.95 4.875 17.5 4.875ZM21 18.6658C21 19.3483 20.42 19.8467 19.8 19.7275C19.05 19.5758 18.27 19.5108 17.5 19.5108C15.8 19.5108 13.35 20.215 12 21.1358V8.66667C13.35 7.74583 15.8 7.04167 17.5 7.04167C18.42 7.04167 19.33 7.13917 20.2 7.345C20.66 7.45333 21 7.8975 21 8.40667V18.6658Z" fill="white" fillOpacity="0.5" />
                                    <path d="M13.9799 11.9275C13.6599 11.9275 13.3699 11.7108 13.2699 11.3642C13.1399 10.9417 13.3599 10.4758 13.7499 10.3458C15.2899 9.80417 17.2799 9.63084 19.1099 9.85834C19.5199 9.91251 19.8199 10.3133 19.7699 10.7575C19.7199 11.2017 19.3499 11.5267 18.9399 11.4725C17.3199 11.2667 15.5499 11.4292 14.2099 11.895C14.1299 11.9058 14.0499 11.9275 13.9799 11.9275ZM13.9799 14.8092C13.6599 14.8092 13.3699 14.5925 13.2699 14.2458C13.1399 13.8233 13.3599 13.3575 13.7499 13.2275C15.2799 12.6858 17.2799 12.5125 19.1099 12.74C19.5199 12.7942 19.8199 13.195 19.7699 13.6392C19.7199 14.0833 19.3499 14.4083 18.9399 14.3542C17.3199 14.1483 15.5499 14.3108 14.2099 14.7767C14.1347 14.7974 14.0575 14.8083 13.9799 14.8092ZM13.9799 17.6908C13.6599 17.6908 13.3699 17.4742 13.2699 17.1275C13.1399 16.705 13.3599 16.2392 13.7499 16.1092C15.2799 15.5675 17.2799 15.3942 19.1099 15.6217C19.5199 15.6758 19.8199 16.0767 19.7699 16.5208C19.7199 16.965 19.3499 17.2792 18.9399 17.2358C17.3199 17.03 15.5499 17.1925 14.2099 17.6583C14.1347 17.6791 14.0575 17.69 13.9799 17.6908Z" fill="white" fillOpacity="0.5" />
                                </svg>
                                Aspirant Profiles
                            </button>
                            <button className={context.profileView === "stories" && "active"} onClick={() => setContext({ ...context, profileView: "stories" })}>
                                <svg width={28} height={28} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.1667 3.5H5.83333C4.55 3.5 3.5 4.55 3.5 5.83333V22.1667C3.5 23.45 4.55 24.5 5.83333 24.5H22.1667C23.45 24.5 24.5 23.45 24.5 22.1667V5.83333C24.5 4.55 23.45 3.5 22.1667 3.5ZM12.8333 19.8333H8.16667C7.525 19.8333 7 19.3083 7 18.6667C7 18.025 7.525 17.5 8.16667 17.5H12.8333C13.475 17.5 14 18.025 14 18.6667C14 19.3083 13.475 19.8333 12.8333 19.8333ZM16.3333 15.1667H11.6667C11.025 15.1667 10.5 14.6417 10.5 14C10.5 13.3583 11.025 12.8333 11.6667 12.8333H16.3333C16.975 12.8333 17.5 13.3583 17.5 14C17.5 14.6417 16.975 15.1667 16.3333 15.1667ZM19.8333 10.5H15.1667C14.525 10.5 14 9.975 14 9.33333C14 8.69167 14.525 8.16667 15.1667 8.16667H19.8333C20.475 8.16667 21 8.69167 21 9.33333C21 9.975 20.475 10.5 19.8333 10.5Z" fill="white" fillOpacity="0.5" />
                                </svg>
                                Stories
                            </button>
                            {/* <button className={currentView === "wallet" && "active"} onClick={() => setCurrentView('wallet')}><img src="img/wallet.png" alt="wallet" />My Wallet</button> */}
                            {/* <button><img src="img/courses.png" alt="courses" />My Courses</button> */}
                        </section>
                        <section>
                            {/* <button><img src="img/notification 2.png" alt="notification" />Notifications</button> */}
                            <button className={context.profileView === "edit" && "active"} onClick={() => setContext({ ...context, profileView: 'edit' })}>
                                <svg width={28} height={28} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.5">
                                        <path d="M14.0137 10.6801C13.1961 10.6801 12.4305 10.9973 11.8508 11.5769C11.2738 12.1566 10.9539 12.9223 10.9539 13.7398C10.9539 14.5574 11.2738 15.323 11.8508 15.9027C12.4305 16.4797 13.1961 16.7996 14.0137 16.7996C14.8313 16.7996 15.5969 16.4797 16.1766 15.9027C16.7535 15.323 17.0734 14.5574 17.0734 13.7398C17.0734 12.9223 16.7535 12.1566 16.1766 11.5769C15.8934 11.2916 15.5564 11.0654 15.1851 10.9115C14.8138 10.7575 14.4156 10.6788 14.0137 10.6801ZM25.2875 17.1195L23.4992 15.591C23.584 15.0715 23.6277 14.541 23.6277 14.0133C23.6277 13.4855 23.584 12.9523 23.4992 12.4355L25.2875 10.907C25.4226 10.7914 25.5193 10.6373 25.5647 10.4654C25.6101 10.2935 25.6021 10.1118 25.5418 9.94453L25.5172 9.87343C25.025 8.4972 24.2876 7.22151 23.3406 6.1082L23.2914 6.05078C23.1764 5.91557 23.0232 5.81837 22.8518 5.772C22.6805 5.72563 22.4991 5.73226 22.3316 5.79101L20.1113 6.58125C19.291 5.90859 18.3777 5.37812 17.3879 5.00898L16.9586 2.6875C16.9262 2.51262 16.8414 2.35172 16.7154 2.2262C16.5894 2.10068 16.4281 2.01648 16.2531 1.98477L16.1793 1.97109C14.7574 1.71406 13.259 1.71406 11.8371 1.97109L11.7633 1.98477C11.5883 2.01648 11.4271 2.10068 11.3011 2.2262C11.175 2.35172 11.0902 2.51262 11.0578 2.6875L10.6258 5.01992C9.64532 5.392 8.73195 5.92118 7.9215 6.58671L5.68478 5.79101C5.51734 5.73179 5.33585 5.72492 5.16441 5.77132C4.99298 5.81772 4.83972 5.91519 4.72501 6.05078L4.67579 6.1082C3.7305 7.2227 2.99325 8.49806 2.49923 9.87343L2.47462 9.94453C2.35158 10.2863 2.45275 10.6691 2.72892 10.907L4.53908 12.4519C4.45431 12.966 4.41329 13.491 4.41329 14.0105C4.41329 14.5355 4.45431 15.0605 4.53908 15.5691L2.73439 17.1141C2.5993 17.2297 2.50261 17.3837 2.45719 17.5557C2.41176 17.7276 2.41975 17.9093 2.48009 18.0765L2.5047 18.1476C2.99962 19.523 3.7297 20.7945 4.68126 21.9129L4.73048 21.9703C4.84547 22.1055 4.99873 22.2027 5.17007 22.2491C5.3414 22.2954 5.52276 22.2888 5.69025 22.2301L7.92697 21.4344C8.74181 22.1043 9.64962 22.6347 10.6313 23.0012L11.0633 25.3336C11.0957 25.5085 11.1805 25.6693 11.3065 25.7949C11.4325 25.9204 11.5938 26.0046 11.7688 26.0363L11.8426 26.05C13.2785 26.3084 14.7489 26.3084 16.1848 26.05L16.2586 26.0363C16.4336 26.0046 16.5948 25.9204 16.7208 25.7949C16.8468 25.6693 16.9317 25.5085 16.9641 25.3336L17.3934 23.0121C18.3832 22.6402 19.2965 22.1125 20.1168 21.4398L22.3371 22.2301C22.5046 22.2893 22.6861 22.2962 22.8575 22.2498C23.0289 22.2034 23.1822 22.1059 23.2969 21.9703L23.3461 21.9129C24.2977 20.789 25.0277 19.523 25.5227 18.1476L25.5473 18.0765C25.6649 17.7375 25.5637 17.3574 25.2875 17.1195ZM14.0137 18.5469C11.3586 18.5469 9.20665 16.3949 9.20665 13.7398C9.20665 11.0848 11.3586 8.93281 14.0137 8.93281C16.6688 8.93281 18.8207 11.0848 18.8207 13.7398C18.8207 16.3949 16.6688 18.5469 14.0137 18.5469Z" fill="white" />
                                    </g>
                                </svg>
                                Edit Profile
                            </button>
                        </section>
                        <section>
                            <button onClick={(e) => setLogoutModal(true)}>
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.3437 16.7608H18.696C18.5835 16.7608 18.4781 16.8062 18.4078 16.8863C18.2437 17.0702 18.0679 17.2476 17.8828 17.4163C17.1255 18.116 16.2285 18.6737 15.2414 19.0584C14.2187 19.4571 13.1195 19.6617 12.0093 19.6598C10.8867 19.6598 9.79918 19.4565 8.77731 19.0584C7.79019 18.6737 6.89318 18.116 6.1359 17.4163C5.37727 16.719 4.77235 15.8924 4.35466 14.9824C3.92106 14.0391 3.70309 13.0375 3.70309 12.0012C3.70309 10.9649 3.92341 9.96319 4.35466 9.01992C4.77184 8.1091 5.37184 7.28914 6.1359 6.58602C6.89996 5.88289 7.78824 5.32905 8.77731 4.94395C9.79918 4.54587 10.8867 4.34251 12.0093 4.34251C13.132 4.34251 14.2195 4.54371 15.2414 4.94395C16.2304 5.32905 17.1187 5.88289 17.8828 6.58602C18.0679 6.75693 18.2414 6.93434 18.4078 7.11607C18.4781 7.19612 18.5859 7.24155 18.696 7.24155H20.3437C20.4914 7.24155 20.5828 7.09011 20.5007 6.97544C18.7031 4.39659 15.5578 2.68962 11.9836 2.69827C6.36793 2.71126 1.8656 6.91919 1.92185 12.0964C1.9781 17.1913 6.4734 21.3041 12.0093 21.3041C15.5742 21.3041 18.7054 19.5993 20.5007 17.0269C20.5804 16.9122 20.4914 16.7608 20.3437 16.7608ZM22.4273 11.8649L19.1015 9.44179C18.9773 9.35092 18.7968 9.43314 18.7968 9.57809V11.2223H11.4375C11.3343 11.2223 11.25 11.3002 11.25 11.3954V12.6069C11.25 12.7021 11.3343 12.78 11.4375 12.78H18.7968V14.4242C18.7968 14.5692 18.9796 14.6514 19.1015 14.5605L22.4273 12.1375C22.4497 12.1213 22.4678 12.1006 22.4803 12.077C22.4927 12.0534 22.4992 12.0274 22.4992 12.0012C22.4992 11.9749 22.4927 11.949 22.4803 11.9254C22.4678 11.9017 22.4497 11.8811 22.4273 11.8649Z" fill="white" />
                                </svg>
                                Logout
                            </button>
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
                                    }}>Cancel</button>
                                </div>
                            </Modal>
                        </section>
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8">
                        {/* profiles */}
                        {context.profileView === 'aspirants' &&
                            <>
                                <div className="aspirant-header d-flex justify-content-between align-items-center">
                                    <h1 className="mb-0">Aspirant Profiles</h1>
                                    <button onClick={() => navigate("/create-aspirant")}><img src="img/edit.png" alt="create" />Create Aspirant Profile</button>
                                </div>
                                <div className="profile">
                                    {aspirants.filter((aspirant) => aspirant.creatorid === context.user._id && aspirant.status === "1").map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    }).reverse()}
                                </div>
                            </>
                        }

                        {/* stories */}
                        {context.profileView === "stories" &&
                            <>
                                <div className="story-header">
                                    <div className="row align-items-center">
                                        <div className="col-lg-3">
                                            <h1 className="mb-0">My Stories</h1>
                                        </div>
                                        <div className="col-lg-2">
                                            {/* <a href="#"><img src="img/saved-story.png" alt="saved" />Saved Stories</a> */}
                                        </div>
                                        <div className="col-lg-2">
                                            {/* <a href="#"><img src="img/saved-story.png" alt="draft" />Drafts</a> */}
                                        </div>
                                        <div className="col-lg-2">
                                            {/* <a href="#"><img src="img/sort.png" alt="sort" />Sort by</a> */}
                                        </div>
                                        <div className="col-lg-3">
                                            <button onClick={() => setWriteStoryModal(true)}><img src="img/edit.png" alt="edit" />Write New Story</button>
                                        </div>
                                    </div>
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
                                <div className="story">
                                    {stories.filter(story => story.userid === context.user._id).map((story, index) => {
                                        return (
                                            <StoryCard story={story} key={index} />
                                        )
                                    }).reverse()}
                                </div>
                            </>
                        }

                        {/* wallet */}
                        {/* {currentView === "wallet" &&
                            <div className="wallet">
                                <div className="header mb-3">
                                    <div className="row">
                                        <div className="col-lg-7">
                                            <section className="category">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'stories' && 'active'} onClick={() => setWalletView('stories')} ><img src="img/stories.png" alt="stories" />Stories</button>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'profiles' && 'active'} onClick={() => setWalletView('profiles')}><img src="img/aspirant.png" alt="aspirant" />Aspirant
                                                            Profiles</button>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <button className={walletView === 'courses' && 'active'} onClick={() => setWalletView('courses')}><img src="img/courses.png" alt="courses" />Courses</button>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-lg-1">
                                            <section className="history d-flex align-items-center justify-content-center">
                                                <button className={walletView === 'history' && 'active'} onClick={() => setWalletView('history')}>
                                                    <i className="fas fa-history"></i>
                                                </button>
                                            </section>
                                        </div>
                                        <div className="col-lg-4">
                                            <section className="withdrawl">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <p>Total Wallet Balance</p>
                                                        <h2 className="mb-0">$27,826</h2>
                                                    </div>
                                                    <div className="col-6">
                                                        <button><img src="img/withdrawl.png" alt="withdrawl" />Withdraw</button>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                {walletView === 'stories' &&
                                    <div className="stories">
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story">
                                            <div className="row align-items-center">
                                                <div className="col-lg-10">
                                                    <p className="mb-0">Osun PDP internal rift unabated as governorship primary draws closer
                                                    </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <span><img src="img/view.png" alt="views" />6,202 Views</span>
                                                    <span><img src="img/cash.png" alt="cash" />$450</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {walletView === 'profiles' &&
                                    <div className="profiles">
                                        <div className="head mb-2">
                                            <div className="row align-items-center">
                                                <div className="col-lg-4">
                                                    <h4>Aspirant’s Name</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Profile Worth</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Views</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Amount Earned</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="body">
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <h4>Ahmed Bola Tinubu</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/view.png" alt="views" />6,202 Views</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {walletView === "courses" &&
                                    <div className="profiles">
                                        <div className="head mb-2">
                                            <div className="row align-items-center">
                                                <div className="col-lg-5">
                                                    <h4>Course Title</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Course Fee</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h4>Quantity sold</h4>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Amount Earned</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="body">
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile">
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <h4>American Government and Politics</h4>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>$40</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p><img src="img/view.png" alt="views" />3</p>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <p><img src="img/cash.png" alt="amount" />$450</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {walletView === "history" &&
                                    <div className="history">
                                        <h1>Transaction History</h1>
                                        <div className="row header">
                                            <div className="col-lg-1">
                                                <p>Status</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Account Name</p>
                                            </div>
                                            <div className="col-lg-1">
                                                <p>Amount</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Bank Name</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <p>Acct Number</p>
                                            </div>
                                            <div className="col-lg-1">
                                                <p>Currency</p>
                                            </div>
                                            <div className="col-lg-3">
                                                <p>Date &amp; Time</p>
                                            </div>
                                        </div>
                                        <div className="transactions">
                                            <div className="row align-items-center">
                                                <div className=" col-lg-1">
                                                    <img src="img/trans-done.png" alt="done" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake Akintola</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-lg-1">
                                                    <img src="/img/trans1.png" alt="cancelled" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className=" col-lg-1">
                                                    <img src="img/trans-done.png" alt="done" />
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Adesina Flake Akintola</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h4>150000</h4>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>Zenith Bank</h3>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h3>0012382910</h3>
                                                </div>
                                                <div className="col-lg-1">
                                                    <h3>Naira</h3>
                                                </div>
                                                <div className="col-lg-3">
                                                    <h4>Mon Feb 14, 2022, 3:29 PM</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        } */}

                        {/* edit */}
                        {context.profileView === "edit" &&
                            <div>
                                <div className="settings mb-4">
                                    <header className="d-flex justify-content-between align-items-center">
                                        <h1 className="mb-0">Profile</h1>
                                        <i className="fas fa-angle-down" />
                                    </header>
                                    <div className="body">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label htmlFor="fname">First Name</label>
                                                <input type="text" id="fname" placeholder="First Name" value={context.user.firstname} onChange={(e) => setContext({ ...context, user: { ...context.user, firstname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="lname">Last Name</label>
                                                <input type="text" id="lname" placeholder="Last Name" value={context.user.lastname} onChange={(e) => setContext({ ...context, user: { ...context.user, lastname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Username">Username</label>
                                                <input type="text" id="Username" placeholder="Username" value={context.user.username} onChange={(e) => setContext({ ...context, user: { ...context.user, username: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Email">Email</label>
                                                <input type="text" id="Email" placeholder="Email" value={context.user.email} />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Phone">Phone Number</label>
                                                <input type="text" id="Phone" placeholder="Phone Number" value={context.user.phonenumber} onChange={(e) => setContext({ ...context, user: { ...context.user, phonenumber: e.target.value } })} />
                                            </div>
                                        </div>
                                        <p>{profileUpdateError}</p>
                                        <button onClick={(e) => handleProfileUpdate(e)}>{profileUpdateLoading ? "loading..." : "Update Changes"}</button>
                                    </div>
                                </div>
                                <div className="settings">
                                    <header className="d-flex justify-content-between align-items-center">
                                        <h1 className="mb-0">Password</h1>
                                        <i className="fas fa-angle-up" />
                                    </header>
                                    <div className="body">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label htmlFor="cpass">Current Password</label>
                                                <input type="password" id="cpass" placeholder="***************************" value={oldPasswoord} onChange={(e) => setOldPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6" />
                                            <div className="col-lg-6">
                                                <label htmlFor="new">New Password</label>
                                                <input type="password" id="new" placeholder="***************************" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6" />
                                            <div className="col-lg-6">
                                                <label htmlFor="confirm">Confirm Password</label>
                                                <input type="password" id="confirm" placeholder="***************************" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            </div>
                                            <div className="col-lg-6">
                                                <p>{passwordUpdateError}</p>
                                                <button onClick={handleUpdatePassword}>{passwordUpdateLoading ? "loading..." : "Update Password"}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile