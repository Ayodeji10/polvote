import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../dataContext";
import SharePollModal from "../sharePollModal";
import Modal from "react-modal";
import OptionsCard from "./optionsCard";
import Loader from "../loader";
Modal.setAppElement("#root");

function OpinionOpenedPollCard({ poll, setOpened, groupLoading, group }) {
  // context
  const { context } = useContext(DataContext);

  // modals
  const [sharePollModal, setSharePollModal] = useState(false);

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
    <>
      {groupLoading ? (
        <Loader pageLoading={groupLoading} />
      ) : (
        <div className="open-poll-card">
          <div className="body">
            <div className="header d-flex justify-content-between align-items-center">
              <div>
                <h3>{poll.question}</h3>
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
              <div className="d-flex align-items-center">
                {poll.isGenralunit === "no" && (
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
                )}
              </div>
            </div>
            {poll.options
              .sort((a, b) => b.votes.length - a.votes.length)
              .map((option, index) => {
                return (
                  <OptionsCard
                    poll={poll}
                    option={option}
                    key={index}
                    currentUnit={currentUnit}
                    group={group}
                  />
                );
              })}
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
        </div>
      )}
    </>
  );
}

export default OpinionOpenedPollCard;
