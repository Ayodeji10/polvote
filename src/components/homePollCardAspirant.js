import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function HomePollCardAspirant({ aspirant, pollToTal, parties, currentPoll }) {
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
                <div className="col-lg-2">
                    <img src={aspirant.image === undefined ? "/images/user (1) 1.png" : `${aspirant.image}`} alt="candidate-img" className="img-fluid" />
                </div>
                {/* <div className="col-lg-1 party">
                    <img src={parties.filter(party => party.partyname === aspirant.politparty).length === 0 ? "/img/user (1) 1.png" : `https://polvote.com/ballot/${parties.filter(party => party.partyname === aspirant.politparty)[0].image}`} alt="party" className="img-fluid" />
                </div> */}
                <div className="col-lg-1 gutter" />
                <div className="col-lg-6">
                    <h4>{aspirant.firstname} {aspirant.lastname}</h4>
                    <p>{aspirant.politparty}</p>
                    <div className="bar">
                        <div className="indicator" style={{ width: `${(aspirant.votes.length / pollToTal) * 100}%` }} />
                    </div>
                </div>
                <div className="col-lg-2 d-flex flex-column justify-content-between align-items-end">
                    <h3>{((aspirant.votes.length / pollToTal) * 100).toFixed(1)}%</h3>
                    <h6 className=" mb-0">{aspirant.votes.length} Vote{aspirant.votes.length > 1 && "s"}</h6>
                </div>
                <div className="col-lg-1 d-flex justify-content-end">
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
                    <button id="proceed" onClick={vote}>Proceed to Vote</button>
                </div>
            </Modal>
            {/* vote modal  */}
            <Modal isOpen={multipleVotesModal} onRequestClose={() => setMultipleVotesModal(false)} id="vote-modal" className="">
                <h3>Multiple Vote detected</h3>
                <p>You can’t vote for multiple candidate in this category, Kindly revoke Vote for to proceed with poll</p>
                <div className="d-flex justify-content-between">
                    <button id="cancel" onClick={() => setMultipleVotesModal(false)}>Cancel</button>
                    <button id="proceed" onClick={vote}>Revoke Previous Vote</button>
                </div>
            </Modal>
        </div>
    )
}

export default HomePollCardAspirant 