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
import WriteStoryModal from '../components/writeStoryModal';
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

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
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
                        <div className="col-lg-2 col-md-2 col-sm-3 col-3">
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
                        <div className="col-lg-7 col-md-7 col-sm-5 col-9 d-flex flex-column justify-content-center">
                            <h1 className="mb-0">{context.user.firstname} {context.user.lastname}</h1>
                            <h4 className="mb-0">{context.user.username}</h4>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-4 col-12 d-flex justify-content-end align-items-start">
                            <button onClick={coverPhoto}>{coverPhotoLoader ? "loading..." : "Change Cover Picture"}</button>
                            <input type="file" accept='image/*' id='cover-pic' hidden onChange={(e) => setCoverImage(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 user-aside">
                        <section>
                            <button className={context.profileView === "aspirants" && "active"} onClick={() => setContext({ ...context, profileView: "aspirants" })} >
                                {context.darkMode ?
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="#0A183D" fillOpacity="0.5" />
                                    </svg> :
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="white" fillOpacity="0.6" />
                                    </svg>
                                }
                                Aspirant Profiles
                            </button>
                            <button className={context.profileView === "stories" && "active"} onClick={() => setContext({ ...context, profileView: "stories" })}>
                                {context.darkMode ?
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="#0A183D" fillOpacity="0.5" />
                                    </svg> :
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="white" fillOpacity="0.6" />
                                    </svg>
                                }
                                Stories
                            </button>
                            {/* <button className={currentView === "wallet" && "active"} onClick={() => setCurrentView('wallet')}><img src="img/wallet.png" alt="wallet" />My Wallet</button> */}
                            {/* <button><img src="img/courses.png" alt="courses" />My Courses</button> */}
                        </section>
                        <section>
                            {/* <button><img src="img/notification 2.png" alt="notification" />Notifications</button> */}
                            <button className={context.profileView === "edit" && "active"} onClick={() => setContext({ ...context, profileView: 'edit' })}>
                                {context.darkMode ?
                                    <svg width={24} height={26} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.0137 9.68105C11.1961 9.68105 10.4305 9.99823 9.85079 10.5779C9.27384 11.1576 8.95392 11.9232 8.95392 12.7408C8.95392 13.5584 9.27384 14.324 9.85079 14.9037C10.4305 15.4807 11.1961 15.8006 12.0137 15.8006C12.8313 15.8006 13.5969 15.4807 14.1766 14.9037C14.7535 14.324 15.0734 13.5584 15.0734 12.7408C15.0734 11.9232 14.7535 11.1576 14.1766 10.5779C13.8934 10.2926 13.5564 10.0664 13.1851 9.91243C12.8138 9.75847 12.4156 9.67982 12.0137 9.68105ZM23.2875 16.1205L21.4992 14.592C21.584 14.0725 21.6277 13.542 21.6277 13.0142C21.6277 12.4865 21.584 11.9533 21.4992 11.4365L23.2875 9.908C23.4226 9.79235 23.5193 9.63833 23.5647 9.4664C23.6101 9.29447 23.6021 9.11278 23.5418 8.9455L23.5172 8.87441C23.025 7.49817 22.2876 6.22249 21.3406 5.10918L21.2914 5.05175C21.1764 4.91655 21.0232 4.81935 20.8518 4.77298C20.6805 4.72661 20.4991 4.73323 20.3316 4.79199L18.1113 5.58222C17.291 4.90957 16.3777 4.3791 15.3879 4.00996L14.9586 1.68848C14.9262 1.51359 14.8414 1.3527 14.7154 1.22718C14.5894 1.10166 14.4281 1.01745 14.2531 0.985742L14.1793 0.97207C12.7574 0.715039 11.259 0.715039 9.83712 0.97207L9.76329 0.985742C9.58828 1.01745 9.42706 1.10166 9.30106 1.22718C9.17505 1.3527 9.09021 1.51359 9.05782 1.68848L8.62579 4.0209C7.64532 4.39298 6.73195 4.92216 5.9215 5.58769L3.68478 4.79199C3.51734 4.73277 3.33585 4.7259 3.16441 4.7723C2.99298 4.8187 2.83972 4.91617 2.72501 5.05175L2.67579 5.10918C1.7305 6.22368 0.993255 7.49904 0.499232 8.87441L0.474623 8.9455C0.351576 9.2873 0.452748 9.67011 0.72892 9.908L2.53908 11.4529C2.45431 11.967 2.41329 12.492 2.41329 13.0115C2.41329 13.5365 2.45431 14.0615 2.53908 14.5701L0.734388 16.115C0.599298 16.2307 0.502613 16.3847 0.457188 16.5566C0.411763 16.7286 0.419752 16.9102 0.480091 17.0775L0.504701 17.1486C0.999622 18.524 1.7297 19.7955 2.68126 20.9139L2.73048 20.9713C2.84547 21.1065 2.99873 21.2037 3.17007 21.25C3.3414 21.2964 3.52276 21.2898 3.69025 21.231L5.92697 20.4353C6.74181 21.1053 7.64962 21.6357 8.63126 22.0021L9.06329 24.3346C9.09568 24.5094 9.18052 24.6703 9.30653 24.7958C9.43253 24.9214 9.59375 25.0056 9.76876 25.0373L9.84259 25.051C11.2785 25.3094 12.7489 25.3094 14.1848 25.051L14.2586 25.0373C14.4336 25.0056 14.5948 24.9214 14.7208 24.7958C14.8468 24.6703 14.9317 24.5094 14.9641 24.3346L15.3934 22.0131C16.3832 21.6412 17.2965 21.1135 18.1168 20.4408L20.3371 21.231C20.5046 21.2903 20.6861 21.2971 20.8575 21.2507C21.0289 21.2043 21.1822 21.1069 21.2969 20.9713L21.3461 20.9139C22.2977 19.79 23.0277 18.524 23.5227 17.1486L23.5473 17.0775C23.6649 16.7385 23.5637 16.3584 23.2875 16.1205ZM12.0137 17.5478C9.35861 17.5478 7.20665 15.3959 7.20665 12.7408C7.20665 10.0857 9.35861 7.93378 12.0137 7.93378C14.6688 7.93378 16.8207 10.0857 16.8207 12.7408C16.8207 15.3959 14.6688 17.5478 12.0137 17.5478Z" fill="#0A183D" fillOpacity="0.6" />
                                    </svg> :
                                    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.5">
                                            <path d="M14.0137 10.6801C13.1961 10.6801 12.4305 10.9973 11.8508 11.5769C11.2738 12.1566 10.9539 12.9223 10.9539 13.7398C10.9539 14.5574 11.2738 15.323 11.8508 15.9027C12.4305 16.4797 13.1961 16.7996 14.0137 16.7996C14.8313 16.7996 15.5969 16.4797 16.1766 15.9027C16.7535 15.323 17.0734 14.5574 17.0734 13.7398C17.0734 12.9223 16.7535 12.1566 16.1766 11.5769C15.8934 11.2916 15.5564 11.0654 15.1851 10.9115C14.8138 10.7575 14.4156 10.6788 14.0137 10.6801ZM25.2875 17.1195L23.4992 15.591C23.584 15.0715 23.6277 14.541 23.6277 14.0133C23.6277 13.4855 23.584 12.9523 23.4992 12.4355L25.2875 10.907C25.4226 10.7914 25.5193 10.6373 25.5647 10.4654C25.6101 10.2935 25.6021 10.1118 25.5418 9.94453L25.5172 9.87343C25.025 8.4972 24.2876 7.22151 23.3406 6.1082L23.2914 6.05078C23.1764 5.91557 23.0232 5.81837 22.8518 5.772C22.6805 5.72563 22.4991 5.73226 22.3316 5.79101L20.1113 6.58125C19.291 5.90859 18.3777 5.37812 17.3879 5.00898L16.9586 2.6875C16.9262 2.51262 16.8414 2.35172 16.7154 2.2262C16.5894 2.10068 16.4281 2.01648 16.2531 1.98477L16.1793 1.97109C14.7574 1.71406 13.259 1.71406 11.8371 1.97109L11.7633 1.98477C11.5883 2.01648 11.4271 2.10068 11.3011 2.2262C11.175 2.35172 11.0902 2.51262 11.0578 2.6875L10.6258 5.01992C9.64532 5.392 8.73195 5.92118 7.9215 6.58671L5.68478 5.79101C5.51734 5.73179 5.33585 5.72492 5.16441 5.77132C4.99298 5.81772 4.83972 5.91519 4.72501 6.05078L4.67579 6.1082C3.7305 7.2227 2.99325 8.49806 2.49923 9.87343L2.47462 9.94453C2.35158 10.2863 2.45275 10.6691 2.72892 10.907L4.53908 12.4519C4.45431 12.966 4.41329 13.491 4.41329 14.0105C4.41329 14.5355 4.45431 15.0605 4.53908 15.5691L2.73439 17.1141C2.5993 17.2297 2.50261 17.3837 2.45719 17.5557C2.41176 17.7276 2.41975 17.9093 2.48009 18.0765L2.5047 18.1476C2.99962 19.523 3.7297 20.7945 4.68126 21.9129L4.73048 21.9703C4.84547 22.1055 4.99873 22.2027 5.17007 22.2491C5.3414 22.2954 5.52276 22.2888 5.69025 22.2301L7.92697 21.4344C8.74181 22.1043 9.64962 22.6347 10.6313 23.0012L11.0633 25.3336C11.0957 25.5085 11.1805 25.6693 11.3065 25.7949C11.4325 25.9204 11.5938 26.0046 11.7688 26.0363L11.8426 26.05C13.2785 26.3084 14.7489 26.3084 16.1848 26.05L16.2586 26.0363C16.4336 26.0046 16.5948 25.9204 16.7208 25.7949C16.8468 25.6693 16.9317 25.5085 16.9641 25.3336L17.3934 23.0121C18.3832 22.6402 19.2965 22.1125 20.1168 21.4398L22.3371 22.2301C22.5046 22.2893 22.6861 22.2962 22.8575 22.2498C23.0289 22.2034 23.1822 22.1059 23.2969 21.9703L23.3461 21.9129C24.2977 20.789 25.0277 19.523 25.5227 18.1476L25.5473 18.0765C25.6649 17.7375 25.5637 17.3574 25.2875 17.1195ZM14.0137 18.5469C11.3586 18.5469 9.20665 16.3949 9.20665 13.7398C9.20665 11.0848 11.3586 8.93281 14.0137 8.93281C16.6688 8.93281 18.8207 11.0848 18.8207 13.7398C18.8207 16.3949 16.6688 18.5469 14.0137 18.5469Z" fill="white" />
                                        </g>
                                    </svg>
                                }
                                Edit Profile
                            </button>
                        </section>
                        <section>
                            <button onClick={(e) => setLogoutModal(true)}>
                                {context.darkMode ?
                                    <svg width={22} height={20} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.3437 14.7598H17.696C17.5835 14.7598 17.4781 14.8052 17.4078 14.8853C17.2437 15.0692 17.0679 15.2466 16.8828 15.4153C16.1255 16.1151 15.2285 16.6727 14.2414 17.0574C13.2187 17.4561 12.1195 17.6607 11.0093 17.6589C9.88668 17.6589 8.79918 17.4555 7.77731 17.0574C6.79019 16.6727 5.89318 16.1151 5.1359 15.4153C4.37727 14.718 3.77235 13.8914 3.35466 12.9814C2.92106 12.0382 2.70309 11.0365 2.70309 10.0002C2.70309 8.96389 2.92341 7.96221 3.35466 7.01894C3.77184 6.10812 4.37184 5.28817 5.1359 4.58504C5.89996 3.88192 6.78824 3.32807 7.77731 2.94297C8.79918 2.5449 9.88668 2.34153 11.0093 2.34153C12.132 2.34153 13.2195 2.54273 14.2414 2.94297C15.2304 3.32807 16.1187 3.88192 16.8828 4.58504C17.0679 4.75596 17.2414 4.93336 17.4078 5.11509C17.4781 5.19514 17.5859 5.24057 17.696 5.24057H19.3437C19.4914 5.24057 19.5828 5.08913 19.5007 4.97447C17.7031 2.39562 14.5578 0.688645 10.9836 0.697298C5.36793 0.710279 0.865597 4.91822 0.921847 10.0954C0.978097 15.1903 5.4734 19.3031 11.0093 19.3031C14.5742 19.3031 17.7054 17.5983 19.5007 15.0259C19.5804 14.9113 19.4914 14.7598 19.3437 14.7598ZM21.4273 9.86389L18.1015 7.44081C17.9773 7.34995 17.7968 7.43216 17.7968 7.57711V9.22134H10.4375C10.3343 9.22134 10.25 9.29923 10.25 9.39442V10.606C10.25 10.7012 10.3343 10.779 10.4375 10.779H17.7968V12.4233C17.7968 12.5682 17.9796 12.6504 18.1015 12.5596L21.4273 10.1365C21.4497 10.1203 21.4678 10.0996 21.4803 10.076C21.4927 10.0524 21.4992 10.0265 21.4992 10.0002C21.4992 9.97392 21.4927 9.948 21.4803 9.92438C21.4678 9.90077 21.4497 9.88008 21.4273 9.86389Z" fill="#0A183D" fillOpacity="0.6" />
                                    </svg> :
                                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.3437 16.7608H18.696C18.5835 16.7608 18.4781 16.8062 18.4078 16.8863C18.2437 17.0702 18.0679 17.2476 17.8828 17.4163C17.1255 18.116 16.2285 18.6737 15.2414 19.0584C14.2187 19.4571 13.1195 19.6617 12.0093 19.6598C10.8867 19.6598 9.79918 19.4565 8.77731 19.0584C7.79019 18.6737 6.89318 18.116 6.1359 17.4163C5.37727 16.719 4.77235 15.8924 4.35466 14.9824C3.92106 14.0391 3.70309 13.0375 3.70309 12.0012C3.70309 10.9649 3.92341 9.96319 4.35466 9.01992C4.77184 8.1091 5.37184 7.28914 6.1359 6.58602C6.89996 5.88289 7.78824 5.32905 8.77731 4.94395C9.79918 4.54587 10.8867 4.34251 12.0093 4.34251C13.132 4.34251 14.2195 4.54371 15.2414 4.94395C16.2304 5.32905 17.1187 5.88289 17.8828 6.58602C18.0679 6.75693 18.2414 6.93434 18.4078 7.11607C18.4781 7.19612 18.5859 7.24155 18.696 7.24155H20.3437C20.4914 7.24155 20.5828 7.09011 20.5007 6.97544C18.7031 4.39659 15.5578 2.68962 11.9836 2.69827C6.36793 2.71126 1.8656 6.91919 1.92185 12.0964C1.9781 17.1913 6.4734 21.3041 12.0093 21.3041C15.5742 21.3041 18.7054 19.5993 20.5007 17.0269C20.5804 16.9122 20.4914 16.7608 20.3437 16.7608ZM22.4273 11.8649L19.1015 9.44179C18.9773 9.35092 18.7968 9.43314 18.7968 9.57809V11.2223H11.4375C11.3343 11.2223 11.25 11.3002 11.25 11.3954V12.6069C11.25 12.7021 11.3343 12.78 11.4375 12.78H18.7968V14.4242C18.7968 14.5692 18.9796 14.6514 19.1015 14.5605L22.4273 12.1375C22.4497 12.1213 22.4678 12.1006 22.4803 12.077C22.4927 12.0534 22.4992 12.0274 22.4992 12.0012C22.4992 11.9749 22.4927 11.949 22.4803 11.9254C22.4678 11.9017 22.4497 11.8811 22.4273 11.8649Z" fill="white" />
                                    </svg>
                                }
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
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9">
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
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className="mb-0">My Stories</h1>
                                        <button onClick={() => setWriteStoryModal(true)}><img src="img/edit.png" alt="edit" />Write New Story</button>
                                    </div>
                                </div>
                                {/* write modal  */}
                                {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
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
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <label htmlFor="fname">First Name</label>
                                                <input type="text" id="fname" placeholder="First Name" value={context.user.firstname} onChange={(e) => setContext({ ...context, user: { ...context.user, firstname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <label htmlFor="lname">Last Name</label>
                                                <input type="text" id="lname" placeholder="Last Name" value={context.user.lastname} onChange={(e) => setContext({ ...context, user: { ...context.user, lastname: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <label htmlFor="Username">Username</label>
                                                <input type="text" id="Username" placeholder="Username" value={context.user.username} onChange={(e) => setContext({ ...context, user: { ...context.user, username: e.target.value } })} />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <label htmlFor="Email">Email</label>
                                                <input type="text" id="Email" placeholder="Email" value={context.user.email} />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6">
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