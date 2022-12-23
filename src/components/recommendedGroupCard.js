import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import axios from "axios";
import cogoToast from "cogo-toast";
import JoinGroupModals from "./joinGroupModals";

function RecommendedGroupCard({ group }) {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  const [unitModal, setUnitModal] = useState(false);
  const [memberAnswerModal, setMemberAnswerModal] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const newQuestions = group.questions.map((question) => ({
      question: question,
      answer: "",
    }));
    setQuestions(newQuestions);
  }, []);

  // join group
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const joinGroup = () => {
    setLoading(true);
    axios({
      url: `${API.API_ROOT}/group/groupjoin`,
      method: "post",
      data: {
        groupid: group._id,
        groupname: group.groupname,
        grouptype: group.grouptype,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        // setLoading(false);
        navigate(`/groups/${group._id}`);
        // window.location.reload();
      },
      (error) => {
        // console.log(error);
        if (error.response.status === 403) {
          cogoToast.error(
            "The Group Admin Has blocked you from Joining this Group"
          );
        } else {
          setError("Something went wrong, please try again");
        }
        setLoading(false);
      }
    );
  };

  return (
    <div className="story row">
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
          {group.image !== null && group.image !== undefined ? (
            <img src={group.image} alt="profile-img" />
          ) : (
            <img src="/img/place.jpg" alt="profile-img" />
          )}
        </div>
      </div>
      <div className="col-10 details">
        <h3>{group.groupname}</h3>
        <div className="mb-2 d-flex align-items-center">
          <h4>{group.username}</h4>
          <i className="fa-solid fa-circle" />
          <h4>
            {group.members.length} member
            {group.members.length === 0 || (group.members.length > 1 && "s")}
          </h4>
        </div>
        {group.members.filter((member) => member.userid === context.user._id)
          .length !== 0 || group.userid === context.user._id ? (
          <button onClick={() => navigate(`/groups/${group._id}`)}>Open</button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (group.units.length !== 0) {
                setUnitModal(true);
              } else {
                if (group.status === 0) {
                  joinGroup();
                } else if (group.questions.length !== 0) {
                  setMemberAnswerModal(true);
                } else {
                  joinGroup();
                }
              }
            }}
          >
            {loading ? (
              <>
                Loading... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Join Group"
            )}
          </button>
        )}
        {/* <button
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
    </button> */}
      </div>

      <JoinGroupModals
        unitModal={unitModal}
        setUnitModal={setUnitModal}
        memberAnswerModal={memberAnswerModal}
        setMemberAnswerModal={setMemberAnswerModal}
        questions={questions}
        setQuestions={setQuestions}
        group={group}
      />
    </div>
  );
}

export default RecommendedGroupCard;
