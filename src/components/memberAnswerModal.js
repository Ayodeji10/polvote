import React, { useState, useContext } from "react";
import Modal from "react-modal";
// import { API } from "../components/apiRoot";
// import axios from "axios";
import { DataContext } from "../dataContext";
Modal.setAppElement("#root");

function MemberAnswerModal({ memberAnswerModal, setMemberAnswerModal }) {
  // context
  const { context } = useContext(DataContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      isOpen={memberAnswerModal}
      onRequestClose={() => setMemberAnswerModal(false)}
      id="member-verification-modal"
      className={`${context.darkMode ? "dm" : ""}`}
    >
      <i
        className="far fa-times-circle"
        onClick={() => setMemberAnswerModal(false)}
      />

      <h2>Membership Verification</h2>
      <p>
        Answer the following questions to help the group admin review your
        request to join the group.
      </p>
      <div className="mb-4">
        <label>
          Nibh sed facilisis eu idNibh sed facilisis eu id.Nibh sed facilisis eu
          idNibh sed facilisis eu id?
        </label>
        <input type="text" placeholder="Type your answer here" />
      </div>
      <div className="mb-4">
        <label>
          Nibh sed facilisis eu idNibh sed facilisis eu id.Nibh sed facilisis eu
          idNibh sed facilisis eu id?
        </label>
        <input type="text" placeholder="Type your answer here" />
      </div>
      <h3 className="mb-0">{error}</h3>
      <div className="d-flex justify-content-between mt-5">
        <button id="add">Cancel</button>
        <button id="save">Submit</button>
      </div>
    </Modal>
  );
}

export default MemberAnswerModal;
