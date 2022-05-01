import React, { useState, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function PollCard({ poll }) {
    // history
    const navigate = useNavigate()

    // use ficus 
    const inputRef = useRef()

    const [options, setOptons] = useState(false)
    const [shareModal, setShareModal] = useState(false)
    const [shareLink, setShareLink] = useState(`https://polvote.com/polls/${poll._id}`)

    const copy = () => {
        navigator.clipboard.writeText(shareLink)
        inputRef.current.select()
    }

    return (
        <div className="poll">
            <div className="row align-items-center">
                <div className="col-lg-4">
                    <h3>{poll.polltitle}</h3>
                    <h6>{poll.category}</h6>
                </div>
                <div className="col-lg-2">
                    {/* <h6>383 Polls</h6> */}
                </div>
                <div className="col-lg-2">
                    <h6>{poll.startdate.substring(0, 10)}</h6>
                </div>
                <div className="col-lg-2">
                    <h6>{poll.enddate.substring(0, 10)}</h6>
                </div>
                <div className="col-lg-1 d-flex align-items-center">
                    <i className="fas fa-circle" style={{ color: poll.status == 0 ? 'rgba(50, 186, 124, 1)' : 'rgba(135, 195, 254, 1)' }} />
                    <h6>{poll.status == 0 ? "Ongoing" : "Concluded"}</h6>
                </div>
                <div className="col-lg-1 d-flex justify-content-end" onMouseOver={() => setOptons(true)} onMouseLeave={() => setOptons(false)}>
                    <i className="fas fa-ellipsis-v" />
                    {options &&
                        <div className="options">
                            <Link to={`/polls/${poll._id}`}><p>Open Poll</p></Link>
                            <p onClick={() => setShareModal(true)}>Share Poll</p>
                        </div>
                    }
                </div>
            </div>

            {/* share modal  */}
            <Modal isOpen={shareModal} onRequestClose={() => setShareModal(false)} id="poll-share-modal">
                <i className="fas fa-times" onClick={() => setShareModal(false)} />
                <h1>See who’s Leading the Poll</h1>
                <p>You can explore Politics, Learn and Share Insights Online on Ballot Box</p>
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
        </div>
    )
}

export default PollCard 