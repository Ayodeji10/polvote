import React, { useState, useContext, useEffect, useRef } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import StoryCard from "../components/storyCard";
import LoginPrompt from "../components/loginPrompt";
import AuthModals from "../components/authenticationModlas";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import WriteStoryModal from "../components/writeStoryModal";
import Modal from "react-modal";
import StorySkeleton from "../skeletons/storySkeleton";
import RecommendedStories from "../components/recommendedStories";
Modal.setAppElement("#root");

function Stories() {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  // useRef and callback
  const myRef = useRef();

  useEffect(() => {
    // console.log("my ref", myRef.current)
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setPageNumber((prev) => {
          return prev + 1;
        });
      }
      // console.log(entry)
    });
    observer.observe(myRef.current);
  }, []);

  // fetch stories
  const [stories, setStories] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const fetchStories = () => {
    axios({
      method: "GET",
      url: `${API.API_ROOT}/story?page=${pageNumber}&limit=10`,
    })
      .then((response) => {
        // console.log(response.data);
        if (stories.length === 0) {
          setStories(response.data.stories);
        } else {
          setStories((prevStories) => {
            return [...prevStories, ...response.data.stories];
          });
        }
        if (response.data.next === null || response.data.next === undefined) {
          setLoadMore(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchStories();
  }, [pageNumber]);

  // write story
  const [writeStoryModal, setWriteStoryModal] = useState(false);

  const handleWriteStoryModal = (variable) => {
    setWriteStoryModal(variable);
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
          {/* gutter  */}
          {/* <div className="col-lg-1" /> */}
          {/* main  */}
          <div className="story col-lg-6 col-md-9">
            {/* new story  */}
            <div className="stories-header">
              <div className="row">
                <div className="col-lg-7 col-md-6 col-sm-6">
                  <div className="searchbar d-flex justify-content-between align-items-center">
                    <input type="text" placeholder="Search for Posts" />
                    <img src="/img/search-normal.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <button
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => {
                      if (localStorage.getItem("ballotbox_token") !== null) {
                        setWriteStoryModal(true);
                      } else {
                        setLoginModal(true);
                      }
                    }}
                  >
                    <img src="/img/edit.png" alt="write" />
                    New Post
                  </button>
                  {/* write story modal  */}
                  {writeStoryModal && (
                    <WriteStoryModal
                      openModal={writeStoryModal}
                      handleWriteStoryModal={handleWriteStoryModal}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* stories  */}
            {stories.length === 0 ? (
              <>
                {/* <Loader pageLoading={pageLoading} /> */}
                {[1, 2, 3, 4, 5].map((n) => {
                  return <StorySkeleton key={n} />;
                })}
              </>
            ) : (
              <>
                {stories
                  .filter((story) => story.status !== "1")
                  .map((story, index) => {
                    return (
                      <StoryCard
                        story={story}
                        index={index}
                        key={index}
                        fetchStories={fetchStories}
                      />
                    );
                  })}
                <Loader pageLoading={loadMore} />
              </>
            )}
            <div ref={myRef}></div>
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

export default Stories;
