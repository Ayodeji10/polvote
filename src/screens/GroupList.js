import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import LoginPrompt from "../components/loginPrompt";
import AuthModals from "../components/authenticationModlas";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import RecommendedGroups from "../components/recommendedGroups";
import CreateGroupModal from "../components/createGroupModal";
import Loader from "../components/loader";
Modal.setAppElement("#root");

function GroupList() {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

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
        setGroupsLoading(false);
        // console.log(response);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // create group modal
  const [createGroupModal, setCreateGroupModal] = useState(false);

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
          <div className="story col-lg-6 col-md-9">
            {/* new Group  */}
            <div className="stories-header">
              <div className="row">
                <div className="col-lg-7 col-md-6 col-sm-6">
                  <div className="searchbar d-flex justify-content-between align-items-center">
                    <input type="text" placeholder="Search for Group" />
                    <img src="/img/search-normal.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <button
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => setCreateGroupModal(true)}
                  >
                    <img src="/img/edit.png" alt="write" />
                    New Group
                  </button>
                  {/* create group modal  */}
                  <CreateGroupModal
                    createGroupModal={createGroupModal}
                    setCreateGroupModal={setCreateGroupModal}
                  />
                </div>
              </div>
            </div>
            {/* Groups  */}
            {groupsLoading ? (
              <Loader pageLoading={groupsLoading} />
            ) : (
              <>
                {groups.map((group, index) => {
                  return (
                    <div
                      className="group-card"
                      key={index}
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
                          <button>Join Group</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {/* footer  */}
            <Footer />
          </div>
          <div className="col-lg-3">
            <div className="aside-sticky">
              <RecommendedGroups />
            </div>
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

export default GroupList;
