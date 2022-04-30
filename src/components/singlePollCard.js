import React, { useState, useContext } from 'react'
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SinglePollCard({ aspirant, pollToTal, parties, currentPoll, id }) {
    // context 
    const { context } = useContext(DataContext)

    // modals 
    const [voteModal, setVoteModal] = useState(false)
    const [multipleVotesModal, setMultipleVotesModal] = useState(false)

    // chech for duplicate vote 
    const checkVote = () => {
        const filteredVotes = currentPoll.aspirant.filter(aspirant => aspirant.votes.filter(vote => vote === context.user._id).length > 0)
        if (filteredVotes.length < 1) {
            setVoteModal(true)
        } else {
            setMultipleVotesModal(true)
        }
    }

    // vote 
    const vote = (aspirantId) => {
        console.log(aspirantId)
        axios({
            url: `${API.API_ROOT}/polls/voters/${id}`,
            method: "patch",
            headers: { 'Authorization': `Bearer ${context.user.token}` },
            data: { aspiid: aspirantId }
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
                <div className="col-lg-2">
                    <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `${aspirant.image}`} alt="candidate-img" className="img-fluid" />
                </div>
                {/* <div className="col-lg-1">
                    <img src={parties.filter(party => party.partyname === aspirant.politparty).length === 0 ? "/img/user (1) 1.png" : `https://polvote.com/ballot/${parties.filter(party => party.partyname === aspirant.politparty)[0].image}`} alt="party" className="img-fluid" />
                </div> */}
                <div className="col-lg-7">
                    <h3 className="mb-0">{aspirant.firstname} {aspirant.lastname}</h3>
                    <p>{aspirant.politparty}</p>
                    <div className="bar">
                        <div className="indicator" style={{ width: `${(aspirant.votes.length / pollToTal) * 100}%` }} />
                    </div>
                </div>
                <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                    <h2>{(aspirant.votes.length / pollToTal) * 100}%</h2>
                    <h5 className="mb-0">{aspirant.votes.length} Vote{aspirant.votes.length > 1 && "s"}</h5>
                </div>
                <div className="col-lg-1">
                    {aspirant.votes.filter(vote => vote === context.user._id).length > 0 ?
                        <img src="/img/Group 515.png" alt="voted" onClick={checkVote} /> :
                        <img src="/img/Group 516.png" alt="vote" onClick={checkVote} />
                    }
                </div>
            </div>

            {/* vote modal  */}
            <Modal isOpen={voteModal} onRequestClose={() => setVoteModal(false)} id="vote-modal" className="">
                <h3>Proceed to Vote</h3>
                <p>Once you click on proceed, you wont be able to vote for another for another aspirant in the
                    same category</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setVoteModal(false)}>Cancel</button>
                    <button id="proceed" onClick={() => vote(aspirant.id)}>Proceed to Vote</button>
                </div>
            </Modal>

            {/* vote modal  */}
            <Modal isOpen={multipleVotesModal} onRequestClose={() => setMultipleVotesModal(false)} id="vote-modal" className="">
                <h3>Multiple Vote detected</h3>
                <p>You can’t vote for multiple candidate in this category, Kindly revoke Vote for to proceed with poll</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setMultipleVotesModal(false)}>Cancel</button>
                    <button id="proceed" onClick={() => vote(aspirant.id)}>Revoke Previous Vote</button>
                </div>
            </Modal>
        </div>
    )
}

export default SinglePollCard 