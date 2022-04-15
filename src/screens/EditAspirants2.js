import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";

function EditAspirant2() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // add history 
    const handleAddHstory = () => {
        const newHistory = { pollTitle: "", pollYear: "", position: "", numberOfVotes: "" }
        setAspirant({ ...aspirant, polls: [...aspirant.polls, newHistory] })
    }

    // handle input 
    const handleHistoryInput = (index, e) => {
        e.preventDefault()
        setAspirant({
            ...aspirant, polls: aspirant.polls.map((each, i) => {
                if (i !== index) {
                    return each
                }
                return { ...each, [e.target.name]: e.target.value }
            })
        })
    }

    // remove history 
    const handleRemoveHistory = (index) => {
        if (aspirant.polls.length > 1) {
            setAspirant({
                ...aspirant, polls: aspirant.polls.filter((item) => item !== aspirant.polls[index])
            })
        }
    }

    // params 
    const { id } = useParams()

    const [loading, setLoading] = useState(true)

    // fetch current aspirant
    const [aspirant, setAspirant] = useState({})
    const fetchSingleAspirant = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant/getoneaspirant/${id}`)
        // console.log(response)
        setAspirant(response.data)
        setLoading(false)
    }

    useEffect(() => {
        if (id && id !== '') fetchSingleAspirant()
    }, [id])

    // updateProfile 
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState(false)
    const updateProfile = () => {
        setUpdating(true)
        setError("")
        const fd = new FormData()
        fd.append('firstname', aspirant.firstname)
        fd.append('lastname', aspirant.lastname)
        fd.append('videourl', aspirant.videourl)
        // if (aspirantImg !== null & aspirantImg !== undefined) {
        //     fd.append('image', aspirant)
        // }
        fd.append('dob', aspirant.dob)
        fd.append('pparty', aspirant.pparty)
        fd.append('overview', aspirant.overview)
        fd.append('education', aspirant.education)
        fd.append('politics', aspirant.politics)
        fd.append('binterest', aspirant.binterest)
        fd.append('activism', aspirant.activism)
        let history = JSON.stringify(aspirant.polls)
        fd.append('polls', history)
        fd.append('ownershiptype', aspirant.ownershiptype)
        fd.append('profiletransfer', aspirant.profiletransfer)
        fd.append('profilevalue', aspirant.profilevalue)

        // console.log(Array.from(fd))

        axios({
            url: `${API.API_ROOT}/aspirant/update/${aspirant._id}`,
            method: "patch",
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            setUpdating(false)
            // console.log(response)
            navigate(`/edit-aspirant/submit-profile/${id}`)
        }, (error) => {
            setUpdating(false)
            setError('Something went wrong, please try again')
            console.log(error)
        })
    }

    // history
    const navigate = useNavigate()

    return (
        <div className="container-fluid">
            <Nav />
            <div class="home-feed container">
                <div class="row">
                    {/* aside  */}
                    <div class="col-lg-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8 main">
                        {loading ? "loading" :
                            <div className="form2">
                                <div className="d-flex">
                                    <Link to={`/edit-aspirant/${aspirant._id}`}><i className="fas fa-arrow-left" /></Link>
                                    <div>
                                        <h1>Set up Aspirant Profile</h1>
                                        <p>Lorem ipsum dolor sit amet, consec</p>
                                    </div>
                                </div>
                                <div className="input">
                                    <label htmlFor="overview">Aspirant Overview</label>
                                    <textarea name id="overview" cols={30} rows={10} placeholder="Type Here" value={aspirant.overview} onChange={(e) => setAspirant({ ...aspirant, overview: e.target.value })} />
                                </div>
                                <div className="input">
                                    <label htmlFor="Education">Education</label>
                                    <textarea name id="Education" cols={30} rows={10} placeholder="Type Here" value={aspirant.education} onChange={(e) => setAspirant({ ...aspirant, education: e.target.value })} />
                                </div>
                                <div className="input">
                                    <label htmlFor="Politics">Politics</label>
                                    <textarea name id="Politics" cols={30} rows={10} placeholder="Type Here" value={aspirant.politics} onChange={(e) => setAspirant({ ...aspirant, politics: e.target.value })} />
                                </div>
                                <div className="input">
                                    <label htmlFor="interest">Business Interest</label>
                                    <textarea name id="interest" cols={30} rows={10} placeholder="Type Here" value={aspirant.binterest} onChange={(e) => setAspirant({ ...aspirant, binterest: e.target.value })} />
                                </div>
                                <div className="input">
                                    <label htmlFor="Activism">Activism</label>
                                    <textarea name id="Activism" cols={30} rows={10} placeholder="Type Here" value={aspirant.activism} onChange={(e) => setAspirant({ ...aspirant, activism: e.target.value })} />
                                </div>
                                {/* history  */}
                                <div className="history mt-5">
                                    <h2>Participating Poll History</h2>
                                    {aspirant.polls.map((each, index) => {
                                        return (
                                            <div className="row mb-3" key={index}>
                                                <div className="col-6">
                                                    <div className="input">
                                                        <label htmlFor="title">Poll Tite</label>
                                                        <input
                                                            type="text"
                                                            id="title"
                                                            placeholder="ex. 2022 Lagos Gubernatorial Poll"
                                                            name="pollTitle"
                                                            value={each.pollTitle}
                                                            onChange={(e) => handleHistoryInput(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="input d-flex justify-content-between align-items-center">
                                                        <div style={{ width: "90%" }}>
                                                            <label htmlFor="date">Election Year</label>
                                                            <input
                                                                type="number"
                                                                id="date" placeholder="YYYY"
                                                                name="pollYear"
                                                                value={each.pollYear}
                                                                onChange={(e) => handleHistoryInput(index, e)}
                                                            />
                                                        </div>
                                                        <i className="fas fa-calendar-alt" />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="input">
                                                        <label htmlFor="votes">Number of Vote</label>
                                                        <input
                                                            type="number"
                                                            id="date" placeholder="Number of Votes"
                                                            name="numberOfVotes"
                                                            value={each.numberOfVotes}
                                                            onChange={(e) => handleHistoryInput(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="input">
                                                        <label htmlFor="position">Position at the end of Poll (4th, 1st)</label>
                                                        <input
                                                            type="text"
                                                            id="date" placeholder="Position Poll"
                                                            name="position"
                                                            value={each.position}
                                                            onChange={(e) => handleHistoryInput(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-end">
                                                    <i className="fas fa-trash-alt" onClick={() => handleRemoveHistory(index)} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <button className="mb-5" id="add-history" onClick={handleAddHstory}><i className="fas fa-plus-circle" />Add More Election
                                        History</button>
                                    <div className="d-flex justify-content-between">
                                        <h6 className="mb-0">2 of 3</h6>
                                        <div>
                                            {/* <button id="draft">Save as Draft</button> */}
                                            <button id="proceed" onClick={updateProfile}>{updating ? "Loading..." : "Update Profile & Proceed"}</button>
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

export default EditAspirant2 
