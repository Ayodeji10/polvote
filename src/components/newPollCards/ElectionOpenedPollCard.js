import React, { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../dataContext";
import axios from "axios";
import { API } from "../apiRoot";
import AspirantCard from "./AspirantCard";
import Modal from "react-modal";
import Loader from "../loader";
Modal.setAppElement("#root");

function ElectionOpenedPollCard({ poll, setOpened, groupLoading, group }) {
  // context
  const { context } = useContext(DataContext);

  // share poll modal
  const [sharePollModal, setSharePollModal] = useState(false);

  // use ref
  const inputRef = useRef();

  const [shareLink, setShareLink] = useState(
    `https://polvote.com/polls/general/${poll._id}`
  );

  const copy = () => {
    navigator.clipboard.writeText(shareLink);
    inputRef.current.select();
  };

  // join poll modal
  const [joinPollModal, setJoinPollModal] = useState(false);
  const [requestSendModal, setRequestSentModal] = useState(false);
  const [error, setError] = useState("");

  // join poll
  const [joinLoading, setJoinLoading] = useState(false);
  const JoinPoll = () => {
    setError("");
    setJoinLoading(true);
    axios({
      url: `${API.API_ROOT}/generalpoll/aspirant/${poll._id}`,
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${context.user.token}`,
      },
    }).then(
      (response) => {
        // console.log(response);
        setJoinLoading(false);
        setJoinPollModal(false);
        setRequestSentModal(true);
      },
      (error) => {
        setJoinLoading(false);
        if (error.response.status === 401) {
          setError(
            "You must be an approved member of the Group to Join a private poll"
          );
        }
        if (error.response.status === 400) {
          setError(
            "The Maximum numebr of allowed aspirants, as specified by the poll administrator, has been exceeded"
          );
        }
        // console.log(error);
      }
    );
  };

  // current unit
  const [currentUnit, setCurrentUnit] = useState(
    () => {
      if (poll.unitpoints.length === 0) {
        return "";
      } else {
        return poll.unitpoints[0].unitname;
      }
    }
    // poll.unitpoints[0].unitname
  );

  // get total unit poll points
  const [totalPoints, setTotalPoints] = useState(0);
  let pollTotal = poll.unitpoints.reduce((total, unit) => {
    let increament = Number(unit.unitpoint);
    total += increament;
    return total;
  }, 0);
  useEffect(() => {
    if (poll.unitpoints.length === 0) {
      setTotalPoints(0.00000001);
    } else {
      setTotalPoints(pollTotal);
    }
  }, [poll]);

  return (
    <>
      {groupLoading ? (
        <Loader pageLoading={groupLoading} />
      ) : (
        <div className="open-poll-card">
          <div className="body">
            <div className="header d-flex justify-content-between align-items-center">
              <div>
                <h3>{poll.polltitle}</h3>
                <p className="mb-0">
                  {poll.isGenralunit === "no" && poll.polltype === "private" ? (
                    <>
                      {currentUnit === "summary"
                        ? `Total Points = ${totalPoints} Points`
                        : `${
                            poll.unitpoints.filter(
                              (unit) => unit.unitname === currentUnit
                            )[0].unitname
                          } Points = ${
                            poll.unitpoints.filter(
                              (unit) => unit.unitname === currentUnit
                            )[0].unitpoint
                          } Points`}
                    </>
                  ) : (
                    `${poll.votes.length} Total Votes`
                  )}
                </p>
              </div>
              {poll.aspirant.filter(
                (aspirant) => aspirant.userid === context.user._id
              ).length === 0 && (
                <p className="mb-0 join" onClick={() => setJoinPollModal(true)}>
                  Join Poll
                </p>
              )}

              {poll.isGenralunit === "no" && (
                <div className="d-flex align-items-center">
                  <select
                    name="type"
                    id="type"
                    onChange={(e) => setCurrentUnit(e.target.value)}
                  >
                    {poll.unitpoints.map((unit, i) => {
                      return (
                        <option
                          key={i}
                          value={unit.unitname}
                          // selected={currentUnit === unit.unitid}
                        >
                          {unit.unitname}
                        </option>
                      );
                    })}
                    {/* <option value="summary">Total summary of election</option> */}
                  </select>
                </div>
              )}
            </div>
            {poll.aspirant.filter((aspirant) => aspirant.status === 1)
              .length === 0 ? (
              <h3 className="null">No Aspirant Yet</h3>
            ) : (
              <>
                {poll.aspirant
                  .filter((aspirant) => aspirant.status === 1)
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((aspirant, index) => {
                    return (
                      <AspirantCard
                        poll={poll}
                        aspirant={aspirant}
                        totalPoints={totalPoints}
                        key={index}
                        currentUnit={currentUnit}
                        group={group}
                      />
                    );
                  })}
              </>
            )}
          </div>
          <footer className="d-flex justify-content-between align-items-center">
            <p
              onClick={() => {
                // if (localStorage.getItem("ballotbox_token") !== null) {
                //   setShareLink(
                //     `https://polvote.com/polls/${poll._id}/${context.user._id}`
                //   );
                // } else {
                //   setShareLink(`https://polvote.com/polls/${poll._id}`);
                // }
                setSharePollModal(true);
              }}
              className="mb-0"
            >
              <i className="fas fa-share-alt" />
              Share Poll
            </p>
            {window.location.pathname === "/polls" && (
              <p onClick={() => setOpened(false)} className="mb-0">
                Close Poll<i class="fa-solid fa-angle-up"></i>
              </p>
            )}
          </footer>
          {/* share modal  */}
          <Modal
            isOpen={sharePollModal}
            onRequestClose={() => setSharePollModal(false)}
            id="poll-share-modal"
            className={`${context.darkMode ? "dm" : ""}`}
          >
            <i
              className="fas fa-times"
              onClick={() => setSharePollModal(false)}
            />
            <h1>See who’s Leading the Poll</h1>
            <p>
              You can explore Politics, Learn and Share Insights Online on
              Polvote
            </p>
            <h3>Share on:</h3>
            <div className="row mb-5">
              <div className="col-3">
                <a href="https://web.facebook.com" target="_blank">
                  <img
                    src="/img/facebook.png"
                    alt="facebook"
                    className="img-fluid"
                  />
                </a>
              </div>
              <div className="col-3">
                <a href="https://web.whatsapp.com" target="_blank">
                  <img
                    src="/img/Whatsapp.png"
                    alt="whatsapp"
                    className="img-fluid"
                  />
                </a>
              </div>
              <div className="col-3">
                <a href="https://twitter.com/home" target="_blank">
                  <img
                    src="/img/twit.png"
                    alt="twitter"
                    className="img-fluid"
                  />
                </a>
              </div>
              <div className="col-3">
                <a href="https://www.instagram.com" target="_blank">
                  <img
                    src="/img/Instagram.png"
                    alt="instagram"
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
            <h3>Copy Link</h3>
            <div className="link d-flex justify-content-between align-items-center">
              <input type="text" ref={inputRef} value={shareLink} />
              <img src="/img/Group 111.png" alt="copy" onClick={copy} />
            </div>
          </Modal>

          {/* join poll modal */}
          <Modal
            isOpen={joinPollModal}
            onRequestClose={() => joinPollModal(false)}
            id="joinPollModal"
            className={`${context.darkMode ? "dm" : ""}`}
          >
            <i
              className="fa-solid fa-circle-xmark"
              onClick={() => setJoinPollModal(false)}
            />
            <h3>Join Poll</h3>
            <p>Are you sure you want to join this poll?</p>
            <h6 className="error-msg mb-3">{error}</h6>
            <div className="d-flex align-items-center justify-content-between">
              <button className="no" onClick={() => setJoinPollModal(false)}>
                No
              </button>
              <button className="yes" onClick={JoinPoll}>
                {joinLoading ? (
                  <i className="fa-solid fa-spinner fa-spin" />
                ) : (
                  "Yes"
                )}
              </button>
            </div>
          </Modal>

          {/* join request sent modal */}
          <Modal
            isOpen={requestSendModal}
            onRequestClose={() => setRequestSentModal(false)}
            id="joinPollModal"
            className={`${context.darkMode ? "dm" : ""}`}
          >
            <i
              className="fa-solid fa-circle-xmark"
              onClick={() => setRequestSentModal(false)}
            />
            <img
              src="/img/done.png"
              alt="successful"
              className="mx-auto d-block mb-3"
            />
            <h3>Join Poll</h3>
            <p>
              Your request to join the poll has been sent to the admin. We will
              notify you once it has been approved.
            </p>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ElectionOpenedPollCard;
