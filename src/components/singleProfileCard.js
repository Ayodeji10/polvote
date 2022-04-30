import React, { useState, useRef, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SingleProfileCard({ aspirant }) {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // use ficus 
    const inputRef = useRef()

    const [shareModal, setShareModal] = useState(false)
    const [shareLink, setShareLink] = useState(`http://localhost:3001/polls/${aspirant._id}`)

    const copy = () => {
        navigator.clipboard.writeText(shareLink)
        inputRef.current.select()
    }


    return (
        <>
            <div className="profile" onClick={() => navigate(`/profiles/single/${aspirant._id}`)}>
                <div className="row">
                    <div className="col-lg-2">
                        <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                    </div>
                    <div className="col-lg-10">
                        <h3>{aspirant.firstname} {aspirant.lastname}</h3>
                        <p>{aspirant.overview}</p>
                        <footer>
                            <div className="row align-items-center">
                                <div className="col-lg-3">
                                    <h4 className="mb-0">Born: {aspirant.dob.substring(0, 15)}</h4>
                                </div>
                                <div className="col-lg-3">
                                    <h4 className="mb-0">Party: {aspirant.pparty}</h4>
                                </div>
                                <div className="col-lg-1">
                                    <p className="mb-0"><i className="far fa-eye" />{aspirant.aspirantviews.length}</p>
                                </div>
                                <div className="col-lg-1">
                                    <i className="fas fa-share-alt" id="views" onClick={(e) => {
                                        e.stopPropagation();
                                        setShareModal(true)
                                    }} />
                                </div>
                                <div className="col-lg-3">
                                    <p className="mb-0">{aspirant.pollsdetails.length === 0 ? "No Active Poll" : `${aspirant.pollsdetails[0].polltitle}`}</p>
                                </div>
                                <div className="col-lg-1">
                                    {aspirant.pollsdetails.length === 0 ?
                                        <img src="/img/Group 515.png" alt="inactive" title='Inactive' onClick={(e) => e.stopPropagation()} />
                                        : <img src="/img/Group 516.png" alt="vote" title='Vote' onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/polls/${aspirant.pollsdetails[0].pollid}`)
                                        }} />}
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
            {/* share modal  */}
            <Modal isOpen={shareModal} onRequestClose={() => setShareModal(false)} id="poll-share-modal">
                <i className="fas fa-times" onClick={() => setShareModal(false)} />
                <h1>Share Profile of Aspirant on Polvote</h1>
                <p>You can explore Politics, Learn and Share Insights Online on Polvote</p>
                <h3>Share on:</h3>
                <div className="d-flex justify-content-between sm">
                    <img src="/img/facebook.png" alt="facebook" />
                    <img src="/img/Whatsapp.png" alt="whatsapp" />
                    <img src="/img/twit.png" alt="twitter" />
                    <img src="/img/Instagram.png" alt="instagram" />
                </div>
                <h3>Copy Link</h3>
                <div className="link d-flex justify-content-between align-items-center">
                    <input type="text" ref={inputRef} placeholder="https://www.ballotbox.com/share-poll/presidential/share_92029" value={shareLink} />
                    <img src="/img/Group 111.png" alt="copy" onClick={copy} />
                </div>
            </Modal>
        </>
    )
}

export default SingleProfileCard 