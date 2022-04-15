import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { API } from "../components/apiRoot";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SinglePoll() {
    // params 
    const { id } = useParams()

    const [shareModal, setShareModal] = useState(false)
    const [voteModal, setVoteModal] = useState(false)

    // current poll 
    const [currentPoll, setCurrentPoll] = useState(null)
    const [parties, setParties] = useState([])
    const [pageLoading, setPageLoadig] = useState(true)
    // fetch current poll and parties
    const fetchcurrentPollAndParties = () => {
        const pollAPI = `${API.API_ROOT}/polls/getsinglepoll/${id}`
        const partiesAPI = `${API.API_ROOT}/parties/parties`

        const getPoll = axios.get(pollAPI)
        const getParties = axios.get(partiesAPI)

        axios.all([getPoll, getParties]).then(
            axios.spread((...allData) => {
                setCurrentPoll(allData[0].data)
                setParties(allData[1].data)
                setPageLoadig(false)
                // console.log([...allData])
            })
        )

    }
    useEffect(() => {
        if (id && id !== '') fetchcurrentPollAndParties()
    }, [id])

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
                    <div className="col-lg-8 single-poll">
                        {pageLoading ? "" :
                            <div>
                                <header className="d-flex justify-content-between align-items-center">
                                    <h1 className="mb-0"><Link to={"/polls"}><i className="fas fa-arrow-left" /></Link>{currentPoll.polltitle}</h1>
                                    <div className="searchbar d-flex align-items-center">
                                        <input type="text" placeholder="Search Poll" />
                                        <img src="/img/search-normal.png" alt="search" />
                                    </div>
                                </header>
                                <div className="poll">
                                    <div className="body">
                                        <div className="header d-flex justify-content-between align-items-center">
                                            <div>
                                                <h3>{currentPoll.polltitle}</h3>
                                                <p className="mb-0">9,875 Total Polls</p>
                                            </div>
                                            <div className="d-flex">
                                                <button id="chart-btn"><img src="/img/_3295429435616.svg" alt="Chart" />Chart</button>
                                                <button id="leaderboerd-btn" className="active"><img src="/img/Group 376.svg" alt="Leaderboard" />Leaderboard</button>
                                            </div>
                                        </div>
                                        {currentPoll.aspirant.map((aspirant, index) => {
                                            return (
                                                <div className="candidate mb-3" key={index}>
                                                    <div className="row align-items-center">
                                                        <div className="col-lg-1">
                                                            <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `https://polvote.com/ballot/${aspirant.image}`} alt="candidate-img" className="img-fluid" />
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `https://polvote.com/ballot/${parties.filter(party => party.partyname === aspirant.politparty)[0].image}`} alt="party" className="img-fluid" />
                                                        </div>
                                                        <div className="col-lg-7">
                                                            <h3 className="mb-0">{aspirant.firstname} {aspirant.lastname}</h3>
                                                            <p>{aspirant.politparty}</p>
                                                            <div className="bar">
                                                                <div className="indicator" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                                                            <h2>25%</h2>
                                                            <h5 className="mb-0">302,209 Votes</h5>
                                                        </div>
                                                        <div className="col-lg-1">
                                                            <img src="/img/Group 516.png" alt="vote" onClick={() => setVoteModal(true)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <footer className="d-flex justify-content-between align-items-center">
                                        <p>See More<i className=" fas fa-angle-down" /></p>
                                        <p onClick={() => setShareModal(true)}><i className="fas fa-share-alt" />Share Poll</p>
                                    </footer>
                                </div>
                            </div>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>

            {/* share modal  */}
            <Modal isOpen={shareModal} onRequestClose={() => setShareModal(false)} id="poll-share-modal">
                <i className="fas fa-times" onClick={() => setShareModal(false)} />
                <h1>See who’s Leading the Poll</h1>
                <p>You can explore Politics, Learn and Share Insights Online on Ballot Box</p>
                <h3>Share on:</h3>
                <div className="d-flex justify-content-between sm">
                    <img src="/img/facebook.png" alt="facebook" />
                    <img src="/img/Whatsapp.png" alt="whatsapp" />
                    <img src="/img/twit.png" alt="twitter" />
                    <img src="/img/Instagram.png" alt="instagram" />
                </div>
                <h3>Copy Link</h3>
                <div className="link d-flex justify-content-between align-items-center">
                    <input type="text" placeholder="https://www.ballotbox.com/share-poll/presidential/share_92029" />
                    <img src="/img/Group 111.png" alt="copy" />
                </div>
            </Modal>

            {/* vote modal  */}
            <Modal isOpen={voteModal} onRequestClose={() => setVoteModal(false)} id="vote-modal" className="">
                <h3>Proceed to Vote</h3>
                <p>Once you click on proceed, you wont be able to vote for another for another aspirant in the
                    same category</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setVoteModal(false)}>Cancel</button>
                    <button id="proceed">Proceed to Vote</button>
                </div>
            </Modal>
        </div>
    )
}

export default SinglePoll