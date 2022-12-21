import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
Modal.setAppElement("#root");

function MemberAnswerModal({
  memberAnswerModal,
  setMemberAnswerModal,
  questions,
  setQuestions,
  group,
}) {
  // context
  const { context } = useContext(DataContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setInputValue = (e, i) => {
    setQuestions(
      questions.map((q, index) => {
        if (i === index) {
          return { ...q, answer: e.target.value };
        }
        return q;
      })
    );
  };

  const sendAnswers = () => {
    // console.log(questions);
    setError("");
    setLoading(true);
    axios({
      url: `${API.API_ROOT}/group/groupjoin`,
      method: "post",
      data: {
        groupid: group._id,
        groupname: group.groupname,
        grouptype: group.grouptype,
        verification: questions,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        // console.log(response);
        setLoading(false);
        window.location.reload();
      },
      (error) => {
        // setError("Something went wrong, please try again");
        console.log(error);
      }
    );
  };

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
      {questions.map((q, i) => {
        return (
          <div className="mb-4">
            <label htmlFor={`q${i}`}>{q.question}</label>
            <input
              type="text"
              id={`q${i}`}
              // name={Object.keys(q)[0]}
              placeholder="Type your answer here"
              value={q.answer}
              onChange={(e) => setInputValue(e, i)}
            />
          </div>
        );
      })}
      <h3 className="mb-0">{error}</h3>
      <div className="d-flex justify-content-between mt-5">
        <button id="add">Cancel</button>
        <button id="save" onClick={sendAnswers}>
          {loading ? (
            <>
              Loading... <i className="fa-solid fa-spinner fa-spin" />
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </Modal>
  );
}

export default MemberAnswerModal;
