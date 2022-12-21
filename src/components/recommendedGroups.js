import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";
import RecStoriesSkeleton from "../skeletons/recStoriesSkeleton";

function RecommendedGroups() {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // fetch stories and aspirants
  const [groups, setGroups] = useState([]);
  const [groupFetch, setGroupFetch] = useState(true);

  const fetchGroups = () => {
    axios
      .get(`${API.API_ROOT}/group`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        setGroups(response.data);
        setGroupFetch(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="story-recomentdations mb-3">
      <h2>Recommended Groups</h2>
      {groupFetch ? (
        <>
          {[1, 2, 3, 4, 5].map((n) => {
            return <RecStoriesSkeleton key={n} />;
          })}
        </>
      ) : (
        <>
          {groups
            // .slice(0) ///slice(0) at the beginning is to duplicate the stories array
            .filter((group) => group.userid !== context.user._id)
            .sort(function () {
              return 0.5 - Math.random();
            })
            .slice(0, 5)
            .map((each, index) => {
              return (
                <div className="story row" key={index}>
                  <div className="col-2">
                    <div className="img-container">
                      {/* {each.image === null || each.image === undefined ? (
                        <img
                          src="/img/place.jpg"
                          className="img-fluid"
                          alt="avatar"
                          id="profile-img"
                        />
                      ) : (
                        <img src={each.image} alt="avatar" id="profile-img" />
                      )} */}
                      {each.image !== null && each.image !== undefined ? (
                        <img src={each.image} alt="profile-img" />
                      ) : (
                        <img src="/img/place.jpg" alt="profile-img" />
                      )}
                    </div>
                  </div>
                  <div className="col-10 details">
                    <h3>{each.groupname}</h3>
                    <div className="mb-2 d-flex align-items-center">
                      <h4>{each.username}</h4>
                      <i className="fa-solid fa-circle" />
                      <h4>20k members</h4>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/stories/${each.story
                            .replace(/(<([^>]+)>)/gi, "")
                            .replaceAll(" ", "-")
                            .replaceAll("?", "")
                            .substring(0, 45)}/${each._id}`
                        )
                      }
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}

export default RecommendedGroups;
