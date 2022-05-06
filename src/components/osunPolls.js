import React, { useState, useEffect, useRef } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Modal from 'react-modal'
import HomePollCardAspirant from './homePollCardAspirant';
Modal.setAppElement('#root')

function OsunPolls() {
    // history 
    const navigate = useNavigate()

    // current poll and parties
    const [currentPoll, setCurrentPoll] = useState({ aspirant: [] })
    const [parties, setParties] = useState([])
    const [fetchLoading, setFetchLoading] = useState(true)
    // fetch current poll and parties
    const fetchcurrentPollAndParties = () => {
        const pollAPI = `${API.API_ROOT}/polls/getsinglepoll/626dd7ac7f225bf461a81b00`
        const partiesAPI = `${API.API_ROOT}/parties/parties`

        const getPoll = axios.get(pollAPI)
        const getParties = axios.get(partiesAPI)

        axios.all([getPoll, getParties]).then(
            axios.spread((...allData) => {
                setCurrentPoll(allData[0].data)
                setParties(allData[1].data)
                setFetchLoading(false)
            })
        )

    }

    useEffect(() => {
        fetchcurrentPollAndParties()
    }, [])

    // get total votes 
    const [pollToTal, setPollTotal] = useState()
    let pollVotes = currentPoll.aspirant.reduce((total, aspirant) => {
        let increament = aspirant.votes.length
        total += (increament)
        return total
    }, 0)
    useEffect(() => {
        setPollTotal(pollVotes)
    }, [currentPoll])

    // share poll 
    // modals 
    const [shareModal, setShareModal] = useState(false)

    // use ref 
    const inputRef = useRef()

    const [shareLink] = useState(`https://polvote.com/polls/626dd7ac7f225bf461a81b00`)

    const copy = () => {
        navigator.clipboard.writeText(shareLink)
        inputRef.current.select()
    }

    return (
        <>
            {!fetchLoading &&
                <div className="poll">
                    <div className="main">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div>
                                <h3>{currentPoll.polltitle}</h3>
                                <p className="mb-0">{pollToTal} Total Votes</p>
                            </div>
                            <div className="d-flex">
                                {/* <button id="chart-btn"><img src="img/_3295429435616.svg" alt="Chart" />Chart</button>
                        <button id="leaderboerd-btn" className="active"><img src="img/Group 376.svg" alt="Leaderboard" />Leaderboard</button> */}
                            </div>
                        </div>
                        {currentPoll.aspirant.map((aspirant, index) => {
                            return (
                                <HomePollCardAspirant aspirant={aspirant} pollToTal={pollToTal} key={index} parties={parties} currentPoll={currentPoll} />
                            )
                        })}
                    </div>
                    <footer className="d-flex justify-content-between align-items-center">
                        <p onClick={() => setShareModal(true)} className="mb-0"><i className="fas fa-share-alt" />Share Poll</p>
                        <button className="d-flex align-items-center" onClick={() => navigate("/polls")}>See Trending Polls<i className="fas fa-angle-right" /></button>
                    </footer>
                </div>
            }
            {/* share modal  */}
            <Modal isOpen={shareModal} onRequestClose={() => setShareModal(false)} id="poll-share-modal">
                <i className="fas fa-times" onClick={() => setShareModal(false)} />
                <h1>See who’s Leading the Poll</h1>
                <p>You can explore Politics, Learn and Share Insights Online on Polvote Box</p>
                <h3>Share on:</h3>
                <div className="d-flex justify-content-between sm">
                    <img src="/img/facebook.png" alt="facebook" />
                    <img src="/img/Whatsapp.png" alt="whatsapp" />
                    <img src="/img/twit.png" alt="twitter" />
                    <img src="/img/Instagram.png" alt="instagram" />
                </div>
                <h3>Copy Link</h3>
                <div className="link d-flex justify-content-between align-items-center">
                    <input type="text" ref={inputRef} placeholder="https://www.polvote.com/share-poll/presidential/share_92029" value={shareLink} />
                    <img src="/img/Group 111.png" alt="copy" onClick={copy} />
                </div>
            </Modal>
        </>
    )
}

export default OsunPolls