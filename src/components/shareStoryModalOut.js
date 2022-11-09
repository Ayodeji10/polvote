import React, { useState, useRef, useContext } from "react";
import { DataContext } from "../dataContext";
import Modal from "react-modal";
Modal.setAppElement("#root");

function ShareStoryModalOut({ story, openModal, setShareStoryModalOut }) {
  // context
  const { context } = useContext(DataContext);

  // use ficus
  const inputRef = useRef();

  const [shareLink] = useState(
    `https://polvote.com/stories/${story.story
      .replace(/(<([^>]+)>)/gi, "")
      .replaceAll(" ", "-")
      .replaceAll("?", "")
      .replaceAll("/", "-")
      .replaceAll("%", "percent")
      .substring(0, 45)}/${story._id}`
  );

  const copy = () => {
    navigator.clipboard.writeText(shareLink);
    inputRef.current.select();
  };
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={() => setShareStoryModalOut(false)}
      id="poll-share-modal"
      className={`${context.darkMode ? "dm" : ""}`}
    >
      <i
        className="fas fa-times"
        onClick={() => setShareStoryModalOut(false)}
      />
      <h1>Share Story of Friends on Polvote</h1>
      <p>You can explore Politics, Learn and Share Insights Online on Plvote</p>
      <h3>Share on:</h3>
      <div className="row mb-5">
        <div className="col-3">
          <img src="/img/facebook.png" alt="facebook" className="img-fluid" />
        </div>
        <div className="col-3">
          <img src="/img/Whatsapp.png" alt="whatsapp" className="img-fluid" />
        </div>
        <div className="col-3">
          <img src="/img/twit.png" alt="twitter" className="img-fluid" />
        </div>
        <div className="col-3">
          <img src="/img/Instagram.png" alt="instagram" className="img-fluid" />
        </div>
      </div>
      <h3>Copy Link</h3>
      <div className="link d-flex justify-content-between align-items-center">
        <input
          type="text"
          ref={inputRef}
          placeholder="https://www.ballotbox.com/share-poll/presidential/share_92029"
          value={shareLink}
        />
        <img src="/img/Group 111.png" alt="copy" onClick={copy} />
      </div>
    </Modal>
  );
}

export default ShareStoryModalOut;
