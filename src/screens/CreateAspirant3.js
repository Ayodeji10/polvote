import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";

function CreateAspirant3() {
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

    // ongoing poll 
    const [addToPoll, setAddToPoll] = useState(true)

    const setNoPoll = () => {
        setAddToPoll(false)
        setContext({ ...context, newAspirant: { ...context.newAspirant, pollid: null } })
    }

    const [error, setError] = useState("")
    const preview = () => {
        setError("")
        // if (context.newAspirant.transfer === "Yes" && context.newAspirant.education === "") {
        //     setError("Please specify amount")
        // } else {
        //     navigate('/create-aspirant/preview')
        // }
        if (addToPoll === true && context.newAspirant.pollid === null) {
            setError("Please Specify your Poll of choice")
        } else {
            navigate('/create-aspirant/preview')
        }
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div class="home-feed container">
                <div class="row justify-content-lg-between">
                    {/* aside  */}
                    <div class="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        <div className="submit-profile">
                            <div className="d-flex">
                                <Link to={"/create-aspirant/setup-aspirant"}><i className="fas fa-arrow-left" /></Link>
                                <div>
                                    <h1>Proceed to Submit Profile for {context.newAspirant.firstName} {context.newAspirant.lastName}</h1>
                                </div>
                            </div>
                            <div className="poll">
                                <div className="row">
                                    <div className="col-lg-7 col-md-7 col-sm-7 col-12">
                                        <div className="d-flex align-items-center mb-3">
                                            <input type="radio" id="add" checked={addToPoll} />
                                            <label htmlFor="add" onClick={() => setAddToPoll(true)}>Add profile to an ongoing poll</label>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <input type="radio" id="remove" checked={!addToPoll} />
                                            <label htmlFor="remove" onClick={setNoPoll}>I do not want to add Profile to poll</label>
                                        </div>
                                    </div>
                                    {addToPoll &&
                                        <div className="col-lg-5 col-md-5 col-sm-5 col-12">
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
                                                <select name="cars" id="poll" onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, pollid: e.target.value } })}>
                                                    <option value={null}>-- Select Poll --</option>
                                                    {polls.filter((poll) => poll.category === categorySelected).map(poll => {
                                                        return <option value={poll._id}>{poll.polltitle}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="owner">
                                <div className="row">
                                    <div className="col-lg-7 col-md-7 col-sm-7 col-12">
                                        <p>Profile Ownership</p>
                                        <h6 className="mb-0">Are you the owner of this profile or you are a profile writer or an
                                            Account Manager of the named Political Aspirant?</h6>
                                    </div>
                                    <div className="col-lg-5 col-md-5 col-sm-5 col-12">
                                        <div className="input">
                                            <label htmlFor="poll">Profile Ownership</label>
                                            <select name="category" id="category" onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, ownership: e.target.value } })}>
                                                <option value="Writer" selected={context.newAspirant.ownership === "Writer"}>Writer</option>
                                                <option value="Owner" selected={context.newAspirant.ownership === "Owner"}>Owner</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="transfer">
                                <div className="row">
                                    <div className="col-7">
                                        <p>Allow Profile Login Details Transfer</p>
                                        <h6 className="mb-0">Are you willing to transfer this profile to its original owner if
                                            they are interested in managing it directly?</h6>
                                    </div>
                                    <div className="col-5 d-flex justify-content-end">
                                        <div className="input">
                                            <select name="category" id="category" onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, transfer: e.target.value } })}>
                                                <option value="No" selected={context.newAspirant.transfer === "No"}>No</option>
                                                <option value="Yes" selected={context.newAspirant.transfer === "Yes"}>Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* {context.newAspirant.transfer === "Yes" &&
                                <div className="owner">
                                    <div className="row">
                                        <div className="col-7">
                                            <p>Profile Value</p>
                                            <h6 className="mb-0">Set an amount you are willing to transfer this profile <br /><br />
                                                Change this from time to time through Edit Profile as profile gains traction -
                                                estimating 50cent per view</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="input">
                                                <label htmlFor="amount">Enter amount ($)</label>
                                                <input type="number" id='amount' placeholder="1000" value={context.newAspirant.amount} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, amount: e.target.value } })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } */}
                            <div className="d-flex justify-content-between mt-5">
                                <h6 className="mb-0">3 of 3</h6>
                                <div>
                                    <p>{error}</p>
                                    <button id="draft">Save as Draft</button>
                                    <button id="proceed" onClick={preview}>Preview Profile</button>
                                </div>
                            </div>
                        </div>

                        {/* footer */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAspirant3 