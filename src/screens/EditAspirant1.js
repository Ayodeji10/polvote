import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useNavigate, useParams, Link } from "react-router-dom";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { DataContext } from "../dataContext";
import Loader from '../components/loader';

function EditAspirant1() {
    // context 
    const { context } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    // parties 
    const [parties, setParties] = useState([])
    const fetchParties = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/parties/parties`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setParties(response.data)
    }
    useEffect(() => {
        fetchParties()
    }, [])

    // params 
    const { id } = useParams()

    // loading 
    const [loading, setLoading] = useState(true)

    // fetch current aspirant
    const [aspirant, setAspirant] = useState({})
    const [aspirantImg, setAspirantImg] = useState(null)
    const fetchSingleAspirant = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant/getoneaspirant/${id}`)
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
        if (aspirantImg !== null & aspirantImg !== undefined) {
            fd.append('image', aspirantImg)
        }
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
            navigate(`/edit-aspirant/setup-aspirant/${id}`)
        }, (error) => {
            setUpdating(false)
            setError('Something went wrong, please try again')
            console.log(error)
        })
    }

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
                        {loading ?
                            <Loader pageLoading={loading} />
                            :
                            <div className="form">
                                <div className="row">
                                    <div className="col-1">
                                        <Link to={"/user-profile"}><i class="fa-solid fa-arrow-left-long"></i></Link>
                                    </div>
                                    <div className="col-11">
                                        <h1>Edit Aspirant Profile</h1>
                                        <p>Lorem ipsum dolor sit amet, consec</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="input">
                                            <label htmlFor="fname">First Name</label>
                                            <input type="text" id="fname" placeholder="Aspirant’s First Name" value={aspirant.firstname} onChange={(e) => setAspirant({ ...aspirant, firstname: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">
                                        <div className="input">
                                            <label htmlFor="lname">Last Name</label>
                                            <input type="text" id="lname" placeholder="Aspirant’s Last Name" value={aspirant.lastname} onChange={(e) => setAspirant({ ...aspirant, lastname: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input">
                                            <label htmlFor="video">Attach a youtube link (optional)</label>
                                            <input type="text" id="video" placeholder="Profile / Manifesto Video" value={aspirant.videourl} onChange={(e) => setAspirant({ ...aspirant, videourl: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">
                                        <div className="input d-flex justify-content-between align-items-center">
                                            <div className="img-container d-flex align-items-center">
                                                <img src={aspirant.image === undefined ? "/img/user (1) 1.png" : `https://polvote.com/ballot/${aspirant.image}`} className="profile-img" alt="profile-img" />
                                            </div>
                                            <input type="file" accept='image/*' onChange={(e) => setAspirantImg(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input d-flex justify-content-between align-items-center">
                                            <div>
                                                <label htmlFor="bday">Date of Birth</label>
                                                <DatePicker
                                                    selected={new Date(aspirant.dob)}
                                                    onChange={(date) => setAspirant({ ...aspirant, dob: date })}
                                                    // onChange={(date) => setContext({ ...context, editAspirant: { ...context.editAspirant, dob: date } })}
                                                    placeholderText='DD / MM / YYYY'
                                                    dateFormat='dd/MM/yyyy'
                                                    maxDate={new Date()}
                                                    showYearDropdown
                                                    // scrollableYearDropdown
                                                    scrollableMonthYearDropdown
                                                />
                                            </div>
                                            <i className="fas fa-calendar-alt" />
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">
                                        <div className="input">
                                            <label htmlFor="paty">Political Party</label>
                                            <select name="category" id="category" onChange={(e) => setAspirant({ ...aspirant, pparty: e.target.value })} >
                                                <option value="">-- select  Party --</option>
                                                {parties.map((party) => {
                                                    return <option value={party.partyname} selected={party.partyname === aspirant.pparty} key={party._id}>{party.partyname}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-5 align-items-center">
                                    <h6 className="mb-0">1 of 3</h6>
                                    <div>
                                        <p>{error}</p>
                                        {/* <button id="draft">Save as Draft</button> */}
                                        <button id="proceed" onClick={updateProfile}>{updating ? "Loading..." : "Update Profile & Proceed"}</button>
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

export default EditAspirant1