import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";
import JoinGroupModals from "./joinGroupModals";
import RecStoriesSkeleton from "../skeletons/recStoriesSkeleton";
import RecommendedGroupCard from "./recommendedGroupCard";

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
            .map((group, index) => {
              return <RecommendedGroupCard group={group} key={index} />;
            })}
        </>
      )}
    </div>
  );
}

export default RecommendedGroups;
