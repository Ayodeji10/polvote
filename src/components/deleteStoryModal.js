import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function DeleteStoryModal({ story, openModal, setDeleteStoryModal }) {
    // context 
    const { context } = useContext(DataContext)

    const [loading, setLoading] = useState(false)
    const deleteStory = async () => {
        setLoading(true)
        axios.delete(`${API.API_ROOT}/story/deletestory/${story._id}`,
            { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("ballotbox_token")}` } })
            .then(response => {
                console.log(response)
                window.location.reload()
            }).catch(error => {
                setLoading(false)
                console.error(error)
            })
    }

    return (
        <Modal isOpen={openModal} onRequestClose={() => setDeleteStoryModal(false)} className={`delete-write-modal ${context.darkMode ? 'dm' : ""}`}>
            <i className="far fa-times-circle" onClick={() => setDeleteStoryModal(false)} />
            <h1>Delete Story</h1>
            <p>Are you sure you want to delete this story?</p>
            <div className="d-flex justify-content-between">
                <button onClick={() => setDeleteStoryModal(false)} id="cancel">Cancel</button>
                <button onClick={deleteStory} id="delete">{loading ? "Loading..." : "Delete"}</button>
            </div>
        </Modal>
    )
}

export default DeleteStoryModal 