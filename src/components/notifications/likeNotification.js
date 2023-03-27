import React, { useState, useEffect } from "react";
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
        navigate(`/stories/.../${not.itemid}`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  // get time stamp
  const [storytime, setStoryTIme] = useState("");
  const [storyDate, setStoryDate] = useState("");

  const getDate = () => {
    let today = new Date(); // today's date
    let d = new Date(not.createdAt); // story date

    // get days differenece
    const time = Math.abs(today - d);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));

    // set date
    if (days <= 1) {
      setStoryTIme(
        `${
          parseInt(not.createdAt.substring(11, 13)) + 1
        }${not.createdAt.substring(13, 16)} ${
          not.createdAt.substring(11, 13) >= 12 ? "PM" : "AM"
        }`
      );
    } else {
      if (days < 30) {
        setStoryDate(`${days - 1} day${days - 1 > 1 ? "s" : ""} ago`);
      } else {
        setStoryDate(
          `${not.createdAt.substring(8, 10)}-${not.createdAt.substring(
            5,
            7
          )}-${not.createdAt.substring(0, 4)}`
        );
      }
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  return (
    <div className="row" onClick={changeStatus}>
      <div className="col-lg-2">
        <div
          className={`d-flex align-items-center justify-content-${
            not.status === 0 ? "between" : "end"
          }`}
        >
          {not.status === 0 && <i className="fa-solid fa-circle" />}

          {/* <i className="fa-solid fa-circle" /> */}
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
      <div className="col-lg-8">
        <p>
          <span>{not.userfullname}</span> liked your post
        </p>
      </div>
      <div className="col-lg-2">
        {storyDate && <h4>{storyDate}</h4>}
        {storytime && <h4 className="mb-0">{storytime}</h4>}
        {/* <i className="fa-solid fa-ellipsis" /> */}
      </div>
    </div>
  );
}

export default LikeNotification;
