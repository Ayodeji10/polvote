import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import PollCard from "../components/pollCard";
import AuthModals from "../components/authenticationModlas";
import Loader from "../components/loader";
import LoginPrompt from "../components/loginPrompt";
import Modal from "react-modal";
import RecommendedStories from "../components/recommendedStories";
import RecomendedAspirants from "../components/recomendedAspirants";
import CreateGroupModal from "../components/createGroupModal";
import PollCard2 from "../components/newPollCards/pollCard2";
import Widget from "../components/widget";
import CreatePollModal from "../components/createPollModal";
Modal.setAppElement("#root");

function Polls() {
  // context
  const { context } = useContext(DataContext);

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [createPollModal, setCreatePollModal] = useState(false);

  const [activePolls, setActivePolls] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [options, setOptions] = useState(false);

  // fetch polls and groups
  const [polls, setPolls] = useState([]);
  const [pollsList, setPollsList] = useState([]);
  const fetchPolls = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/polls`)
      .catch((error) => [console.log("Err", error)]);
    setPolls(response.data);
    setPollsList(response.data);
    setPageLoading(false);
  };

  // created polls
  const [newPolls, setNewPolls] = useState([]);
  const [newPollsList, setNewPollsList] = useState([]);
  const fetchNewPolls = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/generalpoll`)
      .catch((error) => [console.log("Err", error)]);
    setNewPolls(response.data);
    setNewPollsList(response.data);
  };

  useEffect(() => {
    fetchPolls();
    fetchNewPolls();
  }, []);

  const searchPolls = (e) => {
    if (e.target.value === "") {
      setPolls(pollsList);
      setNewPolls(newPollsList);
    } else {
      const wordArray = e.target.value.toLowerCase().split(" "); // create array from input
      const wordSpace = wordArray.filter((word) => word.length > 1); // remove spacing
      wordSpace.forEach((word) => {
        const polls = pollsList.filter(
          (poll) =>
            poll.polltitle.toLowerCase().indexOf(word) !== -1 &&
            poll.status == 0
        );
        setPolls(polls);

        // new poll filter
        const polls2 = newPollsList.filter(
          (poll) => poll.question.toLowerCase().indexOf(word) !== -1
        );
        setNewPolls(polls2);
      });
    }
  };

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          {/* main  */}
          <div className="col-lg-6 col-md-9 polls">
            <div className="polls-header">
              <div className="row">
                <div className="col-lg-7 col-md-6 col-sm-6">
                  <div className="searchbar d-flex align-items-center">
                    <input
                      type="text"
                      placeholder="Search Poll"
                      onChange={(e) => searchPolls(e)}
                    />
                    <img src="img/search-normal.png" alt="search" />
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <button
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => setCreatePollModal(true)}
                  >
                    <img src="/img/edit.png" alt="write" />
                    New Poll
                  </button>
                  {createPollModal && (
                    <CreatePollModal
                      createPollModal={createPollModal}
                      setCreatePollModal={setCreatePollModal}
                    />
                  )}
                </div>
              </div>
            </div>
            <h1 onClick={() => setOptions(!options)}>
              {activePolls ? "Active Polls" : "Concluded Polls"}
              <i className={`fa-solid fa-angle-${options ? "up" : "down"}`} />
            </h1>
            {options && (
              <div className="options">
                <p
                  className="mb-1"
                  onClick={() => {
                    setActivePolls(true);
                    setOptions(false);
                  }}
                >
                  Active Poll
                </p>
                <p
                  className="mb-0"
                  onClick={() => {
                    setActivePolls(false);
                    setOptions(false);
                  }}
                >
                  Concluded Poll
                </p>
              </div>
            )}
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <>
                {polls
                  .filter(
                    (poll) => poll.status === `${activePolls ? "0" : "1"}`
                  )
                  .map((poll, index) => {
                    // get total votes
                    let pollVotes = poll.aspirant.reduce((total, aspirant) => {
                      let increament = aspirant.votes.length;
                      total += increament;
                      if (total !== 0) {
                        return total;
                      } else {
                        return 0.000000001;
                      }
                    }, 0);
                    let liveVotes = poll.aspirant.reduce((total, aspirant) => {
                      let increament = parseInt(aspirant.livevote);
                      total += increament;
                      if (total !== 0) {
                        return total;
                      } else {
                        return 0.000000001;
                      }
                    }, 0);
                    return (
                      <PollCard
                        poll={poll}
                        pollVotes={pollVotes}
                        liveVotes={liveVotes}
                        key={index}
                        fetchPolls={fetchPolls}
                      />
                    );
                  })}

                {/* new polls  */}
                {newPolls.map((poll, i) => {
                  return <PollCard2 key={i} poll={poll} />;
                })}
              </>
            )}
            {/* footer  */}
            <Footer />
          </div>
          <div className="profile-widget col-lg-3">
            <div className="aside-sticky">
              <RecommendedStories />
              <RecomendedAspirants />
            </div>
          </div>
        </div>
      </div>
      <Widget />

      {/* authentication */}
      <AuthModals
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        signupModal={signupModal}
        setSignupModal={setSignupModal}
        verificationModal={verificationModal}
        setVerificationModal={setVerificationModal}
      />
      {/* login prompt  */}
      {localStorage.getItem("ballotbox_token") === null && (
        <LoginPrompt
          setLoginModal={setLoginModal}
          setSignupModal={setSignupModal}
        />
      )}
    </div>
  );
}

export default Polls;
