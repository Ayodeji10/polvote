import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
import Loader from '../components/loader';
import SingleProfileCard from '../components/singleProfileCard';
Modal.setAppElement('#root')


function Profiles() {
    // context 
    const { context } = useContext(DataContext)

    // navigate 
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    const [filterModal, setFilterModal] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    // fetch aspirants 
    const [aspirantList, setAspirantList] = useState([])
    const [aspirants, setAspirants] = useState([])

    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirantList(response.data)
        setAspirants(response.data)
        setPageLoading(false)
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
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 profile">
                        {/* header */}
                        <div className="header mb-5">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="searchbar d-flex align-items-center">
                                        <input type="text" placeholder="Search for Aspirant Profile" onChange={(e) => searchProfile(e)} />
                                        <img src="img/search-normal.png" alt="search" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-7">
                                    <Link to={"/create-aspirant"}><button><i className="far fa-edit" />Create Aspirant Profile</button></Link>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-2 col-5">
                                    {/* <button onClick={() => setFilterModal(true)}><i className="fas fa-filter" />Filter</button> */}
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
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} />
                            :
                            <>
                                {aspirants.filter((aspirant) => aspirant.status == 1).map((aspirant, index) => {
                                    return (
                                        <SingleProfileCard aspirant={aspirant} key={index} />
                                    )
                                }).reverse()}
                            </>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profiles