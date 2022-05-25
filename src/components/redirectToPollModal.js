import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function RedirectToPoll({ isOpen, handleRedirect, name, pollId }) {
    // context 
    const { context } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    return (
        <Modal isOpen={isOpen} onRequestClose={() => handleRedirect(false)} id="redirectModal" className={`${context.darkMode ? 'dm' : ""}`}>
            <i className="fas fa-times" onClick={() => handleRedirect(false)} />
            <p>You will be directed to the poll page to vote for {name}</p>
            <button id='proceed-btn' onClick={() => navigate(`/polls/${pollId}`)}>Proceed to Poll</button>
            <button id='cancel-btn' onClick={() => handleRedirect(false)}>Cancel</button>
        </Modal>
    )
}

export default RedirectToPoll 