import React, { useState } from 'react'
import SharePollModal from './sharePollModal';
import Modal from 'react-modal'
import OpenPollCandidate from './openedPollCandidate';
Modal.setAppElement('#root')

function OpenedPollCard({ poll, liveVotes, pollVotes, setOpened, fetchPolls, fetchcurrentPollAndParties }) {
    // card view 
    const [live, setLive] = useState(false)

    // modals 
    const [sharePollModal, setSharePollModal] = useState(false)

    const [shareLink] = useState(`https://polvote.com/polls/${poll._id}`)

    const handleSharePollModal = (param) => {
        setSharePollModal(param)
    }

    return (
        <div className='open-poll-card'>
            <div className="body">
                <div className="header d-flex justify-content-between align-items-center">
                    <div>
                        <h3>{poll.polltitle}</h3>
                        <p className="mb-0">{live ? liveVotes.toFixed(0) : pollVotes.toFixed(0)} Total Votes</p>
                    </div>
                    <div className="d-flex">
                        <button id="chart-btn" className={!live && "active"} onClick={() => setLive(false)}>Polvote Results</button>
                        <button id="leaderboerd-btn" className={live && 'active'} onClick={() => setLive(true)}>Live Results</button>
                    </div>
                </div>
                {live ?
                    <>
                        <h6 id='startdate'>Poll starts on {`${poll.livevotedate.substring(8, 10)}-${poll.livevotedate.substring(5, 7)}-${poll.livevotedate.substring(0, 4)}`}</h6>
                        {
                            poll.aspirant.sort((a, b) => b.livevote - a.livevote).map((aspirant, index) => {
                                return (
                                    <OpenPollCandidate poll={poll} aspirant={aspirant} live={live} key={index} pollVotes={pollVotes} liveVotes={liveVotes} fetchPolls={fetchPolls} fetchcurrentPollAndParties={fetchcurrentPollAndParties} />
                                )
                            })
                        }
                    </> :
                    <>
                        {poll.aspirant.sort((a, b) => b.votes.length - a.votes.length).map((aspirant, index) => {
                            return (
                                <OpenPollCandidate poll={poll} aspirant={aspirant} live={live} key={index} pollVotes={pollVotes} liveVotes={liveVotes} fetchPolls={fetchPolls} fetchcurrentPollAndParties={fetchcurrentPollAndParties} />
                            )
                        })}
                    </>
                }
            </div>
            <footer className="d-flex justify-content-between align-items-center">
                <p onClick={() => setSharePollModal(true)} className="mb-0"><i className="fas fa-share-alt" />Share Poll</p>
                {window.location.pathname === ("/polls") && <p onClick={() => setOpened(false)} className='mb-0'>Close Poll<i class="fa-solid fa-angle-up"></i></p>}
            </footer>
            {/* share modal  */}
            {sharePollModal && <SharePollModal isOpen={sharePollModal} handleShareStoryModal={handleSharePollModal} shareLink={shareLink} />}
        </div>
    )
}

export default OpenedPollCard