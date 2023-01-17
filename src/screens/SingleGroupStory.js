import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import LoginPrompt from "../components/loginPrompt";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import GroupStoryCard from "../components/groupStoryCard";
import AuthModals from "../components/authenticationModlas";
import Loader from "../components/loader";
import RecommendedStories from "../components/recommendedStories";
import Modal from "react-modal";
Modal.setAppElement("#root");

function SingleGroupStory() {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  // params
  const { id } = useParams();

  // fetch single story
  const [story, setStory] = useState({});
  const [storyLike, setStoryLike] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const fetchStory = () => {
    axios({
      url: `${API.API_ROOT}/post/getsingle/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        setStory(response.data);
        setPageLoading(false);
        if (
          response.data.likes.filter((like) => like.userid === context.user._id)
            .length === 0
        ) {
          setStoryLike(0);
        } else {
          setStoryLike(1);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    if (id && id !== "") fetchStory();
  }, [id]);

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          {/* gutter  */}
          {/* <div className="col-lg-1" /> */}
          {/* main  */}
          <div className="col-lg-6 col-md-9 story">
            <Link to={"/stories"}>
              <i className="fa-solid fa-arrow-left-long mb-4"></i>
            </Link>
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <GroupStoryCard story={story} fetchStory={fetchStory} />
            )}
            {/* footer  */}
            <Footer />
          </div>
          <div className="col-lg-3">
            <div className="aside-sticky">
              <RecommendedStories />
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

export default SingleGroupStory;
