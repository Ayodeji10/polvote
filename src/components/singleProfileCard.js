import React, { useState, useContext } from 'react'
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";
import ShareProfileModal from './shareProfileModal';
import RedirectToPoll from './redirectToPollModal';
import Modal from 'react-modal'
Modal.setAppElement('#root')

function SingleProfileCard({ aspirant }) {
    // context 
    const { context } = useContext(DataContext)

    // navigate 
    const navigate = useNavigate()

    const [seeMore, setSeeMore] = useState(false)

    const [shareProfileModal, setShareProfileModal] = useState(false)

    const [shareLink] = useState(`https://polvote.com/profiles/${aspirant.firstname}-${aspirant.lastname}/${aspirant._id}`)

    const [redirectToPollModal, setRedirectToPollModal] = useState(false)

    const handleRedirect = (variable) => {
        setRedirectToPollModal(variable)
    }

    const [profileImageModal, setProfileImageModal] = useState(false)

    const [options, setOptions] = useState(false)

    return (
        <>
            <div className="profile">
                <div className="row mb-3 align-items-center">
                    <div className="col-11 d-flex align-items-center gap-3">
                        <div className="img-container">
                            <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                        </div>
                        <h5 className='mb-0'>{aspirant.firstname} {aspirant.lastname}</h5>
                    </div>
                    <div className="col-1 d-flex justify-content-end" onClick={() => setOptions(!options)}>
                        <i className="fas fa-ellipsis-h" style={{ cursor: "pointer" }} />
                        {!options ? "" :
                            <div className="options">
                                <div className="mb-1">
                                    <h4 className='mb-0' onClick={() => navigate(`/profiles/${aspirant.firstname}-${aspirant.lastname}/${aspirant._id}`)}>Open Profile</h4>
                                </div>
                                <div className="mb-1">
                                    <h4 className='mb-0' onClick={() => setShareProfileModal(true)}>Share Profile</h4>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <h4 className='mb-0'>Overview</h4>
                <p>{aspirant.overview} {!seeMore && <span onClick={() => setSeeMore(true)}>....see more</span>}</p>
                {seeMore &&
                    <>
                        <h4>Educational Background</h4>
                        <p>{aspirant.education}</p>
                        <h4>Political Career</h4>
                        <p>{aspirant.politics}</p>
                        <h4>Professional Career/Business Interests</h4>
                        <p>{aspirant.binterest}</p>
                        <h4>Awards</h4>
                        <p>{aspirant.activism}<span onClick={() => setSeeMore(false)}>....see less</span></p>
                    </>
                }
                <div className="d-flex justify-content-between gap-2 align-items-center mb-3">
                    <h6>Born: {aspirant.dob.substring(0, 15)}</h6>
                    <h6>Party: {aspirant.pparty.match(/\b(\w)/g).join('')}</h6>
                    <h6><i className="far fa-eye" />{aspirant.aspirantviews.length}</h6>
                    <h6>{aspirant.pollsdetails.length === 0 ? "No Active Poll" : `${aspirant.pollsdetails[0].polltitle}`}</h6>
                    {aspirant.pollsdetails.length === 0 ?
                        <button onClick={(e) => e.stopPropagation()} className="voted" title="Aspirant not currently in any poll" >Vote</button>
                        :
                        <button onClick={(e) => {
                            e.stopPropagation();
                            setRedirectToPollModal(true)
                        }}>Vote</button>
                    }
                </div>
                <div className="big-img">
                    <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} onClick={() => setProfileImageModal(true)} alt="profile-img" className="img-fluid" />
                    <Modal isOpen={profileImageModal} onRequestClose={() => setProfileImageModal(false)} id="profileImgModal" className={`${context.darkMode ? 'dm' : ""}`}>
                        <i className="fas fa-times" onClick={() => setProfileImageModal(false)} />
                        <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} onClick={() => setProfileImageModal(true)} alt="profile-img" className="img-fluid" />
                    </Modal>
                </div>
            </div>
            {/* share and redirect modal  */}
            {shareProfileModal && <ShareProfileModal shareProfileModal={shareProfileModal} shareLink={shareLink} setShareProfileModal={setShareProfileModal} />}
            {redirectToPollModal && <RedirectToPoll isOpen={redirectToPollModal} handleRedirect={handleRedirect} name={`${aspirant.firstname} ${aspirant.lastname}`} pollId={aspirant.pollsdetails[0].pollid} />}
        </>
    )
}

export default SingleProfileCard 