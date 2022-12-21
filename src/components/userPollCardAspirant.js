import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import axios from "axios";

function UserPollCardAspirant({ poll, aspirant }) {
  // context
  const { context, setContext } = useContext(DataContext);

  // approve aspirant
  const [approveLoading, setApproveLoading] = useState(false);
  const approve = () => {
    setApproveLoading(true);
    axios({
      url: `${API.API_ROOT}/generalpoll/approveaspirant/${poll._id}`,
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${context.user.token}`,
      },
      data: {
        aspid: aspirant._id,
        userid: aspirant.userid,
      },
    }).then(
      (response) => {
        console.log(response);
        setApproveLoading(false);
      },
      (error) => {
        console.log(error);
        setApproveLoading(false);
      }
    );
  };

  // decline aspirant
  const [declineLoading, setDeclineLoading] = useState(false);
  const Decline = () => {
    setDeclineLoading(true);
    axios({
      url: `${API.API_ROOT}/generalpoll/declineaspirant/${poll._id}`,
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${context.user.token}`,
      },
      data: {
        aspid: aspirant._id,
        userid: aspirant.userid,
      },
    }).then(
      (response) => {
        console.log(response);
        setDeclineLoading(false);
      },
      (error) => {
        console.log(error);
        setDeclineLoading(false);
      }
    );
  };

  return (
    <div className="user-poll-aspirant">
      <div className="row">
        <div className="col-7 d-flex align-items-center">
          <div className="img-container">
            <img src={aspirant.image} alt="" />
          </div>
          <p className="mb-0">
            {aspirant.firstname} {aspirant.lastname}
          </p>
        </div>
        <div className="col-3 d-flex align-items-center justify-content-between">
          <button className="accept" onClick={approve}>
            {approveLoading ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              "Approve"
            )}
          </button>
          <button className="decline" onClick={Decline}>
            {declineLoading ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              "Decline"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPollCardAspirant;
