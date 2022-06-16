import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import Loader from '../components/loader';
import SharePollModal from '../components/sharePollModal';
import Modal from 'react-modal'
import SinglePollCard from '../components/singlePollCard';
Modal.setAppElement('#root')

function SinglePoll() {
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

    // params 
    const { id } = useParams()

    // current poll and parties
    const [currentPoll, setCurrentPoll] = useState({ aspirant: [] })
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

    // modals 
    const [sharePollModal, setSharePollModal] = useState(false)

    const [shareLink] = useState(`https://polvote.com/polls/${id}`)

    const handleSharePollModal = (param) => {
        setSharePollModal(param)
    }

    const [live, setLive] = useState(false)

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    <div className="col-lg-8 col-md-9 single-poll">
                        {pageLoading ? <Loader pageLoading={pageLoading} /> :
                            <div>
                                <header className="row align-items-center">
                                    <div className="col-lg-7 col-md-7 col-sm-6">
                                        <h1 className="mb-0"><Link to={"/polls"}><i className="fas fa-arrow-left" /></Link>{currentPoll.polltitle}</h1>
                                    </div>
                                    <div className="col-lg-5 col-md-5 col-sm-6">
                                        <div className="searchbar d-flex align-items-center">
                                            <input type="text" placeholder="Search Poll" />
                                            <img src="/img/search-normal.png" alt="search" />
                                        </div>
                                    </div>
                                </header>
                                <div className="poll">
                                    <div className="body">
                                        <div className="header d-flex justify-content-between align-items-center">
                                            <div>
                                                <h3>{currentPoll.polltitle}</h3>
                                                <p className="mb-0">{live ? livePollTotalVotes : pollToTal} Total Votes</p>
                                            </div>
                                            <div className="d-flex">
                                                <button id="chart-btn" className={!live && "active"} onClick={() => setLive(false)}>Polvote Results</button>
                                                <button id="leaderboerd-btn" className={live && 'active'} onClick={() => setLive(true)}>Live Results</button>
                                            </div>
                                        </div>
                                        {live ?
                                            <>
                                                <h6 id='startdate'>Poll starts on {`${currentPoll.livevotedate.substring(8, 10)}-${currentPoll.livevotedate.substring(5, 7)}-${currentPoll.livevotedate.substring(0, 4)}`}</h6>
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
                                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                                                                        <h3>{(parseFloat(aspirant.livevote / livePollTotal) * 100).toFixed(1) === undefined ? `0%` : `${((aspirant.livevote / livePollTotal) * 100).toFixed(1)}%`}</h3>
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
                                                        <SinglePollCard aspirant={aspirant} pollToTal={pollToTal} key={index} parties={parties} currentPoll={currentPoll} id={id} fetchcurrentPollAndParties={fetchcurrentPollAndParties} />
                                                    )
                                                })}
                                            </>
                                        }
                                    </div>
                                    <footer className="d-flex justify-content-between align-items-center">
                                        {/* <p>See More<i className=" fas fa-angle-down" /></p> */}
                                        <p onClick={() => setSharePollModal(true)}><i className="fas fa-share-alt" />Share Poll</p>
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
            {sharePollModal && <SharePollModal isOpen={sharePollModal} handleShareStoryModal={handleSharePollModal} shareLink={shareLink} />}
        </div>
    )
}

export default SinglePoll