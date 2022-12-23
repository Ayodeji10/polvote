import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import cogoToast from "cogo-toast";
import JoinGroupModals from "./joinGroupModals";

function GroupCard({ group }) {
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
    <>
      <div
        className="group-card"
        onClick={() => navigate(`/groups/${group._id}`)}
      >
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-7 col-sm-7 col-7 d-flex align-items-center">
            <div className="img-container">
              {group.image !== null && group.image !== undefined ? (
                <img src={group.image} alt="profile-img" />
              ) : (
                <img src="/img/place.jpg" alt="profile-img" />
              )}
              <img src="/img/candidate.png" alt="" />
            </div>
            <div>
              <h3>{group.groupname}</h3>
              <h6>
                {group.members.length} member
                {group.members.length === 0 ||
                  (group.members.length > 1 && "s")}
              </h6>
            </div>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 col-5 d-flex justify-content-end">
            {group.members.filter(
              (member) => member.userid === context.user._id
            ).length !== 0 || group.userid === context.user._id ? (
              <button onClick={() => navigate(`/groups/${group._id}`)}>
                Open
              </button>
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
          </div>
        </div>
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
      {/* <MemberAnswerModal
        memberAnswerModal={memberAnswerModal}
        setMemberAnswerModal={setMemberAnswerModal}
        questions={questions}
        setQuestions={setQuestions}
        group={group}
      /> */}
    </>
  );
}

export default GroupCard;
