import React, { useState, useContext, useEffect, useRef } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import LoginPrompt from "../components/loginPrompt";
import AuthModals from "../components/authenticationModlas";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import Modal from "react-modal";
import MemberVerificationModal from "../components/memberVerificationModal";
Modal.setAppElement("#root");

function SingleGroup() {
  // context
  const { context } = useContext(DataContext);

  // params
  const { id } = useParams();

  // history
  const navigate = useNavigate();

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  const [memberVerificationModal, setMemberVerificationModal] = useState(false);
  const [questions, setQuestions] = useState(["", ""]);
  const [dropdown, setDropdown] = useState(false);

  // fetch current group
  const [group, setGroup] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const fetchCurrentGroup = () => {
    axios
      .get(`${API.API_ROOT}/group/${id}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        setGroup(response.data);
        if (response.data.questions.length !== 0) {
          setQuestions(response.data.questions);
        }
        setPageLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCurrentGroup();
  }, []);

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3  aside">
            <Aside />
          </div>
          {/* main  */}
          <div className="col-9">
            {/* {loading ? (
            ) : (
              <></>
            )} */}
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <div className="row">
                <div className="col-12 sticky-header">
                  <div className="single-group-header">
                    <div className="top">
                      <img
                        src={
                          group.coverImage === null ||
                          group.coverImage === undefined
                            ? "/img/10162 1.png"
                            : group.user.image
                        }
                        alt=""
                      />
                      {group.userid === context.user._id && (
                        <button>
                          <i className="fa-solid fa-pen" />
                        </button>
                      )}
                    </div>
                    <footer>
                      <div className="row">
                        <div className="col-5 d-flex align-items-center">
                          <div className="img-container">
                            {group.profileImage !== null &&
                            group.profileImageimage !== undefined ? (
                              <img
                                src={group.profileImageimage}
                                alt="profile-img"
                              />
                            ) : (
                              <img src="/img/place.jpg" alt="profile-img" />
                            )}
                          </div>
                          <div>
                            <h3>{group.groupname}</h3>
                            <div className="d-flex align-items-center">
                              <h4>{group.grouptype}</h4>
                              <i class="fa-solid fa-circle" />
                              <h4>20k members</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-7 d-flex align-items-center justify-content-end">
                          <button id="invite-btn">Invite</button>
                          <button id="write-post">Write a Post</button>
                          <i className="fa-solid fa-magnifying-glass" />
                          <i
                            class="fas fa-ellipsis-h"
                            onClick={() => setDropdown(!dropdown)}
                          />
                          {dropdown && (
                            <div className="submenu">
                              {group.userid === context.user._id && (
                                <h4>
                                  <i className="fa-solid fa-user-group" />
                                  Member Requests
                                </h4>
                              )}
                              {group.grouptype === "private" && (
                                <h4
                                  onClick={() =>
                                    setMemberVerificationModal(true)
                                  }
                                >
                                  <i className="fa-solid fa-message" />
                                  Membership Verification
                                </h4>
                              )}
                              {memberVerificationModal && (
                                <MemberVerificationModal
                                  memberVerificationModal={
                                    memberVerificationModal
                                  }
                                  setMemberVerificationModal={
                                    setMemberVerificationModal
                                  }
                                  questions={questions}
                                  setQuestions={setQuestions}
                                  id={id}
                                />
                              )}
                              <h4>
                                <i className="fa-solid fa-share-nodes" />
                                Share Group
                              </h4>
                              <h4>
                                <i className="fa-solid fa-thumbtack" />
                                Pin Group
                              </h4>
                              <h4>
                                <i className="fa-regular fa-chart-bar" />
                                New Poll
                              </h4>
                              {group.userid === context.user._id && (
                                <h4>
                                  <i className="fa-solid fa-trash-can" />
                                  Delete Group
                                </h4>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
                <div className="story col-lg-8 col-md-8">
                  <Footer />
                </div>
                <div className="col-lg-4">
                  <div className="group-aside-sticky">
                    <div className="group-info">
                      <h3>Group Info</h3>
                      {group.userid === context.user._id && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex">
                            <i className="fa-solid fa-users-line" />
                            <div>
                              <h4>Group Name</h4>
                              <p>LASU SUG FORUM</p>
                            </div>
                          </div>
                          <i className="fa-solid fa-pen" />
                        </div>
                      )}
                      <div className="d-flex mb-3">
                        <i className="fa-solid fa-user-group" />
                        <div>
                          <h4>Members</h4>
                          <p>20k members</p>
                        </div>
                      </div>
                      {group.userid === context.user._id && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex">
                            <i className="fa-regular fa-image" />
                            <div>
                              <h4>Group Profile Image</h4>
                            </div>
                          </div>
                          <i className="fa-solid fa-pen" />
                        </div>
                      )}
                      <div className="d-flex">
                        <i className="fa-solid fa-earth-asia" />
                        <div>
                          <h4>
                            {group.grouptype === "private"
                              ? "Private"
                              : "Public"}
                          </h4>
                          <p>
                            {group.grouptype === "private"
                              ? "Only members can see who is in the group and what they post"
                              : "Anyone can see who is in the group and what they post"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* authentication */}
      <AuthModals
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        signupModal={signupModal}
        setSignupModal={setSignupModal}
        verificationModal={verificationModal}
        setVerificationModal={setVerificationModal}
      />
      {/* login prompt  */}
      {localStorage.getItem("ballotbox_token") === null && (
        <LoginPrompt
          setLoginModal={setLoginModal}
          setSignupModal={setSignupModal}
        />
      )}
    </div>
  );
}

export default SingleGroup;
