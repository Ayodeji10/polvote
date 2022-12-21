import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../dataContext";
import axios from "axios";
import { API } from "../apiRoot";
import AuthModals from "../authenticationModlas";
import Modal from "react-modal";
import { useEffect } from "react";
Modal.setAppElement("#root");

function OptionsCard({ option, poll, currentUnit, group }) {
  // context
  const { context } = useContext(DataContext);

  // use history
  const navigate = useNavigate();

  // modals
  const [voteModal, setVoteModal] = useState(false);
  const [multipleVotesModal, setMultipleVotesModal] = useState(false);
  const [voteSuccessModal, setVoteSuccessModal] = useState(false);
  const [voteRevokeModal, setVoteRevokeModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [oneMoreStepModal, setOneMoreStepModal] = useState(false);

  // chech for duplicate vote
  const [multiple, setMultiple] = useState([{ firstname: "", lastname: "" }]);
  const checkVote = () => {
    if (localStorage.getItem("ballotbox_token") === null) {
      setOneMoreStepModal(true);
    } else {
      const filteredVotes = poll.aspirant.filter(
        (aspirant) =>
          aspirant.votes.filter((vote) => vote === context.user._id).length > 0
      );
      // console.log(filteredVotes)
      if (filteredVotes.length < 1) {
        setVoteModal(true);
      } else {
        setMultiple(filteredVotes);
        setMultipleVotesModal(true);
      }
    }
  };

  // vote
  const [voteLoading, setVoteLoading] = useState(false);
  const vote = () => {
    // console.log(
    //   group.members.filter((member) => member.userid === context.user._id)[0]
    //     .unitid
    // );
    setVoteLoading(true);
    axios({
      url: `${API.API_ROOT}/generalpoll/voters/${poll._id}`,
      method: "patch",
      headers: { Authorization: `Bearer ${context.user.token}` },
      data: {
        // ...(poll.category === "election" && { aspirantid: units }),
        optionid: option._id,
        ...(poll.polltype === "private" &&
          poll.isGenralunit === "no" && {
            unitid: group.members.filter(
              (member) => member.userid === context.user._id
            )[0].unitid,
          }),
      },
    }).then(
      (response) => {
        console.log(response);
        window.location.reload();
        // setVoteLoading(false);
      },
      (error) => {
        setVoteLoading(false);
      }
    );
  };

  // remove vote
  const [devoteLoading, setDevoteLoading] = useState(false);
  const devote = (aspirantId) => {
    // setDevoteLoading(true);
    // axios({
    //   url: `${API.API_ROOT}/polls/voters/${poll._id}`,
    //   method: "patch",
    //   headers: { Authorization: `Bearer ${context.user.token}` },
    //   data: { aspiid: aspirantId },
    // }).then(
    //   (response) => {
    //     if (window.location.pathname === "/polls") {
    //       fetchPolls();
    //       setMultipleVotesModal(false);
    //       setVoteRevokeModal(true);
    //     } else {
    //       fetchcurrentPollAndParties();
    //       setMultipleVotesModal(false);
    //       setVoteRevokeModal(true);
    //     }
    //     setDevoteLoading(false);
    //   },
    //   (error) => {
    //     setDevoteLoading(false);
    //   }
    // );
  };

  return (
    <>
      {/* public  */}
      {poll.polltype === "public" || group.units.length <= 1 ? (
        <div className="candidate mb-3">
          <div className="row align-items-center">
            <div className="col-2">
              {option.image === null || option.image === undefined ? (
                <div className="text-card d-flex justify-content-center align-items-center">
                  <h2 className="text">
                    {option.option.match(/\b\w/g).join("").substring(0, 2)}
                  </h2>
                </div>
              ) : (
                <div className="aspirant-img">
                  <img
                    src={option.image}
                    alt={option.option}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            <div className="col-lg-7 col-md-7 col-sm-7 col-6">
              <h3 className="mb-3">{option.option}</h3>
              <div className="bar">
                <div
                  className="indicator"
                  style={{
                    width:
                      poll.votes.length === 0
                        ? "0%"
                        : `${(option.votes.length / poll.votes.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-4 d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  {poll.votes.length === 0
                    ? "0.0%"
                    : `${(
                        (option.votes.length / poll.votes.length) *
                        100
                      ).toFixed(1)}%`}
                </h2>
                <h5 className="mb-0">
                  {option.votes.length} Vote{option.votes.length > 1 && "s"}
                </h5>
              </div>
              <button
                // disabled={
                //   poll.votes.filter(
                //     (vote) =>
                //       vote.voterid === context.user._id &&
                //       vote.optionid === option._id
                //   ).length === 0
                // }
                className={`d-flex justify-content-center flex-column align-items-center ${
                  option.votes.filter(
                    (vote) => vote.voterid === context.user._id
                  ).length === 0 && "voted"
                }`}
                onClick={() => {
                  if (
                    option.votes.filter(
                      (vote) => vote.voterid === context.user._id
                    ).length !== 0
                  ) {
                    setMultipleVotesModal(true);
                  } else {
                    setVoteModal(true);
                  }
                }}
              >
                {option.votes.filter(
                  (vote) => vote.voterid === context.user._id
                ).length !== 0 && <i className="fa-solid fa-check" />}
                <span>
                  Vote
                  {option.votes.filter(
                    (vote) => vote.voterid === context.user._id
                  ).length !== 0 && "d"}{" "}
                  1
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // private
        <div className="candidate mb-3">
          <div className="row align-items-center">
            <div className="col-2">
              {option.image === null || option.image === undefined ? (
                <div className="text-card d-flex justify-content-center align-items-center">
                  <h2 className="text">
                    {option.option.match(/\b\w/g).join("").substring(0, 2)}
                  </h2>
                </div>
              ) : (
                <div className="aspirant-img">
                  <img
                    src={option.image}
                    alt={option.option}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            <div className="col-lg-7 col-md-7 col-sm-7 col-6">
              <h3 className="mb-3">{option.option}</h3>
              <div className="bar">
                <div
                  className="indicator"
                  style={{
                    width:
                      poll.votes.length === 0
                        ? "0%"
                        : `${(option.votes.length / poll.votes.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-4 d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  {poll.votes.length === 0
                    ? "0.0%"
                    : `${(
                        (option.votes.length / poll.votes.length) *
                        100
                      ).toFixed(1)}%`}
                </h2>
                <h5 className="mb-0">
                  {option.votes.length} Vote{option.votes.length > 1 && "s"}
                </h5>
              </div>
              {group.members.filter(
                (member) => member.userid === context.user._id
              ).length !== 0 &&
                group.members.filter(
                  (member) => member.userid === context.user._id
                )[0].unitname ===
                  poll.unitpoints.filter(
                    (unit) => unit.unitname === currentUnit
                  )[0].unitname && (
                  <button
                    className={`d-flex justify-content-center flex-column align-items-center ${
                      option.votes.filter(
                        (vote) => vote.voterid === context.user._id
                      ).length === 0 && "voted"
                    }`}
                    onClick={() => {
                      if (
                        option.votes.filter(
                          (vote) => vote.voterid === context.user._id
                        ).length !== 0
                      ) {
                        setMultipleVotesModal(true);
                      } else {
                        setVoteModal(true);
                      }
                    }}
                  >
                    {option.votes.filter(
                      (vote) => vote.voterid === context.user._id
                    ).length !== 0 && <i className="fa-solid fa-check" />}
                    <span>Vote</span>
                  </button>
                )}
              {/* {group.members.filter(
                (member) => member.userid === context.user._id
              ).length === 0 && <>hello</>} */}
            </div>
          </div>
        </div>
      )}

      {/* vote modal  */}
      <Modal
        isOpen={voteModal}
        onRequestClose={() => setVoteModal(false)}
        id="vote-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <h3>You're about to Vote</h3>
        <p>Note: you can only vote for one option in this poll</p>
        <div className="d-flex justify-content-between">
          <button id="cancel" onClick={() => setVoteModal(false)}>
            Cancel
          </button>
          <button id="proceed" onClick={vote}>
            {voteLoading ? (
              <>
                Loading... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Proceed to Vote"
            )}
          </button>
        </div>
      </Modal>

      {/*multiple vote modal / Revoke vote  */}
      <Modal
        isOpen={multipleVotesModal}
        onRequestClose={() => setMultipleVotesModal(false)}
        id="vote-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <h3>Revoke Vote?</h3>
        <p>
          You can’t vote for multiple candidate in this category, Kindly revoke
          Vote for {multiple[0].firstname} {multiple[0].lastname} to proceed
          with poll
        </p>
        <div className="d-flex justify-content-between">
          <button id="cancel" onClick={() => setMultipleVotesModal(false)}>
            Cancel
          </button>
          <button id="proceed" onClick={vote}>
            {voteLoading ? (
              <>
                Loading... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Revoke Previous Vote"
            )}
          </button>
        </div>
      </Modal>

      {/* vote success modal */}
      <Modal
        isOpen={voteSuccessModal}
        onRequestClose={() => setVoteSuccessModal(false)}
        id="voteConfirmation"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setVoteSuccessModal(false)}
        />
        <img src="/img/done.png" alt="done" />
        <h3>Successful!</h3>
        {/* <p>
     You have successfully voted for {votedAspirant.firstname}{" "}
     {votedAspirant.lastname}
   </p> */}
      </Modal>

      {/* vote revoke success modal */}
      <Modal
        isOpen={voteRevokeModal}
        onRequestClose={() => setVoteRevokeModal(false)}
        id="voteConfirmation"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setVoteRevokeModal(false)}
        />
        <img src="/img/revoke.png" alt="done" />
        <h3>Vote Revoked Successfully!!</h3>
        {/* <p>
     You have successfully revoked your vote for {multiple[0].firstname}{" "}
     {multiple[0].lastname}
   </p> */}
      </Modal>

      {/* one more step modal  */}
      <Modal
        isOpen={oneMoreStepModal}
        onRequestClose={() => setOneMoreStepModal(false)}
        id="oneMoreStepModal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setOneMoreStepModal(false)}
        />
        <img src="/img/oneMoreStep.png" alt="one more step" />
        <h2>Just one more step.....</h2>
        <p>
          You need to be logged in to vote for your preferred aspirant. Kindly
          click on the button below to login and vote.
        </p>
        <button
          onClick={() => {
            setOneMoreStepModal(false);
            setLoginModal(true);
          }}
        >
          Login
        </button>
      </Modal>

      {/* authentication */}
      <AuthModals
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        signupModal={signupModal}
        setSignupModal={setSignupModal}
        verificationModal={verificationModal}
        setVerificationModal={setVerificationModal}
      />
    </>
  );
}

export default OptionsCard;
