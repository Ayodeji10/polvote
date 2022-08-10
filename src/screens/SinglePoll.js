import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from "react-router-dom";
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import Loader from '../components/loader';
import SharePollModal from '../components/sharePollModal';
import Modal from 'react-modal'
import LoginPrompt from '../components/loginPrompt';
import OpenedPollCard from '../components/openedPollsCard';
Modal.setAppElement('#root')

function SinglePoll() {
    // context 
    const { context } = useContext(DataContext)

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
        if (pollVotes === 0) {
            setPollTotal(0.000000000000001)
        } else {
            setPollTotal(pollVotes)
        }
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
                                    <div className="col-lg-5 col-md-5 col-sm-6 mb-lg-0 mb-md-0 mb-sm-0 mb-3">
                                        <Link to={"/polls"}><h4 className="mb-0"><i className="fas fa-arrow-left" />Back</h4></Link>
                                    </div>
                                    <div className="col-lg-7 col-md-7 col-sm-6">
                                        <div className="searchbar d-flex align-items-center">
                                            <input type="text" placeholder="Search Poll" />
                                            <img src="/img/search-normal.png" alt="search" />
                                        </div>
                                    </div>
                                </header>
                                <OpenedPollCard poll={currentPoll} liveVotes={livePollTotal} pollVotes={pollToTal} fetchcurrentPollAndParties={fetchcurrentPollAndParties} />
                            </div>
                        }
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>

            {/* share modal  */}
            {sharePollModal && <SharePollModal isOpen={sharePollModal} handleShareStoryModal={handleSharePollModal} shareLink={shareLink} />}
            {/* login prompt  */}
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt />}
        </div>
    )
}

export default SinglePoll