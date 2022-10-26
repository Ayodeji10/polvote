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
Modal.setAppElement("#root");

function Polls() {
  // context
  const { context } = useContext(DataContext);

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  // const [filterModal, setFilterModal] = useState(false)
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

  const [groups, setGroups] = useState([]);
  const fetchGroups = () => {
    axios
      .get(`${API.API_ROOT}/group`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        setGroups(response.data);
        console.log(response);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    fetchPolls();
    fetchGroups();
  }, []);

  const searchPolls = (e) => {
    // console.log(e.target.value)
    const polls = pollsList.filter(
      (poll) =>
        poll.polltitle.toLowerCase().includes(e.target.value.toLowerCase()) &&
        poll.status == 0
    );
    // console.log(people)
    setPolls(polls);
  };

  // dropdoen
  const [dropdown, setDropdown] = useState(false);

  //   modals
  const [createPollModal, setCreatePollModal] = useState(false);
  const [createPollView, setCreatePollView] = useState(1);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [opinionPollModal, setOpinionPollModal] = useState(false);

  // states
  // general
  const [pollType, setPollType] = useState("election");
  const [pollOpen, setPollOpen] = useState("public");
  const [group, setGroup] = useState("");

  // election poll
  const [pollTitle, setPollTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // opinion poll
  const [question, setQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { option: "", optionImg: "" },
    { option: "", optionImg: "" },
  ]);

  // handle options input
  const handleHistoryInput = (index, e, type) => {
    e.preventDefault();
    setPollOptions(
      pollOptions.map((each, i) => {
        if (i !== index) {
          return each;
        }
        if (type === "text") {
          return {
            ...each,
            [e.target.name]: e.target.value,
            optionId: `${question}_${index}`,
          };
        } else {
          return {
            ...each,
            [e.target.name]: e.target.files[0],
            optionId: `${question}_${index}`,
          };
        }
      })
    );
  };

  // add to potions
  const handleAddOption = () => {
    setCreatePollError("");
    const newOption = { option: "", optionImg: "" };
    setPollOptions([...pollOptions, newOption]);
  };

  // remove option
  const handleRemoveOption = (index) => {
    setCreatePollError("");
    if (pollOptions.length <= 2) {
      setCreatePollError("You cant have less than two Options");
    } else {
      setPollOptions((prev) => prev.filter((option) => option !== prev[index]));
    }
  };

  const [createPollError, setCreatePollError] = useState("");

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

                  {/* create poll modal  */}
                  <Modal
                    isOpen={createPollModal}
                    onRequestClose={() => setCreatePollModal(false)}
                    id="create-poll-modal"
                    className={`${context.darkMode ? "dm" : ""}`}
                  >
                    <i
                      className="far fa-times-circle"
                      onClick={() => setCreatePollModal(false)}
                    />
                    <h1>New Poll</h1>
                    {createPollView === 1 ? (
                      <>
                        <label htmlFor="type">Poll Type</label>
                        <select
                          name="type"
                          id="type"
                          onChange={(e) => setPollType(e.target.value)}
                        >
                          <option
                            value="election"
                            selected={pollType === "election"}
                          >
                            Election Poll
                          </option>
                          <option
                            value="opinion"
                            selected={pollType === "opinion"}
                          >
                            Opinion Poll
                          </option>
                        </select>
                        <label htmlFor="open">Public / Private</label>
                        <select
                          name="open"
                          id="open"
                          onChange={(e) => setPollOpen(e.target.value)}
                        >
                          <option
                            value="public"
                            selected={pollOpen === "public"}
                          >
                            Public
                          </option>
                          <option
                            value="private"
                            selected={pollOpen === "private"}
                          >
                            Private
                          </option>
                        </select>
                        {pollOpen === "private" && (
                          <div>
                            <label htmlFor="group">Selcet a Group</label>
                            <div
                              className="group-select"
                              onClick={() => setDropdown(!dropdown)}
                            >
                              {group == "" ? "Select Group" : group}
                              {dropdown && (
                                <div className="dropdown">
                                  <h5
                                    onClick={() => {
                                      setCreatePollModal(false);
                                      setCreateGroupModal(true);
                                    }}
                                  >
                                    Create New Group
                                  </h5>
                                  {groups
                                    .filter(
                                      (group) =>
                                        group.userid === context.user._id
                                    )
                                    .map((group, i) => {
                                      return (
                                        <h5
                                          key={i}
                                          onClick={() =>
                                            setGroup(group.groupname)
                                          }
                                        >
                                          {group.groupname}
                                        </h5>
                                      );
                                    })}
                                  <h5>hello</h5>
                                  <h5>hey</h5>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <p id="createPollError">{createPollError}</p>
                        <button
                          onClick={() => {
                            console.log(pollType);
                            if (pollOpen === "private" && group === "") {
                              setCreatePollError(
                                "Please Select a Group, Create one or change poll type to public"
                              );
                            } else {
                              if (pollType === "election") {
                                setCreatePollView(2);
                              } else {
                                setCreatePollModal(false);
                                setOpinionPollModal(true);
                              }
                            }
                          }}
                        >
                          Proceed
                        </button>
                      </>
                    ) : (
                      <>
                        <label htmlFor="title">Poll Title</label>
                        <input
                          type="text"
                          id="title"
                          placeholder="Ex. LASU SUG Presidetial Election"
                          value={pollTitle}
                          onChange={(e) => setPollTitle(e.target.value)}
                        />
                        <div className="row">
                          <div className="col-6">
                            <label htmlFor="start-date">Start Date</label>
                            <input
                              type="date"
                              name="start-date"
                              id="start-date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="col-6">
                            <label htmlFor="end-date">End Date</label>
                            <input
                              type="date"
                              name="end-date"
                              id="end-date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <button>Launch Poll</button>
                      </>
                    )}
                  </Modal>
                  {/* create poll modal  */}
                  <CreateGroupModal
                    createGroupModal={createGroupModal}
                    setCreateGroupModal={setCreateGroupModal}
                  />
                  {/* opinion poll modal  */}
                  <Modal
                    isOpen={opinionPollModal}
                    onRequestClose={() => setOpinionPollModal(false)}
                    id="create-poll-modal"
                    className={`${context.darkMode ? "dm" : ""}`}
                  >
                    <i
                      className="far fa-times-circle"
                      onClick={() => setOpinionPollModal(false)}
                    />
                    <h1>New Poll</h1>
                    <label htmlFor="question">Question</label>
                    <input
                      type="text"
                      placeholder="Ask a question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    {pollOptions.map((option, index) => {
                      return (
                        <div key={index}>
                          <label htmlFor={`option-${index}`}>
                            Option {index + 1}
                          </label>
                          <div className="option d-flex justify-content-between align-items-center mb-4">
                            <input
                              name="option"
                              type="text"
                              placeholder={`Option ${index + 1}`}
                              id={`option-${index}`}
                              value={option.option}
                              onChange={(e) =>
                                handleHistoryInput(index, e, "text")
                              }
                            />
                            <i
                              class="fa-solid fa-trash-can"
                              onClick={() => handleRemoveOption(index)}
                            />
                          </div>
                          <label htmlFor={`option-${index}-img`}>
                            Option {index + 1} Image (optional)
                          </label>
                          {option.optionImg === "" ? (
                            <input
                              type="file"
                              accept="image/*"
                              id={`option-${index}-img`}
                              name="optionImg"
                              onChange={(e) =>
                                handleHistoryInput(index, e, "image")
                              }
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(option.optionImg)}
                              className="img-fluid mb-3"
                              alt=""
                            />
                          )}
                        </div>
                      );
                    })}
                    <div
                      className="d-flex align-items-center mb-4 add-option"
                      onClick={handleAddOption}
                    >
                      <i className="fa-solid fa-circle-plus" />
                      <span>Add Option</span>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label htmlFor="">Start Date</label>
                        <input type="date" />
                      </div>
                      <div className="col-6">
                        <label htmlFor="">End Date</label>
                        <input type="date" />
                      </div>
                    </div>
                    <p id="createPollError">{createPollError}</p>
                    <button onClick={() => console.log(pollOptions)}>
                      Launch Poll
                    </button>
                  </Modal>
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
                <div className="header">
                  <div className="row align-items-center">
                    <div className="col-4">
                      <p>Polls</p>
                    </div>
                    <div className="col-2">
                      <p>Votes</p>
                    </div>
                    <div className="col-2">
                      <p>Start Date</p>
                    </div>
                    <div className="col-2">
                      <p>End Date</p>
                    </div>
                  </div>
                </div>
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

      {/* filter modal */}
      {/* <Modal isOpen={filterModal} onRequestClose={() => setFilterModal(false)} id="polls-modal">
                <div className="header d-flex justify-content-between align-items-center">
                    <i className="fas fa-filter" />
                    <h3 className="mb-0">Filter Polls</h3>
                    <i className="fas fa-times-circle" onClick={() => setFilterModal(false)} />
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <h6>Sort By Popularity</h6>
                        <div>
                            <input type="checkbox" id="trending" />
                            <label htmlFor="trending">Trending Poll</label>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h6>Sort By Category</h6>
                        <div className="mb-3">
                            <input type="checkbox" id="All" />
                            <label htmlFor="All">All</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Presidential" />
                            <label htmlFor="Presidential">Presidential</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Gubernatorial" />
                            <label htmlFor="Gubernatorial">Gubernatorial</label>
                        </div>
                        <div className="mb-3">
                            <input type="checkbox" id="Senatorial" />
                            <label htmlFor="Senatorial">Senatorial</label>
                        </div>
                        <div className="mb">
                            <input type="checkbox" id="house" />
                            <label htmlFor="house">House of Representative</label>
                        </div>
                    </div>
                </div>
                <button>Show Result</button>
            </Modal> */}
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
