import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import { useParams } from "react-router-dom";
import Aside from "../components/aside";
import RecommendedStories from "../components/recommendedStories";
import RecomendedAspirants from "../components/recomendedAspirants";
import AuthModals from "../components/authenticationModlas";
import Footer from "../components/footer";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import LoginPrompt from "../components/loginPrompt";
import Loader from "../components/loader";
import ElectionOpenedPollCard from "../components/newPollCards/ElectionOpenedPollCard";
import OpinionOpenedPollCard from "../components/newPollCards/OpinionOpenedPollCard";

function SingleGeneralPoll() {
  // context
  const { context } = useContext(DataContext);

  // params
  const { id } = useParams();

  // auth
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  // states
  const [poll, setPoll] = useState({});
  const [group, setGroup] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  //   fetch current poll nd group
  const fetchCurrentPoll = () => {
    axios({
      method: "GET",
      url: `${API.API_ROOT}/generalpoll/getsinglepoll/${id}`,
    })
      .then((response) => {
        // console.log(response);
        setPoll(response.data);
        if (response.data.groupid) {
          axios
            .get(`${API.API_ROOT}/group/${response.data.groupid}`, {
              headers: {
                "content-type": "application/json",
              },
            })
            .then((response) => {
              //   console.log(response);
              setGroup(response.data);
              setPageLoading(false);
            })
            .catch((error) => {
              //   console.log(error);
              setPageLoading(false);
            });
        } else {
          setPageLoading(false);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchCurrentPoll();
  }, []);

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          <div className="col-lg-6 col-md-9 single-poll">
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <>
                {poll.category === "election" ? (
                  <ElectionOpenedPollCard
                    groupLoading={pageLoading}
                    group={group}
                    poll={poll}
                    setOpened={true}
                  />
                ) : (
                  <OpinionOpenedPollCard
                    groupLoading={pageLoading}
                    group={group}
                    poll={poll}
                    setOpened={true}
                  />
                )}
              </>
            )}
            {/* footer  */}
            <Footer />
          </div>
          <div className="profile-widget col-lg-3">
            <div className="aside-sticky">
              <RecommendedStories />
              <RecomendedAspirants />
            </div>
          </div>
        </div>
      </div>

      {/* share modal  */}

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

export default SingleGeneralPoll;
