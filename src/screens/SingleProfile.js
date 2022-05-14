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

    const handleSShareProfieMOdal = (variable) => {
        setShareModal(variable)
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
                                                <div className="d-flex align-items-center mb-3" onClick={() => navigate(`/polls/${aspirant.pollsdetails[0].pollid}`)} style={{ cursor: "pointer" }} >
                                                    <img src="/img/Group 516.png" alt="vote" />
                                                    <p className="mb-0">Tap to Vote on Polvote</p>
                                                </div>
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