import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import ShareProfileModal from './shareProfileModal';

function SingleProfileCard({ aspirant }) {

    // history 
    const navigate = useNavigate()

    const [shareProfileModal, setShareProfileModal] = useState(false)

    const handleShareProfileModal = (variable) => {
        setShareProfileModal(variable)
    }
    const [shareLink] = useState(`https://polvote.com/profiles/single/${aspirant._id}`)

    return (
        <>
            <div className="profile" onClick={() => navigate(`/profiles/single/${aspirant._id}`)}>
                <div className="row">
                    <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                        <img src={aspirant.image === null || aspirant.image === undefined ? `img/user (1) 1.png` : `${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-10 col-10">
                        <h3>{aspirant.firstname} {aspirant.lastname}</h3>
                        <p>{aspirant.overview}</p>
                        <footer>
                            <div className="row align-items-center">
                                <div className="col-lg-3 col-md-2 col-sm-4 mb-sm-3 col-4 mb-2 mb-lg-0 mb-md-0">
                                    <h4 className="mb-0">Born: {aspirant.dob.substring(0, 15)}</h4>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-sm-3 col-6 mb-2 mb-lg-0 mb-md-0">
                                    <h4 className="mb-0">Party: {aspirant.pparty}</h4>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-2 mb-sm-3 col-2 mb-2 mb-lg-0 mb-md-0">
                                    <p className="mb-0"><i className="far fa-eye" />{aspirant.aspirantviews.length}</p>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-3 col-3">
                                    <i className="fas fa-share-alt" id="views" onClick={(e) => {
                                        e.stopPropagation();
                                        setShareProfileModal(true)
                                    }} />
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-7 col-7">
                                    <p className="mb-0">{aspirant.pollsdetails.length === 0 ? "No Active Poll" : `${aspirant.pollsdetails[0].polltitle}`}</p>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-2 col-2">
                                    {aspirant.pollsdetails.length === 0 ?
                                        <img src="/img/Group 515.png" className='vote-img' alt="inactive" title='Inactive' onClick={(e) => e.stopPropagation()} />
                                        : <img src="/img/Group 516.png" className='vote-img' alt="vote" title='Vote' onClick={(e) => {
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
            {shareProfileModal && <ShareProfileModal shareProfileModal={shareProfileModal} shareLink={shareLink} handleShareProfileModal={handleShareProfileModal} />}
        </>
    )
}

export default SingleProfileCard 