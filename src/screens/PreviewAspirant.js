import React, { useEffect, useContext, useState } from 'react'
import Nav from '../components/nav'
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";

function PreviewAspirant() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // navigate 
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    const [previewImg, setPreviewImg] = useState(null)

    // fetch intending poll 
    const [poll, setPoll] = useState({})
    const [pageLoading, setPageLoading] = useState(true)
    const [pollTItle, setPollTitle] = useState("")
    const fetchPoll = async () => {
        if (context.newAspirant.pollid === null) {
            setPollTitle("No Poll")
            setPageLoading(false)
        } else {
            const response = await axios
                .get(`${API.API_ROOT}/polls/getsinglepoll/${context.newAspirant.pollid}`)
                .catch((error) => [
                    console.log('Err', error)
                ]);
            // console.log(`${API.API_ROOT}/polls/getsinglepoll/${context.newAspirant.pollid}`)
            // console.log(response.data)
            // setPoll(response.data)
            setPollTitle(response.data.polltitle)
            setPageLoading(false)
        }
    }

    useEffect(() => {
        fetchPoll()
    }, [])

    // submit profile 
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const submitProfile = () => {
        setLoading(true);
        setError("")
        const fd = new FormData()
        fd.append('firstname', context.newAspirant.firstName)
        fd.append('lastname', context.newAspirant.lastName)
        fd.append('videourl', context.newAspirant.link)
        fd.append('image', context.newAspirant.profileImg)
        fd.append('dob', context.newAspirant.DOB)
        fd.append('pparty', context.newAspirant.party)
        fd.append('overview', context.newAspirant.overview)
        fd.append('education', context.newAspirant.education)
        fd.append('politics', context.newAspirant.politics)
        fd.append('binterest', context.newAspirant.business)
        fd.append('activism', context.newAspirant.activism)
        let history = JSON.stringify(context.newAspirant.history)
        fd.append('polls', history)
        fd.append('ownershiptype', context.newAspirant.ownership)
        fd.append('profiletransfer', context.newAspirant.transfer)
        fd.append('profilevalue', context.newAspirant.amount)
        fd.append('pollid', context.newAspirant.pollid)
        // console.log(Array.from(fd))
        axios({
            url: `${API.API_ROOT}/aspirant/register`,
            method: "POST",
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            setLoading(false)
            console.log(response)
            setContext({
                ...context, newAspirant: { firstName: "", lastName: "", link: "", profileImg: null, DOB: "", party: "", overview: "", education: "", politics: "", business: "", activism: "", history: [{ pollTitle: "", pollYear: "", position: "", numberOfVotes: "" }], ownership: "Writer", transfer: "No", amount: "", pollid: null }
            })
            localStorage.removeItem('profileImg')
            navigate('/profiles')
        }, (error) => {
            console.log(error)
            setLoading(false)
            setError('Something went wrong, please try again')
        })
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="single-profile container home-feed">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        {/* return btn  */}
                        <div className="return mb-3">
                            <Link to={"/create-aspirant/submit-profile"}><i className="fas fa-arrow-left" /><span>Back</span></Link>
                        </div>
                        {/* profile-img  */}
                        {localStorage.getItem("profileImg") ?
                            <img src={localStorage.getItem("profileImg")} className="img-fluid" alt="profile-img" id="profile-img" /> :
                            <img src="/img/persona.png" alt="profile-img" id="profile-img" />
                        }
                        {/* active poll  */}
                        <div className="poll-active">
                            <h3>Active Participating Poll</h3>
                            {pageLoading ? 'loading...' : <p className="mb-0">{pollTItle}</p>}
                        </div>
                        {/* history  */}
                        <div className="history">
                            <h2>Participating Poll History</h2>
                            {context.newAspirant.history.map((each) => {
                                return (
                                    <div className="poll">
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
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        <iframe width="100%" height={435} src={context.newAspirant.link.includes("watch") ? `https://www.youtube.com/embed/${context.newAspirant.link.substring(32, 43)}` : `https://www.youtube.com/embed/${context.newAspirant.link.substring(17, 28)}`} className="mb-4" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                        </iframe>
                        <h2 className="mb-5">{context.newAspirant.firstName} {context.newAspirant.lastName}</h2>
                        <div className="info">
                            <h3>Overview</h3>
                            <p>{context.newAspirant.overview}</p>
                            <h3>Education</h3>
                            <p>{context.newAspirant.education}</p>
                            <h3>Politics</h3>
                            <p>{context.newAspirant.politics}</p>
                            <h3>Business Interest</h3>
                            <p>{context.newAspirant.business}</p>
                            <h3>Activism</h3>
                            <p>{context.newAspirant.activism}</p>
                        </div>
                        <p>{error}</p>
                        <div className="d-flex justify-content-end">
                            <Link to={'/create-aspirant/submit-profile'}><button id="back">Back</button></Link>
                            <button id="proceed" onClick={submitProfile}>{loading ? "Loading..." : "Proceed to Submit"}</button>
                        </div>

                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewAspirant