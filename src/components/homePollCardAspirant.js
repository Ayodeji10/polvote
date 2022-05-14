import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root')

function HomePollCardAspirant({ aspirant, pollToTal, parties, currentPoll }) {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // modals 
    const [voteModal, setVoteModal] = useState(false)
    const [multipleVotesModal, setMultipleVotesModal] = useState(false)

    // chech for duplicate vote 
    const [multiple, setMultiple] = useState([{ firstname: "", lastname: "" }])
    const checkVote = () => {
        const filteredVotes = currentPoll.aspirant.filter(aspirant => aspirant.votes.filter(vote => vote === context.user._id).length > 0)
        // console.log(filteredVotes)
        if (filteredVotes.length < 1) {
            setVoteModal(true)
        } else {
            setMultiple(filteredVotes)
            setMultipleVotesModal(true)
        }
    }

    // vote 
    const vote = () => {
        axios({
            url: `${API.API_ROOT}/polls/voters/626d7109c44fc4e4698417c8`,
            method: "patch",
            headers: { 'Authorization': `Bearer ${context.user.token}` },
            data: { aspiid: aspirant.id }
        }).then((response) => {
            window.location.reload()
            // console.log(response)
        }, (error) => {
            // console.log(error)
        })
    }

    return (
        <div className="candidate mb-3">
            <div className="row align-items-center">
                <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                    <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `${aspirant.image}`} onClick={() => navigate(`/profiles/single/${aspirant.id}`)} alt="candidate-img" className="img-fluid" />
                </div>
                {/* <div className="col-lg-1 party">
                    <img src={parties.filter(party => party.partyname === aspirant.politparty).length === 0 ? "/img/user (1) 1.png" : `https://polvote.com/ballot/${parties.filter(party => party.partyname === aspirant.politparty)[0].image}`} alt="party" className="img-fluid" />
                </div> */}
                <div className="col-lg-7 col-md-6 col-sm-6 col-6">
                    <h4 onClick={() => navigate(`/profiles/single/${aspirant.id}`)}>{aspirant.firstname} {aspirant.lastname}</h4>
                    <p>{aspirant.politparty}</p>
                    <div className="bar">
                        <div className="indicator" style={{ width: `${(aspirant.votes.length / pollToTal) * 100}%` }} />
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                    <h3>{((aspirant.votes.length / pollToTal) * 100).toFixed(1)}%</h3>
                    <h6 className=" mb-0">{aspirant.votes.length} Vote{aspirant.votes.length > 1 && "s"}</h6>
                </div>
                <div className="col-lg-1 col-md-2 col-sm-2 col-2 d-flex justify-content-end">
                    {aspirant.votes.filter(vote => vote === context.user._id).length > 0 ?
                        <img src="/img/Group 515.png" alt="voted" className='img-fluid vote-img' onClick={checkVote} /> :
                        <img src="/img/Group 516.png" alt="vote" className='img-fluid vote-img' onClick={checkVote} />
                    }
                </div>
            </div>


            {/* vote modal  */}
            <Modal isOpen={voteModal} onRequestClose={() => setVoteModal(false)} id="vote-modal" className={`${context.darkMode ? 'dm' : ""}`}>
                <h3>Proceed to Vote</h3>
                <p>'Note: you can only vote for one aspirant in this category</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setVoteModal(false)}>Cancel</button>
                    <button id="proceed" onClick={vote}>Proceed to Vote</button>
                </div>
            </Modal>
            {/* vote modal  */}
            <Modal isOpen={multipleVotesModal} onRequestClose={() => setMultipleVotesModal(false)} id="vote-modal" className={`${context.darkMode ? 'dm' : ""}`}>
                <h3>Multiple Vote detected</h3>
                <p>You can’t vote for multiple candidate in this category, Kindly revoke Vote for {multiple[0].firstname} {multiple[0].lastname} to proceed with poll</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setMultipleVotesModal(false)}>Cancel</button>
                    <button id="proceed" onClick={vote}>Revoke Previous Vote</button>
                </div>
            </Modal>
        </div>
    )
}

export default HomePollCardAspirant 