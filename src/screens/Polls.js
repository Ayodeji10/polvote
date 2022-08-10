import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import PollCard from '../components/pollCard';
import Loader from '../components/loader';
import LoginPrompt from '../components/loginPrompt';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function Polls() {
    // context 
    const { context } = useContext(DataContext)

    // const [filterModal, setFilterModal] = useState(false)
    const [activePolls, setActivePolls] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)

    // fetch polls 
    const [polls, setPolls] = useState([])
    const [pollsList, setPollsList] = useState([])
    const fetchPolls = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/polls`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setPolls(response.data)
        setPollsList(response.data)
        setPageLoading(false)
    }
    useEffect(() => {
        fetchPolls()
    }, [])

    const searchPolls = (e) => {
        // console.log(e.target.value)
        const polls = pollsList.filter(poll => poll.polltitle.toLowerCase().includes(e.target.value.toLowerCase()) && poll.status == 0)
        // console.log(people)
        setPolls(polls)
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 polls">
                        <div className="d-flex justify-content-end align-items-center mb-lg-5 mb-md-2 mb-sm-4 mb-4">
                            <div className="searchbar d-flex align-items-center">
                                <input type="text" placeholder="Search Poll" onChange={(e) => searchPolls(e)} />
                                <img src="img/search-normal.png" alt="search" />
                            </div>
                            {/* <button onClick={() => setFilterModal(true)}><i className="fas fa-filter" />Filter</button> */}
                        </div>
                        <h1>{activePolls ? "Active Polls" : "Concluded Polls"}<i className="fa-solid fa-angle-down" /></h1>
                        {pageLoading ?
                            <Loader pageLoading={pageLoading} /> :
                            <>
                                <div className="header">
                                    <div className="row align-items-center">
                                        <div className="col-4">
                                            <p>Polls</p>
                                        </div>
                                        <div className="col-2">
                                            <p>No of Votes</p>
                                        </div>
                                        <div className="col-2">
                                            <p>Open Date</p>
                                        </div>
                                        <div className="col-2">
                                            <p>End Date</p>
                                        </div>
                                    </div>
                                </div>
                                {polls.filter(poll => poll.status === `${activePolls ? "0" : "1"}`).map((poll, index) => {
                                    // get total votes 
                                    let pollVotes = poll.aspirant.reduce((total, aspirant) => {
                                        let increament = aspirant.votes.length
                                        total += (increament)
                                        if (total !== 0) {
                                            return total
                                        } else {
                                            return 0.000000001
                                        }
                                    }, 0);
                                    let liveVotes = poll.aspirant.reduce((total, aspirant) => {
                                        let increament = parseInt(aspirant.livevote)
                                        total += (increament)
                                        if (total !== 0) {
                                            return total
                                        } else {
                                            return 0.000000001
                                        }
                                    }, 0)
                                    return (
                                        <PollCard poll={poll} pollVotes={pollVotes} liveVotes={liveVotes} key={index} fetchPolls={fetchPolls} />
                                    )
                                })}
                            </>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>

            {/* filter modal */}
            {/* <Modal isOpen={filterModal} onRequestClose={() => setFilterModal(false)} id="polls-modal">
                <div className="header d-flex justify-content-between align-items-center">
                    <i className="fas fa-filter" />
                    <h3 className="mb-0">Filter Polls</h3>
                    <i className="fas fa-times-circle" onClick={() => setFilterModal(false)} />
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <h6>Sort By Popularity</h6>
                        <div>
                            <input type="checkbox" id="trending" />
                            <label htmlFor="trending">Trending Poll</label>
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
                        <div className="mb">
                            <input type="checkbox" id="house" />
                            <label htmlFor="house">House of Representative</label>
                        </div>
                    </div>
                </div>
                <button>Show Result</button>
            </Modal> */}
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt />}
        </div>
    )
}

export default Polls