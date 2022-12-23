import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";

function GroupMemberCard({ member, group, id }) {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const remove = () => {
    setLoading(true);
    axios({
      url: `${API.API_ROOT}/group/removemember/${id}`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
      data: { memberid: member.userid },
    }).then(
      (response) => {
        console.log(response);
        setLoading(false);
        // window.location.reload();
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="request">
      <div className="header d-flex align-items-center justify-content-between gap-2">
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
              <span> Requested 1day ago</span>
            </div>
          </div>
        </div>
        <div>
          {group.units.length !== 0 && (
            <>
              <h5 className="text-center">Unit</h5>
              <p className="text-center mb-0">
                {member.unitname === "" ||
                member.unitname === null ||
                member.unitname === undefined
                  ? "-"
                  : member.unitname}
                {/* {group.units.filter((unit) => unit._id === member.unitid)[0].unit} */}
              </p>
            </>
          )}
        </div>
        <div className="d-flex flex-md-row flex-md-row flex-column">
          <button
            className="approve-btn mb-md-0 mb-2"
            onClick={() => navigate(`/user/${member.userid}`)}
          >
            View Profile
          </button>
          {group.userid === context.user._id && (
            <button onClick={remove} className="decline-btn">
              {loading ? (
                <>
                  loading... <i className="fa-solid fa-spinner fa-spin" />
                </>
              ) : (
                "Remove from Group"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupMemberCard;
