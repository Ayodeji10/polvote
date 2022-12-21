import React, { useState } from "react";
import UserPollCardAspirant from "./userPollCardAspirant";

function UserPollCard({ poll }) {
  const [aspirantView, setAspirantView] = useState(false);

  return (
    <div className="user-poll-card">
      <div className="row align-items-center">
        <div className="col-lg-3">
          <h3>
            {poll.category === "election" ? poll.polltitle : poll.question}
          </h3>
          <p className="mb-0">{poll.polltype}</p>
        </div>
        <div className="col-lg-4">
          <div className="row">
            <div className="col-lg-4">
              <h3>Total Votes</h3>
              <p className="mb-0">
                {poll.votes.length} Vote
                {poll.votes.length === 0 || (poll.votes.length > 1 && "s")}
              </p>
            </div>
            <div className="col-lg-4">
              <h3>Start Date</h3>
              <p className="mb-0">{poll.startdate}</p>
            </div>
            <div className="col-lg-4">
              <h3>End Date</h3>
              <p className="mb-0">{poll.enddate}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-5 d-flex justify-content-between">
          <h3 className="mb-0 edit">Edit Poll</h3>
          <p
            style={{ cursor: "pointer" }}
            className="mb-0"
            onClick={() => setAspirantView(!aspirantView)}
          >
            Poll Requests
            <i class="fa-solid fa-angle-down"></i>
          </p>
          <p className="mb-0">
            Open Poll
            <i className="fa-solid fa-angle-right" />
          </p>
        </div>
      </div>
      {aspirantView && (
        <>
          {poll.aspirant.map((aspirant, index) => {
            return (
              <UserPollCardAspirant
                poll={poll}
                aspirant={aspirant}
                key={index}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default UserPollCard;
