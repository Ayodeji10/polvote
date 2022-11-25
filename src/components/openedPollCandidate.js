import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import AuthModals from "./authenticationModlas";
import LoginModal from "./loginModal";
import Modal from "react-modal";
Modal.setAppElement("#root");

function OpenPollCandidate({
  aspirant,
  poll,
  pollVotes,
  liveVotes,
  live,
  fetchPolls,
  fetchcurrentPollAndParties,
}) {
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
  const [votedAspirant, setVotedAspirant] = useState({});
  const [voteLoading, setVoteLoading] = useState(false);
  const vote = (aspirantId) => {
    setVoteLoading(true);
    const aspirant = poll.aspirant.filter(
      (aspirant) => aspirant.id === aspirantId
    );
    setVotedAspirant(aspirant[0]);
    axios({
      url: `${API.API_ROOT}/polls/voters/${poll._id}`,
      method: "patch",
      headers: { Authorization: `Bearer ${context.user.token}` },
      data: {
        aspiid: aspirantId,
        referalId: localStorage.getItem("ballotbox_referalId"),
      },
    }).then(
      (response) => {
        console.log(response);
        setVoteModal(false);
        setVoteSuccessModal(true);
        if (window.location.pathname === "/polls") {
          fetchPolls();
        } else {
          fetchcurrentPollAndParties();
        }
        setVoteLoading(false);
      },
      (error) => {
        setVoteLoading(false);
      }
    );
  };

  // remove vote
  const [devoteLoading, setDevoteLoading] = useState(false);
  const devote = (aspirantId) => {
    setDevoteLoading(true);
    axios({
      url: `${API.API_ROOT}/polls/voters/${poll._id}`,
      method: "patch",
      headers: { Authorization: `Bearer ${context.user.token}` },
      data: { aspiid: aspirantId },
    }).then(
      (response) => {
        if (window.location.pathname === "/polls") {
          fetchPolls();
          setMultipleVotesModal(false);
          setVoteRevokeModal(true);
        } else {
          fetchcurrentPollAndParties();
          setMultipleVotesModal(false);
          setVoteRevokeModal(true);
        }
        setDevoteLoading(false);
      },
      (error) => {
        setDevoteLoading(false);
      }
    );
  };

  return (
    <>
      {live ? (
        <div className="candidate mb-3">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-2 col-sm-2 col-2">
              <div className="aspirant-img">
                <img
                  src={
                    aspirant.image === undefined
                      ? "/images/user (1) 1.png"
                      : `${aspirant.image}`
                  }
                  onClick={() => navigate(`/profiles/single/${aspirant.id}`)}
                  alt="candidate-img"
                />
              </div>
            </div>
            <div className="col-lg-8 col-md-7 col-sm-7 col-7">
              <h4 onClick={() => navigate(`/profiles/single/${aspirant.id}`)}>
                {aspirant.firstname} {aspirant.lastname}
              </h4>
              <p>{aspirant.politparty}</p>
              <div className="bar">
                <div
                  className="indicator"
                  style={{ width: `${(aspirant.livevote / liveVotes) * 100}%` }}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
              <h3>
                {(parseFloat(aspirant.livevote / liveVotes) * 100).toFixed(
                  1
                ) === undefined
                  ? `0%`
                  : `${((aspirant.livevote / liveVotes) * 100).toFixed(1)}%`}
              </h3>
              <h6 className=" mb-0">
                {aspirant.livevote} Vote{aspirant.livevote > 1 && "s"}
              </h6>
            </div>
          </div>
        </div>
      ) : (
        <div className="candidate mb-3">
          <div className="row align-items-center">
            <div className="col-2">
              <div className="aspirant-img">
                <img
                  src={
                    aspirant.image === undefined
                      ? "/images/user (1) 1.png"
                      : `${aspirant.image}`
                  }
                  onClick={() => navigate(`/profiles/single/${aspirant.id}`)}
                  alt="candidate-img"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-7 col-md-7 col-sm-7 col-6">
              <h3
                className="mb-0"
                onClick={() => navigate(`/profiles/single/${aspirant.id}`)}
              >
                {aspirant.firstname} {aspirant.lastname}
              </h3>
              <p>{aspirant.politparty}</p>
              <div className="bar">
                <div
                  className="indicator"
                  style={{
                    width: `${(aspirant.votes.length / pollVotes) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-4 d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  {((aspirant.votes.length / pollVotes) * 100).toFixed(1)}%
                </h2>
                <h5 className="mb-0">
                  {aspirant.votes.length} Vote{aspirant.votes.length > 1 && "s"}
                </h5>
              </div>
              <button
                className={`d-flex justify-content-center flex-column align-items-center ${
                  aspirant.votes.filter((vote) => vote === context.user._id)
                    .length > 0 && "voted"
                }`}
                onClick={checkVote}
              >
                {aspirant.votes.filter((vote) => vote === context.user._id)
                  .length > 0 && <i className="fa-solid fa-check" />}
                <span>
                  Vote
                  {aspirant.votes.filter((vote) => vote === context.user._id)
                    .length > 0 && "d"}
                </span>
              </button>
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
        <p>Note: you can only vote for one aspirant in this category</p>
        <div className="d-flex justify-content-between">
          <button id="cancel" onClick={() => setVoteModal(false)}>
            Cancel
          </button>
          <button id="proceed" onClick={() => vote(aspirant.id)}>
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

      {/*multiple vote modal  */}
      <Modal
        isOpen={multipleVotesModal}
        onRequestClose={() => setMultipleVotesModal(false)}
        id="vote-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <h3>Multiple Vote detected</h3>
        <p>
          You can’t vote for multiple candidate in this category, Kindly revoke
          Vote for {multiple[0].firstname} {multiple[0].lastname} to proceed
          with poll
        </p>
        <div className="d-flex justify-content-between">
          <button id="cancel" onClick={() => setMultipleVotesModal(false)}>
            Cancel
          </button>
          <button id="proceed" onClick={() => devote(aspirant.id)}>
            {devoteLoading ? (
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
        <p>
          You have successfully voted for {votedAspirant.firstname}{" "}
          {votedAspirant.lastname}
        </p>
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
        <p>
          You have successfully revoked your vote for {multiple[0].firstname}{" "}
          {multiple[0].lastname}
        </p>
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

export default OpenPollCandidate;
