import React, { useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function Profiles() {
    const [filterModal, setFilterModal] = useState(false)

    // fetch aspirants 
    const [aspirantList, setAspirantList] = useState([])
    const [aspirants, setAspirants] = useState([])

    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        // console.log(response)
        setAspirantList(response.data)
        setAspirants(response.data)
    }

    useEffect(() => {
        fetchAspirants()
    }, [])

    const searchProfile = (e) => {
        // console.log(e.target.value)
        const people = aspirantList.filter(aspirant => `${aspirant.firstname} ${aspirant.lastname}`.toLowerCase().includes(e.target.value.toLowerCase()) && aspirant.status == 1)
        // console.log(people)
        setAspirants(people)
    }

    return (
        <div className="container-fluid">
            <Nav />
            <div className="home-feed container">
                <div className="row">
                    {/* aside  */}
                    <div className="col-lg-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    <div className="col-lg-1" />
                    {/* main  */}
                    <div className="col-lg-8 profile">
                        {/* header */}
                        <div className="header mb-5">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="searchbar d-flex align-items-center">
                                        <input type="text" placeholder="Search for Aspirant Profile" onChange={(e) => searchProfile(e)} />
                                        <img src="img/search-normal.png" alt="search" />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <button><i className="far fa-edit" />Create Aspirant Profile</button>
                                </div>
                                <div className="col-lg-2">
                                    <button onClick={() => setFilterModal(true)}><i className="fas fa-filter" />Filter</button>
                                </div>
                            </div>
                        </div>
                        {/* filter modal  */}
                        <Modal isOpen={filterModal} onRequestClose={() => setFilterModal(false)} id="polls-modal">
                            <div className="header d-flex justify-content-between align-items-center">
                                <i className="fas fa-filter" />
                                <h3 className="mb-0">Filter Profile Result</h3>
                                <i className="fas fa-times-circle" onClick={() => setFilterModal(false)} />
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h6>Sort By Popularity</h6>
                                    <div className="mb-3">
                                        <input type="checkbox" id="views" />
                                        <label htmlFor="views">Profile Views</label>
                                    </div>
                                    <div className="mb-5">
                                        <input type="checkbox" id="highest" />
                                        <label htmlFor="highest">Highest Poll</label>
                                    </div>
                                    <h6>Sort By Time</h6>
                                    <div className="mb-3">
                                        <input type="checkbox" id="All" />
                                        <label htmlFor="All">All</label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" id="recent" />
                                        <label htmlFor="recent">Recently Added</label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" id="ongoing" />
                                        <label htmlFor="ongoing">Ongoing Poll</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="closed" />
                                        <label htmlFor="closed">Concluded Poll</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h6>Sort By Category</h6>
                                    <div className="mb-3">
                                        <input type="checkbox" id="All" />
                                        <label htmlFor="All">All</label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" id="Presidential" />
                                        <label htmlFor="Presidential">Presidential</label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" id="Gubernatorial" />
                                        <label htmlFor="Gubernatorial">Gubernatorial</label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" id="Senatorial" />
                                        <label htmlFor="Senatorial">Senatorial</label>
                                    </div>
                                    <div className="mb-5">
                                        <input type="checkbox" id="house" />
                                        <label htmlFor="house">House of Representative</label>
                                    </div>
                                    <div className="mb">
                                        <input type="checkbox" id="sort" />
                                        <label htmlFor="sort">Sort Alphabetically</label>
                                    </div>
                                </div>
                            </div>
                            <button>Show Result</button>
                        </Modal>
                        {aspirants.filter((aspirant) => aspirant.status == 1).map((aspirant, index) => {
                            return (
                                <Link to={`/profiles/single/${aspirant._id}`} key={index}>
                                    <div className="profile">
                                        <div className="row">
                                            <div className="col-lg-2">
                                                <img src={aspirant.image === null || aspirant.image == undefined ? `img/user (1) 1.png` : `https://polvote.com/ballot/${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                                            </div>
                                            <div className="col-lg-10">
                                                <h3>{aspirant.firstname} {aspirant.lastname}</h3>
                                                <p>{aspirant.overview}</p>
                                                <footer>
                                                    <div className="row align-items-center">
                                                        <div className="col-lg-3">
                                                            <h4 className="mb-0">Born: {aspirant.dob.substring(0, 15)}</h4>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <h4 className="mb-0">Party: {aspirant.pparty}</h4>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <p className="mb-0"><i className="far fa-eye" />204</p>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <i className="fas fa-share-alt" id="views" />
                                                        </div>
                                                        <div className="col-lg-3 d-flex justify-content-between align-items-center">
                                                            <p className="mb-0">No Active Poll</p>
                                                            <img src="img/Group 515.png" alt="" />
                                                        </div>
                                                    </div>
                                                </footer>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profiles