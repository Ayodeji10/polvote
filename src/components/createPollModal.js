import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import CreateGroupModal from "./createGroupModal";
import Modal from "react-modal";
Modal.setAppElement("#root");

function CreatePollModal({ createPollModal, setCreatePollModal }) {
  // context
  const { context } = useContext(DataContext);

  const [createPollView, setCreatePollView] = useState(1);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  // states
  // general
  const [pollType, setPollType] = useState("election");
  const [pollOpen, setPollOpen] = useState("public");
  const [showgeneral, setShowgeneral] = useState(true);
  const [group, setGroup] = useState("");
  const [groupId, setGroupId] = useState("");
  const [useSamePoint, setUseSamePoint] = useState("yes");
  const [samePoint, setSamePoint] = useState("");
  const [groupUnits, setGroupUnits] = useState([]);

  // election poll
  const [pollTitle, setPollTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aspirantlimit, setAspirantlimit] = useState("");

  // opinion poll
  const [question, setQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { option: "", optionImg: "" },
    { option: "", optionImg: "" },
  ]);

  // dropdown
  const [dropdown, setDropdown] = useState(false);

  //   fetch groups
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
        // console.log(response);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const navigatePollView = () => {
    if (pollOpen === "private") {
      if (
        group === "" ||
        (useSamePoint === "yes" && samePoint === "")
        // (groups.filter((group) => group._id === groupId)[0].units.length !==
        //   0 &&
        //   useSamePoint === "no")
      ) {
        setCreatePollError(
          "Please Select a Group, Create one or change poll type to public. Also specify unit point if it applies"
        );
      } else {
        if (useSamePoint === "no") {
          setCreatePollError("");
          setCreatePollView(4);
        } else {
          setCreatePollError("");
          if (pollType === "election") {
            setCreatePollView(2);
          } else {
            setCreatePollView(3);
          }
          // setCreatePollView(2);
        }
      }
    } else {
      setCreatePollError("");
      if (pollType === "election") {
        setCreatePollView(2);
      } else {
        setCreatePollView(3);
      }
    }
  };

  // handle options input
  const handleHistoryInput = (index, e, type) => {
    e.preventDefault();
    setPollOptions(
      pollOptions.map((each, i) => {
        if (i !== index) {
          return each;
        }
        if (type === "text") {
          return { ...each, [e.target.name]: e.target.value };
        } else {
          return { ...each, [e.target.name]: e.target.files[0] };
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

  // create poll
  const [createPollError, setCreatePollError] = useState("");
  const [createPollLoading, setCreatePollLoading] = useState(false);

  // create opinion poll
  const crreateOpinionPoll = () => {
    if (question === "" || startDate === "" || endDate === "") {
      setCreatePollError("Please fill all Input spaces");
    } else {
      setCreatePollLoading(true);
      setCreatePollError("");
      const fd = new FormData();

      fd.append("polltype", pollOpen);
      fd.append("category", pollType);
      fd.append("showgeneral", showgeneral);
      fd.append("startdate", startDate);
      fd.append("pollcreatorid", context.user._id);
      fd.append("enddate", endDate);
      fd.append("question", question);
      for (const key of Object.keys(pollOptions)) {
        fd.append(`options[${key}][image]`, pollOptions[key].optionImg);
        fd.append(`options[${key}][option]`, pollOptions[key].option);
      }
      if (pollOpen === "private") {
        fd.append("groupid", groupId);
        fd.append("isGenralunit", useSamePoint);
        if (
          useSamePoint === "yes" ||
          groups.filter((group) => group._id === groupId)[0].units.length === 0
        ) {
          fd.append("unitpoint", samePoint);
        }
        if (
          groups.filter((group) => group._id === groupId)[0].units.length !==
            0 &&
          useSamePoint === "no"
        ) {
          for (const key of Object.keys(groupUnits)) {
            fd.append(`unitpoints[${key}][unitid]`, groupUnits[key].unitid);
            fd.append(
              `unitpoints[${key}][unitpoint]`,
              groupUnits[key].unitpoint
            );
            fd.append(`unitpoints[${key}][unitname]`, groupUnits[key].unitname);
          }
        }
      }

      // console.log(Array.from(fd));

      axios({
        url: `${API.API_ROOT}/generalpoll`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          console.log(response);
          window.location.reload();
          // setCreatePollLoading(false);
        },
        (error) => {
          console.log(error);
          setCreatePollLoading(false);
        }
      );
    }
  };

  // create Election Poll
  const createElectionPoll = () => {
    console.log(pollOpen, pollType, groupUnits, groupId, startDate, endDate);
    if (pollTitle === "" || startDate === "" || endDate === "") {
      setCreatePollError("Please fill all Input spaces");
    } else {
      setCreatePollError("");
      setCreatePollLoading(true);
      const fd = new FormData();
      fd.append("polltype", pollOpen);
      fd.append("category", pollType);
      fd.append("showgeneral", showgeneral);
      fd.append("polltitle", pollTitle);
      fd.append("aspirantlimit", aspirantlimit);
      fd.append("pollcreatorid", context.user._id);
      fd.append("startdate", startDate);
      fd.append("enddate", endDate);
      if (pollOpen === "private") {
        fd.append("groupid", groupId);
        fd.append("isGenralunit", useSamePoint);
        if (
          useSamePoint === "yes" ||
          groups.filter((group) => group._id === groupId)[0].units.length === 0
        ) {
          fd.append("unitpoint", samePoint);
        }
        if (
          groups.filter((group) => group._id === groupId)[0].units.length !==
            0 &&
          useSamePoint === "no"
        ) {
          for (const key of Object.keys(groupUnits)) {
            fd.append(`unitpoints[${key}][unitid]`, groupUnits[key].unitid);
            fd.append(
              `unitpoints[${key}][unitpoint]`,
              groupUnits[key].unitpoint
            );
            fd.append(`unitpoints[${key}][unitname]`, groupUnits[key].unitname);
          }
        }
      }
      // console.log(Array.from(fd));

      axios({
        url: `${API.API_ROOT}/generalpoll`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          console.log(response);
          window.location.reload();
          // setCreatePollLoading(false);
        },
        (error) => {
          console.log(error);
          setCreatePollLoading(false);
        }
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={createPollModal}
        onRequestClose={() => {
          setCreatePollView(1);
          setCreatePollModal(false);
        }}
        id="create-poll-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        {/* screens 2 and 4 back button  */}
        {createPollView === 2 || createPollView === 4 ? (
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => setCreatePollView(1)}
          />
        ) : (
          ""
        )}

        {/* screen 3 back button  */}
        {createPollView === 3 && (
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => {
              if (useSamePoint === "no") {
                setCreatePollView(4);
              } else {
                setCreatePollView(1);
              }
            }}
          />
        )}

        <i
          className="far fa-times-circle"
          onClick={() => {
            setCreatePollView(1);
            setCreatePollModal(false);
          }}
        />
        <h1>New Poll</h1>

        {/* general settings  */}
        {createPollView === 1 && (
          <>
            <label htmlFor="type">Poll Type</label>
            <select
              name="type"
              id="type"
              onChange={(e) => setPollType(e.target.value)}
            >
              <option value="election" selected={pollType === "election"}>
                Election Poll
              </option>
              <option value="opinion" selected={pollType === "opinion"}>
                Opinion Poll
              </option>
            </select>
            <label htmlFor="visibility">Allow poll visible to everyone?</label>
            <select
              id="visibility"
              onChange={(e) => setShowgeneral(e.target.value)}
            >
              <option value={false} selected={showgeneral === false}>
                No
              </option>
              <option value={true} selected={showgeneral === true}>
                Yes
              </option>
            </select>
            {pollType === "election" && (
              <>
                <label htmlFor="amount">
                  Kindly specify the maximum number of users allowed to join the
                  poll as aspirants
                </label>
                <input
                  type="number"
                  id="amount"
                  placeholder="4"
                  value={aspirantlimit}
                  onChange={(e) => setAspirantlimit(e.target.value)}
                />
              </>
            )}
            <label htmlFor="open">Public / Group</label>
            <select
              name="open"
              id="open"
              onChange={(e) => setPollOpen(e.target.value)}
            >
              <option value="public" selected={pollOpen === "public"}>
                Public
              </option>
              <option value="private" selected={pollOpen === "private"}>
                Group
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
                      {groups
                        .filter((group) => group.userid === context.user._id)
                        .map((group, i) => {
                          return (
                            <h5
                              key={i}
                              onClick={() => {
                                setGroup(group.groupname);
                                setGroupId(group._id);
                                setGroupUnits(() => {
                                  return group.units.map((unit) => {
                                    return {
                                      unitname: unit.unit,
                                      unitid: unit._id,
                                      unitpoint: "",
                                    };
                                  });
                                });
                              }}
                            >
                              {group.groupname}
                            </h5>
                          );
                        })}
                      <h5
                        onClick={() => {
                          setCreateGroupModal(true);
                          //   setCreatePollModal(false);
                        }}
                      >
                        Create New Group
                      </h5>
                    </div>
                  )}
                </div>
                {groupId && (
                  <>
                    {groups.filter((group) => group._id === groupId)[0].units
                      .length > 1 && (
                      <>
                        <label htmlFor="points">
                          Would you like to allocate the same point to all group
                          units?
                        </label>
                        <select
                          name="type"
                          id="type"
                          onChange={(e) => setUseSamePoint(e.target.value)}
                        >
                          <option value="yes" selected={useSamePoint === "yes"}>
                            Yes
                          </option>
                          <option value="no" selected={useSamePoint === "no"}>
                            No
                          </option>
                        </select>
                      </>
                    )}
                  </>
                )}
                {useSamePoint === "yes" ||
                groups.filter((group) => group._id === groupId)[0].units
                  .length === 0 ? (
                  <>
                    <label htmlFor="samepoint">Unit Point</label>
                    <input
                      type="number"
                      id="samepoint"
                      placeholder="Enter point"
                      value={samePoint}
                      onChange={(e) => setSamePoint(e.target.value)}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
            <p id="createPollError">{createPollError}</p>
            <button onClick={navigatePollView}>Proceed</button>
          </>
        )}

        {/* election poll  */}
        {createPollView === 2 && (
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
            <h6 className="error mb-3">{createPollError}</h6>
            <button onClick={createElectionPoll}>
              {createPollLoading ? (
                <>
                  Launching Poll...
                  <i className="fa-solid fa-spinner fa-spin" />
                </>
              ) : (
                "Launch Poll"
              )}
            </button>
          </>
        )}

        {/* opinion poll  */}
        {createPollView === 3 && (
          <>
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
                  <label htmlFor={`option-${index}`}>Option {index + 1}</label>
                  <div className="option d-flex justify-content-between align-items-center mb-4">
                    <input
                      name="option"
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      id={`option-${index}`}
                      value={option.option}
                      onChange={(e) => handleHistoryInput(index, e, "text")}
                    />
                    <i
                      class="fa-solid fa-trash-can"
                      onClick={() => handleRemoveOption(index)}
                    />
                  </div>
                  <label htmlFor={`option-${index}-img`}>
                    Option {index + 1} Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id={`option-${index}-img`}
                    name="optionImg"
                    hidden={option.optionImg !== ""}
                    onChange={(e) => handleHistoryInput(index, e, "image")}
                  />
                  {option.optionImg !== "" && (
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
                <label htmlFor="sd">Start Date</label>
                <input
                  type="date"
                  id="sd"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="ed">End Date</label>
                <input
                  type="date"
                  id="ed"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <p id="createPollError">{createPollError}</p>
            <button onClick={crreateOpinionPoll}>
              {createPollLoading ? (
                <>
                  Launching Poll...
                  <i className="fa-solid fa-spinner fa-spin" />
                </>
              ) : (
                "Launch Poll"
              )}
            </button>
          </>
        )}

        {/* unit scores */}
        {createPollView === 4 && (
          <>
            <div className="row">
              <div className="col-9">
                <label htmlFor="">Group Unit</label>
              </div>
              <div className="col-3">
                <label htmlFor="">Points</label>
              </div>
            </div>
            {groupUnits.map((unit, i) => {
              return (
                <div className="row point align-items-center mb-3" key={i}>
                  <div className="col-8">
                    <h4>{unit.unitname}</h4>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      placeholder="Enter point"
                      value={unit.unitpoint}
                      onChange={(e) => {
                        setGroupUnits(
                          groupUnits.map((each, index) => {
                            if (i !== index) {
                              return each;
                            } else {
                              return {
                                ...each,
                                unitpoint: e.target.value,
                              };
                            }
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => {
                if (pollType === "election") {
                  setCreatePollView(2);
                } else {
                  setCreatePollView(3);
                }
              }}
            >
              Proceed
            </button>
          </>
        )}
      </Modal>

      {/* create group modal  */}
      {createGroupModal && (
        <CreateGroupModal
          createGroupModal={createGroupModal}
          setCreateGroupModal={setCreateGroupModal}
        />
      )}
    </>
  );
}

export default CreatePollModal;
