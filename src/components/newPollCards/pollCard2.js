import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { API } from "../../components/apiRoot";
import { DataContext } from "../../dataContext";
import ElectionOpenedPollCard from "./ElectionOpenedPollCard";
import OpinionOpenedPollCard from "./OpinionOpenedPollCard";
// import SharePollModal from './sharePollModal';
Modal.setAppElement("#root");

function PollCard2({ poll }) {
  // context
  const { context } = useContext(DataContext);

  // card state
  const [opened, setOpened] = useState(false);

  // fech poll group
  const [group, setGroup] = useState({});
  const [groupLoading, setGroupLoading] = useState(true);
  const fetchCurrentGroup = () => {
    if (poll.groupid === null || poll.groupid === undefined) {
      setGroupLoading(false);
    } else {
      axios
        .get(`${API.API_ROOT}/group/${poll.groupid}`, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
          },
        })
        .then((response) => {
          setGroup(response.data);
          setGroupLoading(false);
          // console.log(`${response.data.groupname}: `, response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetchCurrentGroup();
  }, []);

  if (opened) {
    return (
      <>
        {poll.category === "opinion" ? (
          <OpinionOpenedPollCard
            groupLoading={groupLoading}
            group={group}
            poll={poll}
            setOpened={setOpened}
          />
        ) : (
          <ElectionOpenedPollCard
            groupLoading={groupLoading}
            group={group}
            poll={poll}
            setOpened={setOpened}
          />
        )}
      </>
    );
  }

  return (
    <div className="poll">
      <div className="row align-items-center">
        <div className="col-4">
          <h3>
            {poll.category === "election"
              ? `${poll.polltitle}`
              : `${poll.question}`}
          </h3>
          <h6>{poll.category}</h6>
        </div>
        <div className="col-2">
          <p className="tr">Total Votes</p>
          <h6>{poll.votes.length} Polls</h6>
        </div>
        <div className="col-2">
          <p className="tr">Start Date</p>
          <h6>{poll.startdate}</h6>
        </div>
        <div className="col-2">
          <p className="tr">End Date</p>
          <h6>{poll.enddate}</h6>
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

export default PollCard2;
