import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";

function UnitMemberCard({ member, unit, id }) {
  // history
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const removeMember = () => {
    setLoading(true);
    axios({
      url: `${API.API_ROOT}/group/removeunit/${id}`,
      method: "patch",
      data: {
        memberid: member.userid,
        unitid: unit._id,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        // window.location.reload();
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <div className="row mt-3 align-items-center member">
      <div className="col-lg-7 col-md-7 col-sm-7 col-7">
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
              <span>Joined 1day ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-5 col-md-5 col-sm-5 col-5 d-flex justify-content-end">
        <button
          className="approve-btn"
          onClick={() => navigate(`/user/${member.userid}`)}
        >
          View Profile
        </button>
        <button className="decline-btn" onClick={removeMember}>
          {loading ? (
            <>
              Loading... <i className="fa-solid fa-spinner fa-spin" />
            </>
          ) : (
            "Remove"
          )}
        </button>
      </div>
    </div>
  );
}

export default UnitMemberCard;
