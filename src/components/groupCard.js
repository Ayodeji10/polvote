import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberAnswerModal from "./memberAnswerModal";

function GroupCard({ group }) {
  // history
  const navigate = useNavigate();

  const [memberAnswerModal, setMemberAnswerModal] = useState(false);

  const [questions, setQuestions] = useState([]);

  // useEffect(() => {
  //   const newQuestions = group.questions.map((question) => ({
  //     [question]: "",
  //   }));
  //   setQuestions(newQuestions);
  // }, []);

  useEffect(() => {
    const newQuestions = group.questions.map((question) => ({
      question: question,
      answer: "",
    }));
    setQuestions(newQuestions);
  }, []);

  return (
    <>
      <div
        className="group-card"
        onClick={() => navigate(`/groups/${group._id}`)}
      >
        <div className="row align-items-center">
          <div className="col-9 d-flex align-items-center">
            <div className="img-container">
              {group.profileImage === null ||
              group.profileImage === undefined ? (
                <img src="/img/place.jpg" />
              ) : (
                <img src={group.profileImage} alt="avatar" />
              )}
              <img src="/img/candidate.png" alt="" />
            </div>
            <div>
              <h3>{group.groupname}</h3>
              <div className="d-flex align-items-center gap-2">
                <h6>{group.grouptype}</h6>
                <i className="fa-solid fa-circle" />
                <h6>20k members</h6>
              </div>
            </div>
          </div>
          <div className="col-3 d-flex justify-content-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMemberAnswerModal(true);
              }}
            >
              Join Group
            </button>
          </div>
        </div>
      </div>
      <MemberAnswerModal
        memberAnswerModal={memberAnswerModal}
        setMemberAnswerModal={setMemberAnswerModal}
        questions={questions}
        setQuestions={setQuestions}
        group={group}
      />
    </>
  );
}

export default GroupCard;
