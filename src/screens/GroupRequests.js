import React, { useState, useContext, useEffect } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import AuthModals from "../components/authenticationModlas";
import LoginPrompt from "../components/loginPrompt";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";
import axios from "axios";
import Loader from "../components/loader";
import RequestCard from "../components/RequestCard";

function GroupRequests() {
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

  const [loading, setLoading] = useState(true);

  // fetch current group
  const [group, setGroup] = useState({});
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
              <header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0" onClick={() => navigate(`/groups/${id}`)}>
                  <i className="fa-solid fa-arrow-left" />
                  Member Requests
                </h4>
                <Link to={`/groups/${id}/members`}>See all members</Link>
                {/* <h3 className="mb-0"></h3> */}
              </header>
              {/* requests */}
              {loading ? (
                <Loader pageLoading={loading} />
              ) : (
                <>
                  {group.members
                    .filter((member) => member.status === 0)
                    .map((member, i) => {
                      return <RequestCard member={member} id={id} key={i} />;
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

export default GroupRequests;
