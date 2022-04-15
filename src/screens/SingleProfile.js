import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Footer from "../components/footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SingleProfile() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // params 
    const { id } = useParams()

    // history
    const navigate = useNavigate()

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

    // fetch countries and fetch polls
    const [countries, setCountries] = useState([])
    const [polls, setPolls] = useState([])

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

    return (
        <div className="container-fluid">
            <Nav />
            {pageLoading ? "loading" :
                <div className="single-profile container">
                    <div className="row">
                        {/* aside  */}
                        <div className="col-lg-3 aside">
                            {/* return btn  */}
                            <div className="return mb-3">
                                <Link to={"/profiles"}><i className="fas fa-arrow-left" /><span>Back</span></Link>
                            </div>
                            {/* profile-img  */}
                            <img src={aspirant.image === null || aspirant.image == undefined ? `img/user (1) 1.png` : `https://polvote.com/ballot/${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
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
                                            <button onClick={removeAspirant}>Remove from Poll</button>
                                        }
                                    </>
                                }
                                {aspirant.pollsdetails.length > 0 &&
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="/img/Group 516.png" alt="" />
                                        <p className="mb-0">Tap to Vote on BallotBox</p>
                                    </div>
                                }
                                <div className="d-flex align-items-start">
                                    <i className="fas fa-exclamation-triangle" />
                                    <h6 className="mb-0">Votes made on BallotBox are only limited to BallotBox and does not count
                                        for the
                                        National Election!</h6>
                                </div>
                            </div>
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
                        {/* gutter  */}
                        <div className="col-lg-1" />
                        {/* main  */}
                        <div className="col-lg-8 main">
                            <div className="d-flex justify-content-end">
                                <div className="searchbar d-flex align-items-center">
                                    <input type="text" placeholder="Search for Profile Name" />
                                    <img src="/img/search-normal.png" alt="search" />
                                </div>
                            </div>
                            <iframe width="100%" height={435} src={aspirant.videourl.includes("watch") ? `https://www.youtube.com/embed/${aspirant.videourl.substring(32, 43)}` : `https://www.youtube.com/embed/${aspirant.videourl.substring(17, 28)}`} className="mb-4" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                            </iframe>
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <h2 className="mb-0">{aspirant.firstname} {aspirant.lastname}</h2>
                                {aspirant.creatorid === context.user._id ?
                                    <button id="edit" onClick={() => navigate(`/edit-aspirant/${id}`)}>Edit Profile</button>
                                    :
                                    <button id="manage-profile">Request to Manage Profile</button>
                                }
                            </div>
                            <div className="info">
                                <h3>Overview</h3>
                                <p>{aspirant.overview}</p>
                                <h3>Education</h3>
                                <p>{aspirant.education}.</p>
                                <h3>Politics</h3>
                                <p>{aspirant.politics}</p>
                                <h3>Business Interest</h3>
                                <p>{aspirant.binterest}</p>
                                <h3>Activism</h3>
                                <p>{aspirant.activism}</p>
                            </div>
                            <div className="others">
                                <h2>See other profile</h2>
                                <div className="profile">
                                    <div className="row">
                                        <div className="col-lg-1">
                                            <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="profile-img" id="profile-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-11">
                                            <h3>Ahmed Bola Tinubu</h3>
                                            <div className="row justify-content-between mb-4">
                                                <div className="col-8">
                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                        Nullam vitae
                                                        dignissim leo dis viverra scelerisque volutpat
                                                        quam. Ornare tellus, egestas amet posuere at est tellus, auctor.
                                                        Lobortis ante cursus enim, neque ipsum.</p>
                                                </div>
                                                <div className="col-1 d-flex align-items-end">
                                                    <img src="/img/Group 516.png" alt="vote" />
                                                </div>
                                            </div>
                                            <footer>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-4">
                                                        <h4 className="mb-0">Born: 14th March 1903</h4>
                                                    </div>
                                                    <div className="col-lg-4 d-flex justify-content-center">
                                                        <h4 className="mb-0">Party: Alliance for Justice</h4>
                                                    </div>
                                                    <div className="col-lg-4 d-flex justify-content-end">
                                                        <p className="mb-0">Ifedore Constituency Poll</p>
                                                    </div>
                                                </div>
                                            </footer>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile">
                                    <div className="row">
                                        <div className="col-lg-1">
                                            <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="profile-img" id="profile-img" className="img-fluid" />
                                        </div>
                                        <div className="col-lg-11">
                                            <h3>Ahmed Bola Tinubu</h3>
                                            <div className="row justify-content-between mb-4">
                                                <div className="col-8">
                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                        Nullam vitae
                                                        dignissim leo dis viverra scelerisque volutpat
                                                        quam. Ornare tellus, egestas amet posuere at est tellus, auctor.
                                                        Lobortis ante cursus enim, neque ipsum.</p>
                                                </div>
                                                <div className="col-1 d-flex align-items-end">
                                                    <img src="/img/Group 516.png" alt="vote" />
                                                </div>
                                            </div>
                                            <footer>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-4">
                                                        <h4 className="mb-0">Born: 14th March 1903</h4>
                                                    </div>
                                                    <div className="col-lg-4 d-flex justify-content-center">
                                                        <h4 className="mb-0">Party: Alliance for Justice</h4>
                                                    </div>
                                                    <div className="col-lg-4 d-flex justify-content-end">
                                                        <p className="mb-0">Ifedore Constituency Poll</p>
                                                    </div>
                                                </div>
                                            </footer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* footer  */}
                            <Footer />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default SingleProfile