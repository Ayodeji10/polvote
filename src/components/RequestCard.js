import React, { useState } from "react";
import { API } from "../components/apiRoot";
import axios from "axios";

function RequestCard({ member, id }) {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const accept = () => {
    setAcceptLoading(true);
    axios({
      url: `${API.API_ROOT}/group/acceptmember/${id}`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
      data: { memberid: member.userid },
    }).then(
      (response) => {
        console.log(response);
        // setAcceptLoading(false);
        window.location.reload();
      },
      (error) => {
        console.log(error);
        setAcceptLoading(false);
      }
    );
  };

  const decline = () => {
    setDeclineLoading(true);
    axios({
      url: `${API.API_ROOT}/group/declinemember/${id}`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
      data: { memberid: member.userid },
    }).then(
      (response) => {
        console.log(response);
        // setDeclineLoading(false);
        window.location.reload();
      },
      (error) => {
        console.log(error);
        setDeclineLoading(false);
      }
    );
  };

  return (
    <div className="request">
      <div className="header d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center">
          <div className="img-container">
            {member.userimage === null || member.userimage === undefined ? (
              <img src="/img/place.jpg" alt="avatar" />
            ) : (
              <img src={member.userimage} alt="profile-img" />
            )}
          </div>
          <div>
            <h5>{member.fullname}</h5>
            <div className="d-flex align-items-center">
              <span>{member.username}</span>
              <i className="fa-solid fa-circle" />
              <span>Requested 1day ago</span>
            </div>
          </div>
        </div>
        <div>
          <button className="approve-btn" onClick={accept}>
            {acceptLoading ? (
              <>
                Accepting... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Approve"
            )}
          </button>
          <button className="decline-btn" onClick={decline}>
            {declineLoading ? (
              <>
                Declining... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Decline"
            )}
          </button>
          <i className="fa-solid fa-ellipsis" />
        </div>
      </div>
      {member.verification.length !== 0 && (
        <>
          <p className="mt-3">Membership Verification</p>
          {member.verification.map((v, i) => {
            return (
              <>
                <p>
                  Question {i + 1}: <span>{v.question}</span>
                </p>
                <p>
                  Answer: <span>{v.answer}</span>
                </p>
              </>
            );
          })}
        </>
      )}
    </div>
  );
}

export default RequestCard;
