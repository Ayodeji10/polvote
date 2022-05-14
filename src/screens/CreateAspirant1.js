import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { DataContext } from "../dataContext";

function CreateAspirant1() {
    // context 
    const { context, setContext } = useContext(DataContext)

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

    // history
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    const [error, setError] = useState("")
    const createAspirant2 = (e) => {
        e.preventDefault()
        setError("")
        if (context.newAspirant.firstName === "" || context.newAspirant.lastName === "" || context.newAspirant.link === "" || context.newAspirant.DOB === "" || context.newAspirant.party === "") {
            setError("Please fill all Input Fields")
        } else {
            navigate('/create-aspirant/setup-aspirant')
        }
    }

    // image previewer 
    const handleImagePreview = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files.length > 0) {
            setContext({ ...context, newAspirant: { ...context.newAspirant, profileImg: e.target.files[0] } });
            localStorage.setItem('profileImg', URL.createObjectURL(e.target.files[0]))
        }
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-md-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        <div className="form">
                            <h1>Create an Aspirant Profile</h1>
                            <p>Please fill all input fields</p>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <div className="input">
                                        <label htmlFor="fname">First Name</label>
                                        <input type="text" id="fname" placeholder="Aspirant’s First Name" value={context.newAspirant.firstName} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, firstName: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6 d-flex justify-content-end">
                                    <div className="input">
                                        <label htmlFor="lname">Last Name</label>
                                        <input type="text" id="lname" placeholder="Aspirant’s Last Name" value={context.newAspirant.lastName} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, lastName: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <div className="input">
                                        <label htmlFor="video">Attach a youtube link (optional)</label>
                                        <input type="text" id="video" placeholder="Profile / Manifesto Video" value={context.newAspirant.link} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, link: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6 d-flex justify-content-end">
                                    <div className="input d-flex justify-content-between align-items-center">
                                        <div className="img-container d-flex align-items-center">
                                            {localStorage.getItem("profileImg") ?
                                                <img src={localStorage.getItem("profileImg")} className="profile-img" alt="profile-img" /> :
                                                <img src="/img/user (1) 1.png" className="profile-img" alt="profile-img" />
                                            }
                                        </div>
                                        <input type="file" accept='image/*' onChange={(e) => handleImagePreview(e)} />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <div className="input d-flex justify-content-between align-items-center">
                                        <div>
                                            <label htmlFor="date">Date of Birth</label>
                                            {/* <DatePicker
                                                selected={context.newAspirant.DOB}
                                                onChange={(date) => setContext({ ...context, newAspirant: { ...context.newAspirant, DOB: date } })}
                                                placeholderText='DD / MM / YYYY'
                                                dateFormat='dd/MM/yyyy'
                                                maxDate={new Date()}
                                                showYearDropdown
                                                // scrollableYearDropdown
                                                scrollableMonthYearDropdown
                                            /> */}
                                            <input type="date" name="date" id="date" onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, DOB: e.target.value } })} />
                                        </div>
                                        {/* <i className="fas fa-calendar-alt" /> */}
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6 d-flex justify-content-end">
                                    <div className="input">
                                        <label htmlFor="paty">Political Party</label>
                                        <select name="category" id="category" onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, party: e.target.value } })}>
                                            <option value="">-- select  Party --</option>
                                            {parties.map((party) => {
                                                return <option value={party.partyname} key={party._id}>{party.partyname}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-lg-5 mt-md-3 mt-sm-1 mt-1 align-items-center">
                                <h6 className="mb-0">1 of 3</h6>
                                <div>
                                    <p>{error}</p>
                                    <button id="draft">Save as Draft</button>
                                    <button id="proceed" onClick={(e) => createAspirant2(e)}>Continue</button>
                                </div>
                            </div>
                        </div>

                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAspirant1