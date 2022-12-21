import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
Modal.setAppElement("#root");

function JoinGroupModals({
  unitModal,
  setUnitModal,
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

  const [unit, setUnit] = useState("");
  const [unitDropdown, setUnitDropdown] = useState(false);
  const [unitid, setUnitid] = useState("");

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
        ...(questions.length !== 0 && { verification: questions }),
        ...(unit !== "" && { unitname: unit }),
        ...(unitid !== "" && { unitid: unitid }),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        setLoading(false);
        window.location.reload();
      },
      (error) => {
        // setError("Something went wrong, please try again");
        // console.log(error);
        if (error.response.status === 403) {
          setError("The Group Admin Has blocked you from Joining this Group");
        } else {
          setError("Something went wrong, please try again");
        }
        setLoading(false);
      }
    );
  };

  return (
    <>
      {/* units select modal  */}
      <Modal
        isOpen={unitModal}
        onRequestClose={() => setUnitModal(false)}
        id="member-verification-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="far fa-times-circle"
          onClick={() => setUnitModal(false)}
        />

        <h2>Choose Group Unit</h2>
        <label htmlFor="unit">Which group unit would you like to join?</label>
        <div className="position-relative">
          <div
            className="selector d-flex justify-content-between align-items-center"
            onClick={() => setUnitDropdown(!unitDropdown)}
          >
            <p>{unit === "" ? "Select Unit" : unit}</p>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          {unitDropdown && (
            <div className="dropdown position-absolute">
              {group.units.map((unit, i) => {
                return (
                  <p
                    onClick={() => {
                      setUnit(unit.unit);
                      setUnitid(unit._id);
                      setUnitDropdown(false);
                    }}
                  >
                    {unit.unit}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <h3 className="mb-3 mt-3">{error}</h3>
        <button
          id="unitContinueButton"
          onClick={() => {
            if (unit === "") {
              setError("Please Select a Unit");
            } else {
              console.log(unit, unitid);
              setError("");
              if (group.status === 0) {
                sendAnswers();
              } else if (group.questions.length !== 0) {
                setUnitModal(false);
                setMemberAnswerModal(true);
              } else {
                sendAnswers();
              }
            }
          }}
        >
          {loading ? (
            <>
              Loading... <i className="fa-solid fa-spinner fa-spin" />
            </>
          ) : (
            "Continue"
          )}
        </button>
      </Modal>

      {/* member answer modal  */}
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
        {group.units.length !== 0 && (
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => {
              setMemberAnswerModal(false);
              setUnitModal(true);
            }}
          />
        )}
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
        <div className="d-flex justify-content-between mt-3">
          <button id="add" onClick={() => setMemberAnswerModal(false)}>
            Cancel
          </button>
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
    </>
  );
}

export default JoinGroupModals;
