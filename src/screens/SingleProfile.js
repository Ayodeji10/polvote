import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Footer from "../components/footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import Loader from '../components/loader';
import Modal from 'react-modal'
import SingleProfileCard from '../components/singleProfileCard';
import ShareProfileModal from '../components/shareProfileModal';
import RedirectToPoll from '../components/redirectToPollModal';
import NewAspirantLineText from '../components/newAspirantLineText';
Modal.setAppElement('#root')

function SingleProfile() {
    // context 
    const { context } = useContext(DataContext)

    // params 
    const { id } = useParams()

    // history
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    // increase views
    useEffect(() => {
        if (id && id !== '') {
            axios({
                url: `${API.API_ROOT}/aspirant/aspirantviews/${id}`,
                method: "patch",
                headers: { 'Authorization': `Bearer ${context.user.token}` },
            }).then((response) => {
                console.log(response)
            }, (error) => {
                // console.log(error)
            })
        }
    }, [id])

    // fetch current aspirant
    const [pageLoading, setPageLoading] = useState(true)
    const [aspirant, setAspirant] = useState({})
    const fetchSingleAspirant = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant/getoneaspirant/${id}`)
        setAspirant(response.data)
        setPageLoading(false)
    }
    useEffect(() => {
        if (id && id !== '') fetchSingleAspirant()
    }, [id])

    // modal 
    const [addToPollModal, setAddToPollModal] = useState(false)

    // fetch countries, polls and random aspirants
    const [countries, setCountries] = useState([])
    const [polls, setPolls] = useState([])
    const [randomAspirants, setRandomAspirant] = useState([])

    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // get random aspirants 
        const filtered = response.data.filter(aspirant => aspirant._id !== id && aspirant.status == 1)
        let n = 2;
        var shuffled = filtered.sort(function () { return .5 - Math.random() });
        setRandomAspirant(shuffled.slice(0, n))
    }

    const fetchCountries = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/countries/countries`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setCountries(response.data)
    }

    const fetchPolls = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/polls`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setPolls(response.data)
    }

    useEffect(() => {
        fetchCountries()
        fetchPolls()
        fetchAspirants()
    }, [])

    const [countrySelected, setCountrySelected] = useState("")
    const [categorySelected, setCategorySelected] = useState("")
    const [pollId, setPollId] = useState("")

    // loading and error 
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // add to poll 
    const addToPoll = () => {
        setLoading(true)
        setError("")
        console.log(pollId)
        axios({
            url: `${API.API_ROOT}/polls/addtopoll/${pollId}`,
            method: "patch",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${context.user.token}` },
            data: { aspiid: id }
        }).then((response) => {
            setLoading(false)
            // console.log(response)
            window.location.reload()
        }, (error) => {
            setLoading(false)
            setError('Something went wrong, please try again')
            // console.log(error)
        })
    }

    // remove from poll 
    const removeAspirant = () => {
        console.log("loading...")
        axios({
            url: `${API.API_ROOT}/polls/deletepollaspirant/${aspirant.pollsdetails[0].pollid}`,
            method: "patch",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${context.user.token}` },
            data: { aspiid: id }
        }).then((response) => {
            setLoading(false)
            console.log(response)
            // window.location.reload()
        }, (error) => {
            setLoading(false)
            setError('Something went wrong, please try again')
            console.log(error)
        })
    }

    // modals 
    const [shareModal, setShareModal] = useState(false)
    const [redirectToPollModal, setRedirectToPollModal] = useState(false)

    const handleSShareProfieMOdal = (variable) => {
        setShareModal(variable)
    }

    const handleRedirect = (variable) => {
        setRedirectToPollModal(variable)
    }

    const [shareLink] = useState(`https://polvote.com/profiles/single/${id}`)

    const [searchParam, setSearchParam] = useState("")

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed">
                {pageLoading ?
                    <Loader pageLoading={pageLoading} />
                    :
                    <div className="single-profile container">
                        <div className="row justify-content-lg-between">
                            {/* aside  */}
                            <div className="col-lg-3 col-md-3 aside">
                                {/* return btn  */}
                                <div className="return mb-3">
                                    <Link to={"/profiles"}><i className="fas fa-arrow-left" /><span>Back</span></Link>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-6 col-6">
                                        {/* profile-img  */}
                                        <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-6 col-12">
                                        {/* active poll  */}
                                        <div className="poll-active">
                                            <h3>Active Participating Poll</h3>
                                            {aspirant.pollsdetails.length < 1 ?
                                                <div className='d-flex align-items-center mb-3'>
                                                    <span>No Active Poll</span>
                                                    {aspirant.creatorid === context.user._id &&
                                                        <>
                                                            <i className="fa-solid fa-circle"></i>
                                                            <button onClick={() => setAddToPollModal(true)}>Add to Poll</button>
                                                        </>
                                                    }
                                                    {/* add to poll modal  */}
                                                    <Modal isOpen={addToPollModal} onRequestClose={() => setAddToPollModal(false)} id="addToPoll">
                                                        <i className="fa-solid fa-circle-xmark" onClick={() => setAddToPollModal(false)} />
                                                        <h1>Add Profile to an ongoing Poll</h1>
                                                        {/* country  */}
                                                        <div className="input">
                                                            <label htmlFor="category">Choose Country</label>
                                                            <select name="category" id="country" value={countrySelected} onChange={(e) => setCountrySelected(e.target.value)} >
                                                                <option value="">-- Select Country --</option>
                                                                {countries.map((each, index) => {
                                                                    return (
                                                                        <option value={each.country} selected={countrySelected === each.country} key={index}>{each.country}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </div>
                                                        {/* category  */}
                                                        <div className="input">
                                                            <label htmlFor="category">Poll Category</label>
                                                            <select name="category" id="category" value={categorySelected} onChange={(e) => setCategorySelected(e.target.value)} >
                                                                <option value="">-- Select Category --</option>
                                                                {countries.map((country) => {
                                                                    if (country.country === countrySelected) {
                                                                        return country.category.map((cat, index) => {
                                                                            return (
                                                                                <option value={cat.category} key={index}>{cat.category}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                })}
                                                            </select>
                                                        </div>
                                                        {/* poll  */}
                                                        <div className="input">
                                                            <label htmlFor="poll">Ongoing Poll</label>
                                                            <select name="cars" id="poll" onChange={(e) => setPollId(e.target.value)} >
                                                                <option value={null}>-- Select Category --</option>
                                                                {polls.filter((poll) => poll.category === categorySelected).map(poll => {
                                                                    return <option value={poll._id} key={poll._id}>{poll.polltitle}</option>
                                                                })}
                                                            </select>
                                                        </div>
                                                        <p>{error}</p>
                                                        <button onClick={() => addToPoll()}>{loading ? "loading..." : "Proceed"}</button>
                                                    </Modal>
                                                </div> :
                                                <>
                                                    <p>{aspirant.pollsdetails[0].polltitle}</p>
                                                    {aspirant.creatorid === context.user._id &&
                                                        <button className='mb-3' onClick={removeAspirant}>Remove from Poll</button>
                                                    }
                                                </>
                                            }
                                            {aspirant.pollsdetails.length > 0 &&
                                                <>
                                                    <div className="d-flex align-items-center mb-3" onClick={() => setRedirectToPollModal(true)} style={{ cursor: "pointer" }} >
                                                        <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" title='Vote' onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRedirectToPollModal(true)
                                                        }} >
                                                            <circle cx={20} cy={20} r={20} fill="#007AF3" />
                                                            <g clipPath="url(#clip0_2_4708)">
                                                                <path d="M28.7719 23.4529C29.1653 22.951 29.354 22.413 29.33 21.8589C29.3059 21.2486 29.0328 20.7708 28.808 20.4777C29.069 19.8273 29.1693 18.8034 28.2981 18.0084C27.6597 17.4263 26.5756 17.1653 25.074 17.2375C24.018 17.2857 23.1347 17.4825 23.0986 17.4905H23.0946C22.8938 17.5266 22.681 17.5708 22.4642 17.619C22.4481 17.362 22.4923 16.7236 22.9661 15.2862C23.5282 13.5758 23.4961 12.2669 22.8617 11.3916C22.1952 10.4722 21.1312 10.3999 20.818 10.3999C20.5169 10.3999 20.2399 10.5244 20.0431 10.7532C19.5975 11.2712 19.6496 12.2268 19.7059 12.6684C19.1759 14.0897 17.6903 17.5748 16.4336 18.5424C16.4095 18.5585 16.3894 18.5786 16.3693 18.5986C16 18.9881 15.751 19.4097 15.5824 19.7791C15.3455 19.6506 15.0765 19.5783 14.7874 19.5783H12.3382C11.4148 19.5783 10.668 20.3291 10.668 21.2486V27.7731C10.668 28.6965 11.4188 29.4433 12.3382 29.4433H14.7874C15.1448 29.4433 15.478 29.3309 15.751 29.1382L16.6946 29.2506C16.8391 29.2707 19.4087 29.5959 22.0466 29.5437C22.5244 29.5798 22.9741 29.5999 23.3917 29.5999C24.1104 29.5999 24.7367 29.5437 25.2587 29.4313C26.4873 29.1703 27.3264 28.6483 27.752 27.8815C28.0773 27.2953 28.0773 26.7131 28.0251 26.3437C28.8241 25.621 28.9646 24.822 28.9365 24.2599C28.9204 23.9347 28.8481 23.6576 28.7719 23.4529ZM12.3382 28.3592C12.013 28.3592 11.752 28.0943 11.752 27.7731V21.2446C11.752 20.9194 12.017 20.6584 12.3382 20.6584H14.7874C15.1126 20.6584 15.3736 20.9234 15.3736 21.2446V27.769C15.3736 28.0943 15.1086 28.3552 14.7874 28.3552H12.3382V28.3592ZM27.744 22.9831C27.5754 23.1598 27.5432 23.4288 27.6717 23.6375C27.6717 23.6416 27.8363 23.9226 27.8564 24.3081C27.8845 24.834 27.6316 25.2998 27.1016 25.6973C26.9129 25.8418 26.8366 26.0907 26.9169 26.3156C26.9169 26.3196 27.0895 26.8496 26.8085 27.3515C26.5395 27.8333 25.9412 28.1786 25.0338 28.3713C24.3071 28.5279 23.3194 28.556 22.1069 28.4596C22.0908 28.4596 22.0707 28.4596 22.0507 28.4596C19.469 28.5158 16.8592 28.1786 16.8311 28.1746H16.8271L16.4215 28.1264C16.4456 28.014 16.4577 27.8935 16.4577 27.7731V21.2446C16.4577 21.0719 16.4296 20.9033 16.3814 20.7467C16.4537 20.4777 16.6544 19.8794 17.1282 19.3695C18.931 17.9402 20.6936 13.1181 20.7698 12.9093C20.802 12.825 20.81 12.7327 20.7939 12.6403C20.7257 12.1906 20.7498 11.6406 20.8461 11.4759C21.0589 11.48 21.6331 11.5402 21.9784 12.018C22.3879 12.5841 22.3719 13.5959 21.9302 14.9369C21.2557 16.9806 21.1995 18.0566 21.7335 18.5304C21.9985 18.7673 22.3518 18.7793 22.6087 18.687C22.8537 18.6308 23.0865 18.5826 23.3074 18.5465C23.3234 18.5424 23.3435 18.5384 23.3596 18.5344C24.5922 18.2654 26.8005 18.1008 27.5673 18.7994C28.2178 19.3936 27.756 20.1806 27.7039 20.2649C27.5553 20.4897 27.5995 20.7828 27.8002 20.9635C27.8042 20.9675 28.2258 21.365 28.2459 21.899C28.2619 22.2564 28.0933 22.6217 27.744 22.9831Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_2_4708">
                                                                    <rect width="19.2" height="19.2" fill="white" transform="translate(10.4004 10.3999)" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        {/* <img src="/img/Group 516.svg" alt="vote" /> */}
                                                        <p className="mb-0">Tap to Vote on Polvote</p>
                                                    </div>
                                                    {redirectToPollModal && <RedirectToPoll isOpen={redirectToPollModal} handleRedirect={handleRedirect} name={`${aspirant.firstname} ${aspirant.lastname}`} pollId={aspirant.pollsdetails[0].pollid} />}
                                                </>
                                            }
                                            <div className="d-flex align-items-start">
                                                <i className="fas fa-exclamation-triangle" />
                                                <h6 className="mb-0">Votes made on Polvote are only limited to Polvote and does not count
                                                    for the
                                                    National Election!</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                        {/* history  */}
                                        <div className="history">
                                            <h2>Participating Poll History</h2>
                                            {aspirant.polls.map((each) => {
                                                return (
                                                    <div className="poll" key={each._id}>
                                                        <h3>{each.pollYear}</h3>
                                                        <p>{each.pollTitle}</p>
                                                        <p>{each.numberOfVotes} Votes</p>
                                                        <p>{each.position} Position</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* gutter  */}
                            {/* <div className="col-lg-1" /> */}
                            {/* main  */}
                            <div className="col-lg-8 col-md-9 main">
                                <div className="d-flex justify-content-end">
                                    <div className="searchbar d-flex align-items-center">
                                        <input type="text" placeholder="Search for Profile Name" value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
                                        <img src="/img/search-normal.png" alt="search" onClick={() => {
                                            if (searchParam !== "") {
                                                navigate(`/search=${searchParam}`)
                                            }
                                        }} />
                                    </div>
                                </div>
                                <iframe width="100%" height={435} src={aspirant.videourl.includes("watch") ? `https://www.youtube.com/embed/${aspirant.videourl.substring(32, 43)}` : `https://www.youtube.com/embed/${aspirant.videourl.substring(17, 28)}`} className="mb-4" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                                </iframe>
                                <div className="d-flex justify-content-between align-items-center mb-5">
                                    <h2 className="mb-0">{aspirant.firstname} {aspirant.lastname}</h2>
                                    {aspirant.creatorid === context.user._id ?
                                        <div className='d-flex align-items-center'>
                                            {/* <i onClick={() => setShareModal(true)} class="fa-solid fa-share-nodes"></i> */}
                                            <button id="edit" onClick={() => navigate(`/edit-aspirant/${id}`)}>Edit Profile</button>
                                        </div>
                                        :
                                        <>
                                            {aspirant.pollsdetails.length > 0 &&
                                                <div className='d-flex align-items-center'>
                                                    <i onClick={() => setShareModal(true)} class="fa-solid fa-share-nodes"></i>
                                                    {/* share modal  */}
                                                    {shareModal && <ShareProfileModal shareProfileModal={shareModal} shareLink={shareLink} handleShareProfileModal={handleSShareProfieMOdal} />}
                                                    <button id="manage-profile" onClick={() => navigate(`/polls/${aspirant.pollsdetails[0].pollid}`)}><i class="fa-solid fa-thumbs-up"></i>Vote</button>
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                                <div className="info">
                                    <h3>Overview</h3>
                                    <NewAspirantLineText text={aspirant.overview} />
                                    <h3>Educational Background</h3>
                                    <NewAspirantLineText text={aspirant.education} />
                                    <h3>Political Career</h3>
                                    <NewAspirantLineText text={aspirant.politics} />
                                    <h3>Professional Career/Business Interests</h3>
                                    <NewAspirantLineText text={aspirant.binterest} />
                                    <h3>Awards</h3>
                                    <NewAspirantLineText text={aspirant.activism} />
                                </div>
                                <div className="others">
                                    <h2>See other profiles</h2>
                                    <div className="profile">
                                        {randomAspirants.map((aspirant, index) => {
                                            return (
                                                <SingleProfileCard aspirant={aspirant} key={index} handleSShareProfieMOdal={handleSShareProfieMOdal} />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3" />
                        <div className="col-lg-9">
                            {/* footer  */}
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProfile