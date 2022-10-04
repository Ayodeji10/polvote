import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../apiRoot";

function LikeNotification({ not }) {
  // history
  const navigate = useNavigate();

  const changeStatus = () => {
    // axios
    //   .patch(`${API.API_ROOT}/notification/update/${not._id}`, {
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     // navigate(`/stories/.../${not.itemid}`)
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    axios({
      url: `${API.API_ROOT}/notification/update/${not._id}`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="row" onClick={changeStatus}>
      <div className="col-lg-2">
        <div className="d-flex align-items-center justify-content-between">
          <i className="fa-solid fa-circle" />
          <div className="img-container">
            {not.userimage === null || not.userimage === undefined ? (
              <img
                src="/img/place.jpg"
                className="img-fluid"
                alt="avatar"
                id="profile-img"
              />
            ) : (
              <img src={not.userimage} alt="profile-img" id="profile-img" />
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-9">
        <p>
          <span>{not.userfullname}</span> liked your post
        </p>
      </div>
      <div className="col-lg-1">
        <h4>3d</h4>
        <i className="fa-solid fa-ellipsis" />
      </div>
    </div>
  );
}

export default LikeNotification;
