import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Modal from 'react-modal'
import SharePollModal from './sharePollModal';
Modal.setAppElement('#root')

function PollCard({ poll, pollVotes }) {
    const navigate = useNavigate()

    const [options, setOptons] = useState(false)

    // share poll 
    const [sharePollModal, setSharePollModal] = useState(false)

    const [shareLink] = useState(`https://polvote.com/polls/${poll._id}`)

    const handleSharePollModal = (param) => {
        setSharePollModal(param)
    }

    return (
        <>
            <div className="poll" onClick={() => navigate(`/polls/${poll._id}`)}>
                <div className="row align-items-center">
                    <div className="col-4">
                        <h3>{poll.polltitle}</h3>
                        <h6>{poll.category}</h6>
                    </div>
                    <div className="col-2">
                        <h6>{pollVotes} Polls</h6>
                    </div>
                    <div className="col-2">
                        <h6>{poll.startdate.substring(0, 10)}</h6>
                    </div>
                    <div className="col-2">
                        <h6>{poll.enddate.substring(0, 10)}</h6>
                    </div>
                    <div className="col-1 d-flex align-items-center">
                        <i className="fas fa-circle" style={{ color: poll.status === "0" ? 'rgba(50, 186, 124, 1)' : 'rgba(135, 195, 254, 1)' }} />
                        <h6 id='status-text'>{poll.status === "0" ? "Ongoing" : "Concluded"}</h6>
                    </div>
                    <div className="col-1 d-flex justify-content-end" onMouseOver={() => setOptons(true)} onMouseLeave={() => setOptons(false)}>
                        <i className="fas fa-ellipsis-v" />
                        {options &&
                            <div className="options">
                                <Link to={`/polls/${poll._id}`}><p>Open Poll</p></Link>
                                <p onClick={(e) => {
                                    e.stopPropagation();
                                    setSharePollModal(true)
                                }}>Share Poll</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* share modal  */}
            {sharePollModal && <SharePollModal isOpen={sharePollModal} handleShareStoryModal={handleSharePollModal} shareLink={shareLink} />}
        </>
    )
}

export default PollCard 