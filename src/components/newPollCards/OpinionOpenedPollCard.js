import React, { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../dataContext";
import Modal from "react-modal";
import OptionsCard from "./optionsCard";
import Loader from "../loader";
Modal.setAppElement("#root");

function OpinionOpenedPollCard({ poll, setOpened, groupLoading, group }) {
  // context
  const { context } = useContext(DataContext);

  // modals
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
                    {/* <option value="summary">Total summary of election</option> */}
                  </select>
                )}
              </div>
            </div>
            {/* options array  */}
            {poll.unitpoints.length === 0 ? (
              <>
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
              </>
            ) : (
              <>
                {/* sort according to units with most vote */}
                {poll.options
                  .sort(
                    (a, b) =>
                      b.votes.filter(
                        (vote) =>
                          vote.unitid ===
                          group.units.filter(
                            (unit) => unit.unit === currentUnit
                          )[0]._id
                      ).length -
                      a.votes.filter(
                        (vote) =>
                          vote.unitid ===
                          group.units.filter(
                            (unit) => unit.unit === currentUnit
                          )[0]._id
                      ).length
                  )
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
        </div>
      )}
    </>
  );
}

export default OpinionOpenedPollCard;
