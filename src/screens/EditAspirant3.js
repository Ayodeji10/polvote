import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import axios from "axios";

function EditAspirant3() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    // params 
    const { id } = useParams()

    const [loading, setLoading] = useState(true)

    // fetch current aspirant
    const [aspirant, setAspirant] = useState({})
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
            navigate(`/user-profile`)
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
                        {loading ? "loading" :
                            <div className="submit-profile">
                                <div className="d-flex">
                                    <Link to={`/edit-aspirant/setup-aspirant/${aspirant._id}`}><i className="fas fa-arrow-left" /></Link>
                                    <div>
                                        <h1>Proceed to Submit Profile for {aspirant.firstname} {aspirant.lastname}</h1>
                                    </div>
                                </div>
                                <div className="owner">
                                    <div className="row">
                                        <div className="col-7">
                                            <p>Profile Ownership</p>
                                            <h6 className="mb-0">Are you the owner of this profile or you are a profile writer or an
                                                Account Manager of the named Political Aspirant?</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="input">
                                                <label htmlFor="poll">Profile Ownership</label>
                                                <select name="category" id="category" onChange={(e) => setAspirant({ ...aspirant, ownershiptype: e.target.value })}>
                                                    <option value="Writer" selected={aspirant.ownershiptype === "Writer"}>Writer</option>
                                                    <option value="Owner" selected={aspirant.ownershiptype === "Owner"}>Owner</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="transfer">
                                    <div className="row">
                                        <div className="col-7">
                                            <p>Allow Profile Login Details Transfer</p>
                                            <h6 className="mb-0">Are you willing to transfer this profile to its original owner if
                                                they are interested in managing it directly?</h6>
                                        </div>
                                        <div className="col-5 d-flex justify-content-end">
                                            <div className="input">
                                                <select name="category" id="category" onChange={(e) => setAspirant({ ...aspirant, profiletransfer: e.target.value })}>
                                                    <option value="No" selected={aspirant.profiletransfer === "No"}>No</option>
                                                    <option value="Yes" selected={aspirant.profiletransfer === "Yes"}>Yes</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {aspirant.profiletransfer === "Yes" &&
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
                                                    <input type="number" id='amount' placeholder="1000" value={aspirant.profilevalue} onChange={(e) => setAspirant({ ...aspirant, profilevalue: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="d-flex justify-content-between mt-5">
                                    <h6 className="mb-0">3 of 3</h6>
                                    <div>
                                        {/* <p>{error}</p> */}
                                        {/* <button id="draft">Save as Draft</button> */}
                                        <button id="proceed" onClick={updateProfile}>{updating ? 'loading...' : "Update Profile"}</button>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* footer */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditAspirant3 