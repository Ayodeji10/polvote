import React, { useState, useEffect, useRef } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Modal from 'react-modal'
import HomePollCardAspirant from './homePollCardAspirant';
Modal.setAppElement('#root')

function EkitiPolls() {
    // history 
    const navigate = useNavigate()

    // current poll and parties
    const [currentPoll, setCurrentPoll] = useState({ aspirant: [] })
    const [parties, setParties] = useState([])
    const [fetchLoading, setFetchLoading] = useState(true)
    // fetch current poll and parties
    const fetchcurrentPollAndParties = () => {
        const pollAPI = `${API.API_ROOT}/polls/getsinglepoll/626dd7317f225bf461a81abb`
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

    // get Live poll total 
    const [livePollTotal, setLivePollTotal] = useState()
    let livePollTotalVotes = currentPoll.aspirant.reduce((total, aspirant) => {
        let increament = parseInt(aspirant.livevote)
        total += (increament)
        return total
    }, 0)
    useEffect(() => {
        if (livePollTotalVotes === 0) {
            setLivePollTotal(0.000000000000001)
        } else {
            setLivePollTotal(livePollTotalVotes)
        }
    }, [currentPoll])

    // share poll 
    // modals 
    const [shareModal, setShareModal] = useState(false)

    // use ref 
    const inputRef = useRef()

    const [shareLink] = useState(`https://polvote.com/polls/626dd7317f225bf461a81abb`)

    const copy = () => {
        navigator.clipboard.writeText(shareLink)
        inputRef.current.select()
    }

    const [live, setLive] = useState(false)

    return (
        <>
            {!fetchLoading &&
                <div className="poll">
                    <div className="main">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div>
                                <h3>{currentPoll.polltitle}</h3>
                                <p className="mb-0">{live ? livePollTotalVotes : pollToTal} Total Votes</p>
                            </div>
                            <div className="d-flex">
                                <button id="chart-btn" className={!live && "active"} onClick={() => setLive(false)}>Polvote Result</button>
                                <button id="leaderboerd-btn" className={live && 'active'} onClick={() => setLive(true)}>Live Result</button>
                            </div>
                        </div>
                        {live ?
                            <>
                                <h6>Poll starts on {`${currentPoll.livevotedate.substring(8, 10)}-${currentPoll.livevotedate.substring(5, 7)}-${currentPoll.livevotedate.substring(0, 4)}`}</h6>
                                {
                                    currentPoll.aspirant.sort((a, b) => b.livevote - a.livevote).map((aspirant, index) => {
                                        return (
                                            <div className="candidate mb-3" key={index}>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                                                        <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `${aspirant.image}`} onClick={() => navigate(`/profiles/single/${aspirant.id}`)} alt="candidate-img" className="img-fluid" />
                                                    </div>
                                                    <div className="col-lg-8 col-md-7 col-sm-7 col-7">
                                                        <h4 onClick={() => navigate(`/profiles/single/${aspirant.id}`)}>{aspirant.firstname} {aspirant.lastname}</h4>
                                                        <p>{aspirant.politparty}</p>
                                                        <div className="bar">
                                                            <div className="indicator" style={{ width: `${(aspirant.livevote / livePollTotal) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                    {/* {console.log(livePollTotal)}
                                                    {console.log(parseFloat(aspirant.livevote))}
                                                    {console.log(((parseFloat(aspirant.livevote) / livePollTotal) * 100).toFixed(1))} */}
                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                                                        <h3>{(parseFloat(aspirant.livevote / livePollTotal) * 100).toFixed(1) === undefined ? `0%` : `${((aspirant.livevote / livePollTotal) * 100).toFixed(1)}%`}</h3>
                                                        {/* {((aspirant.livevote / livePollTotal) * 100).toFixed(1)}% */}
                                                        <h6 className=" mb-0">{aspirant.livevote} Vote{aspirant.livevote > 1 && "s"}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </> :
                            <>
                                {currentPoll.aspirant.sort((a, b) => b.votes.length - a.votes.length).map((aspirant, index) => {
                                    return (
                                        <HomePollCardAspirant aspirant={aspirant} pollToTal={pollToTal} key={index} parties={parties} currentPoll={currentPoll} />
                                    )
                                })}
                            </>
                        }
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

export default EkitiPolls