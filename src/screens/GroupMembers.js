import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import AuthModals from "../components/authenticationModlas";
import LoginPrompt from "../components/loginPrompt";
import { API } from "../components/apiRoot";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../dataContext";
import GroupMemberCard from "../components/groupMemberCard";
import Loader from "../components/loader";

function GroupMembers() {
  // context
  const { context } = useContext(DataContext);

  // params
  const { id } = useParams();

  // history
  const navigate = useNavigate();

  // fetch current group
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(true);
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
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCurrentGroup();
  }, []);

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

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
            <div className="group-requests">
              <header className="mt-md-0 mt-3">
                <h4
                  className="mb-0"
                  onClick={() => navigate(`/groups/${id}/requests`)}
                >
                  <i className="fa-solid fa-arrow-left" />
                  Members
                </h4>
              </header>
              {/* members */}
              {loading ? (
                <Loader pageLoading={loading} />
              ) : (
                <>
                  {group.members
                    .filter((member) => member.status === 1)
                    .map((member, i) => {
                      return (
                        <GroupMemberCard
                          group={group}
                          member={member}
                          id={id}
                          key={i}
                        />
                      );
                    })}
                </>
              )}
            </div>
            <Footer />
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

export default GroupMembers;
