import React, { useRef } from 'react'
import Modal from 'react-modal'
Modal.setAppElement('#root')

function ShareProfileModal({ shareLink, shareProfileModal, handleShareProfileModal }) {
    // use ficus 
    const inputRef = useRef()

    const copy = () => {
        navigator.clipboard.writeText(shareLink)
        inputRef.current.select()
    }
    return (
        <Modal isOpen={shareProfileModal} onRequestClose={() => handleShareProfileModal(false)} id="poll-share-modal">
            <i className="fas fa-times" onClick={() => handleShareProfileModal(false)} />
            <h1>Share Profile of Aspirant on Polvote</h1>
            <p>You can explore Politics, Learn and Share Insights Online on Plvote</p>
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
    )
}

export default ShareProfileModal 