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

  // update cover image
  // click cover photo input
  const coverPhoto = () => {
    document.getElementById("cover-pic").click();
  };
  // cover image and looader
  const [coverImgae, setCoverImage] = useState(null);
  const [coverPhotoLoader, setCoverPhotoLoader] = useState(false);
  // upload cover image
  useEffect(() => {
    if (coverImgae !== null) {
      setCoverPhotoLoader(true);
      const fd = new FormData();
      fd.append("image", coverImgae);
      // console.log(Array.from(fd));
      axios({
        url: `${API.API_ROOT}/group/coverimage/${id}`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          // console.log(response);
          setGroup(response.data.data);
          setCoverPhotoLoader(false);
        },
        (error) => {
          setCoverPhotoLoader(false);
          console.log(error);
        }
      );
    }
  }, [coverImgae]);

  // update profile piture
  // click to update
  const profilePhoto = () => {
    document.getElementById("profile-pic-input").click();
  };
  // profile image and loader
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicLoader, setProfilePicLoader] = useState(false);
  // // upload profile pic on state change
  useEffect(() => {
    if (profilePic !== null) {
      setProfilePicLoader(true);
      const fd = new FormData();
      fd.append("image", profilePic);
      axios({
        url: `${API.API_ROOT}/group/addimage/${id}`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          // console.log(response);
          setGroup(response.data.data);
          setProfilePicLoader(false);
        },
        (error) => {
          setProfilePicLoader(false);
          console.log(error);
        }
      );
    }
  }, [profilePic]);

  // update group name
  const [showNameInput, setShowNameInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const updateName = () => {
    setNameLoading(true);
    axios({
      url: `${API.API_ROOT}/group/editusers/${id}`,
      method: "patch",
      data: { groupname: newName },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        setGroup(response.data.data);
        setNameLoading(false);
        setShowNameInput(false);
      },
      (error) => {}
    );
  };

  // security setting
  const [securityLoading, setSecurityLoading] = useState(false);
  const handleSecurity = () => {
    setSecurityLoading(true);
    axios
      .patch(`${API.API_ROOT}/group/changeprivacy/${id}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        setGroup(response.data.data);
        setSecurityLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSecurityLoading(false);
      });
  };

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
          <div className="col-md-9 col-12">
            {/* {loading ? (
            ) : (
              <></>
            )} */}
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <div className="row">
                <div className="col-12 sticky-header">
                  <div className="single-group-header mt-lg-0 mt-md-0 mt-sm-3 mt-3">
                    <div className="top">
                      <img
                        src={
                          group.coverimage === null ||
                          group.coverimage === undefined
                            ? "/img/10162 1.png"
                            : group.coverimage
                        }
                        alt=""
                      />
                      {group.userid === context.user._id && (
                        <button onClick={coverPhoto}>
                          {coverPhotoLoader ? (
                            <i className="fa-solid fa-spinner fa-spin" />
                          ) : (
                            <i className="fa-solid fa-pen" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="cover-pic"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                          />
                        </button>
                      )}
                    </div>
                    <footer>
                      <div className="row">
                        <div className="col-md-5 col-sm-5 col-12 d-flex align-items-center">
                          <div className="img-container">
                            {group.image !== null &&
                            group.image !== undefined ? (
                              <img src={group.image} alt="profile-img" />
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
                        <div className="col-md-7 col-sm-7 col-12 d-flex align-items-center justify-content-md-end justify-content-sm-end mt-3 mt-md-0 mt-sm-0">
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
                                <>
                                  <h4
                                    onClick={() =>
                                      navigate(`/groups/${id}/requests`)
                                    }
                                  >
                                    <i className="fa-solid fa-user-group" />
                                    Member Requests
                                  </h4>
                                </>
                              )}
                              {group.status === 1 && (
                                <h4
                                  onClick={() =>
                                    setMemberVerificationModal(true)
                                  }
                                >
                                  <i className="fa-solid fa-message" />
                                  Membership Verification
                                </h4>
                              )}
                              {group.units.length !== 0 && (
                                <h4
                                  onClick={() =>
                                    navigate(`/groups/${id}/units`)
                                  }
                                >
                                  <i className="fa-solid fa-users-rectangle" />
                                  Group Units
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
                        <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
                          <div className="d-flex">
                            <i className="fa-solid fa-users-line" />
                            <div>
                              <h4>Group Name</h4>
                              <p>{group.groupname}</p>
                            </div>
                          </div>
                          <i
                            className="fa-solid fa-pen"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowNameInput(!showNameInput)}
                          />
                          {showNameInput && (
                            <div className="d-flex justify-content-between input-container position-absolute">
                              <input
                                type="text"
                                placeholder="Enter New Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                              />
                              <button onClick={updateName}>
                                {nameLoading ? (
                                  <>
                                    Loading...{" "}
                                    <i className="fa-solid fa-spinner fa-spin" />
                                  </>
                                ) : (
                                  "Save"
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className="d-flex mb-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/groups/${id}/members`)}
                      >
                        <i className="fa-solid fa-user-group" />
                        <div>
                          <h4>Members</h4>
                          <p>20k members</p>
                        </div>
                      </div>
                      {group.userid === context.user._id && (
                        <>
                          <div
                            className="d-flex justify-content-between align-items-center mb-3"
                            onClick={profilePhoto}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex">
                              <i className="fa-regular fa-image" />
                              <input
                                type="file"
                                accept="image/*"
                                id="profile-pic-input"
                                hidden
                                onChange={(e) =>
                                  setProfilePic(e.target.files[0])
                                }
                              />
                              <div>
                                <h4>Group Profile Image</h4>
                              </div>
                            </div>
                            {profilePicLoader ? (
                              <i className="fa-solid fa-spinner fa-spin" />
                            ) : (
                              <i className="fa-solid fa-pen" />
                            )}
                          </div>
                          <div
                            className="d-flex justify-content-between align-items-start mb-3"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex">
                              <i className="fa-solid fa-lock" />
                              <div>
                                <h4>Group Security</h4>
                                <p>
                                  Turn on group security to allow only member
                                  requests you approve to join your group
                                </p>
                              </div>
                            </div>
                            {securityLoading ? (
                              <i className="fa-solid fa-spinner fa-spin" />
                            ) : (
                              <>
                                {group.status === 0 ? (
                                  <i
                                    className="fa-solid fa-toggle-off"
                                    onClick={handleSecurity}
                                  />
                                ) : (
                                  <i
                                    className="fa-solid fa-toggle-on"
                                    onClick={handleSecurity}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
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
