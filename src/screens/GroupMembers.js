import React, { useState, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import AuthModals from "../components/authenticationModlas";
import LoginPrompt from "../components/loginPrompt";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../dataContext";

function GroupMembers() {
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
            <div className="group-requests">
              <header>
                <h4
                  className="mb-0"
                  onClick={() => navigate(`/groups/${id}/requests`)}
                >
                  <i className="fa-solid fa-arrow-left" />
                  Members
                </h4>
              </header>
              {/* members */}
              <div className="request">
                <div className="header d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center">
                    <div className="img-container">
                      <img src="/img/candidate.png" alt="profile-img" />
                    </div>
                    <div>
                      <h5>Aaron James</h5>
                      <div className="d-flex align-items-center">
                        <span>@AAron</span>
                        <i className="fa-solid fa-circle" />
                        <span> Requested 1day ago</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="approve-btn">View Profile</button>
                    <button className="decline-btn">Remove from Group</button>
                  </div>
                </div>
              </div>
              <div className="request">
                <div className="header d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center">
                    <div className="img-container">
                      <img src="/img/candidate.png" alt="profile-img" />
                    </div>
                    <div>
                      <h5>Aaron James</h5>
                      <div className="d-flex align-items-center">
                        <span>@AAron</span>
                        <i className="fa-solid fa-circle" />
                        <span> Requested 1day ago</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="approve-btn">View Profile</button>
                    <button className="decline-btn">Remove from Group</button>
                  </div>
                </div>
              </div>
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
