import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../dataContext";
import axios from "axios";
import { API } from "../apiRoot";
import SharePollModal from "../sharePollModal";
import OpenPollCandidate2 from "./AspirantCard";
import Modal from "react-modal";
Modal.setAppElement("#root");

function ElectionOpenedPollCard({ poll, setOpened }) {
  // context
  const { context } = useContext(DataContext);

  // modals
  const [sharePollModal, setSharePollModal] = useState(false);
  const [joinPollModal, setJoinPollModal] = useState(false);

  // join poll
  const [joinLoading, setJoinLoading] = useState(false);
  const JoinPoll = () => {
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
        setJoinLoading(false);
        console.log(response);
      },
      (error) => {
        setJoinLoading(false);
        console.log(error);
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

  const [shareLink, setShareLink] = useState(
    `https://polvote.com/polls/${poll._id}`
  );

  const handleSharePollModal = (param) => {
    setSharePollModal(param);
  };

  return (
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
          <p className="mb-0 join" onClick={() => setJoinPollModal(true)}>
            Join Poll
          </p>
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
                <option value="summary">Total summary of election</option>
              </select>
            </div>
          )}
        </div>
        {poll.aspirant.filter((aspirant) => aspirant.status === 1).length ===
        0 ? (
          <h3 className="null">No Aspirant Yet</h3>
        ) : (
          <>
            {poll.aspirant
              .filter((aspirant) => aspirant.status === 1)
              .sort((a, b) => b.votes.length - a.votes.length)
              .map((aspirant, index) => {
                return (
                  <OpenPollCandidate2
                    poll={poll}
                    aspirant={aspirant}
                    totalPoints={totalPoints}
                    key={index}
                  />
                );
              })}
          </>
        )}
      </div>
      <footer className="d-flex justify-content-between align-items-center">
        <p
          onClick={() => {
            if (localStorage.getItem("ballotbox_token") !== null) {
              setShareLink(
                `https://polvote.com/polls/${poll._id}/${context.user._id}`
              );
            } else {
              setShareLink(`https://polvote.com/polls/${poll._id}`);
            }
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
      {sharePollModal && (
        <SharePollModal
          isOpen={sharePollModal}
          handleShareStoryModal={handleSharePollModal}
          shareLink={shareLink}
        />
      )}

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
    </div>
  );
}

export default ElectionOpenedPollCard;
