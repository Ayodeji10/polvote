import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
Modal.setAppElement("#root");

function MemberVerificationModal({
  memberVerificationModal,
  setMemberVerificationModal,
  questions,
  setQuestions,
  id,
}) {
  // context
  const { context } = useContext(DataContext);

  //   add question
  const addQuestion = () => {
    setError("");
    if (questions.length === 5) {
      setError("You cant have more than 5 Verification QUestions");
    } else {
      const newArray = [...questions, ""];
      setQuestions(newArray);
    }
  };

  //   delete question
  const handleDelete = (index) => {
    setError("");
    if (questions.length <= 2) {
      setError("You must have at least 2 Vefification Questions");
    } else {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  //   change inputvalue
  const handleChange = (e, index) => {
    setError("");
    const inputData = [...questions];
    inputData[index] = e.target.value;
    setQuestions(inputData);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuestions = () => {
    setError("");
    setLoading(true);
    // axios
    //   .patch(
    //     `${API.API_ROOT}/group/addquestion/${id}`,
    //     { questions: JSON.stringify(questions) },
    //     {
    //       "Content-Type": "application/json",
    //       Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjZkYmQ4YzdmMjI1YmY0NjFhODE1ZmYiLCJ1c2VybmFtZSI6IkBwb2x2b3RlIiwiZW1haWwiOiJwb2x2b3RlY29udGFjdEBnbWFpbC5jb20iLCJpYXQiOjE2NjU5OTk3MzMsImV4cCI6MTY5NzUzNTczM30.nE7-MEdHWKHiD_j98pejBYWFDWhKnsTC9DcQQ6Xcmdc`,
    //       // Authorization: `Bearer ${context.user.token}`,
    //     }
    //   )
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log(response);
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    axios({
      url: `${API.API_ROOT}/group/addquestion/${id}`,
      method: "patch",
      data: { questions: JSON.stringify(questions) },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        window.location.reload();
      },
      (error) => {
        setError("Something went wrong, please try again");
        console.log(error);
      }
    );
  };

  return (
    <Modal
      isOpen={memberVerificationModal}
      onRequestClose={() => setMemberVerificationModal(false)}
      id="member-verification-modal"
      className={`${context.darkMode ? "dm" : ""}`}
    >
      <i
        className="far fa-times-circle"
        onClick={() => setMemberVerificationModal(false)}
      />

      <h2>Membership Verification</h2>
      <p>
        Ask pending members up to two questions before they can join the group
      </p>
      {questions.map((question, index) => {
        return (
          <div key={index} className="mb-4">
            <label htmlFor={index}>Question {index + 1}</label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                id={index}
                placeholder="Ask a question"
                value={question}
                onChange={(e) => handleChange(e, index)}
              />
              <i
                className="fa-solid fa-trash-can"
                onClick={() => handleDelete(index)}
              />
            </div>
          </div>
        );
      })}
      <h3 className="mb-0">{error}</h3>
      <div className="d-flex justify-content-between mt-5">
        <button id="add" onClick={addQuestion}>
          Add Question
        </button>
        <button id="save" onClick={sendQuestions}>
          {loading ? (
            <>
              Loading... <i className="fa-solid fa-spinner fa-spin" />
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </Modal>
  );
}

export default MemberVerificationModal;
