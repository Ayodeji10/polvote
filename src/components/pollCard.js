import React, { useState } from "react";
import OpenedPollCard from "./openedPollsCard";
import Modal from "react-modal";
// import SharePollModal from './sharePollModal';
Modal.setAppElement("#root");

function PollCard({ poll, pollVotes, liveVotes, fetchPolls }) {
  // card state
  const [opened, setOpened] = useState(false);

  if (opened) {
    return (
      <OpenedPollCard
        poll={poll}
        liveVotes={liveVotes}
        pollVotes={pollVotes}
        setOpened={setOpened}
        fetchPolls={fetchPolls}
      />
    );
  }

  return (
    <div className="poll">
      <div className="row align-items-center">
        <div className="col-4">
          <h3>{poll.polltitle}</h3>
          <h6>{poll.category}</h6>
        </div>
        <div className="col-2">
          <p className="tr">Total Votes</p>
          <h6>{pollVotes.toFixed(0)} Polls</h6>
        </div>
        <div className="col-2">
          <p className="tr">Start Date</p>
          <h6>{poll.startdate.substring(0, 10)}</h6>
        </div>
        <div className="col-2">
          <p className="tr">End Date</p>
          <h6>{poll.enddate.substring(0, 10)}</h6>
        </div>
        <div className="col-2 d-flex align-items-center">
          <h6 id="open-poll" onClick={() => setOpened(true)}>
            Open Poll
            <i className="fa-solid fa-angle-down" />
          </h6>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
