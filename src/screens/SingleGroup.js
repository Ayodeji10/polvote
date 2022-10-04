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
import Modal from "react-modal";
import StorySkeleton from "../skeletons/storySkeleton";
import RecommendedGroups from "../components/recommendedGroups";
Modal.setAppElement("#root");

function SingleGroup() {
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
        // console.log(response.data)
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

  const [view, setView] = useState("feed");

  const [group, setGroup] = useState({});

  const [coverLoading, setCoverLoading] = useState(false);

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3  aside">
            <Aside view={view} setView={setView} />
          </div>
          {/* main  */}
          <div className="col-9">
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
                    <button>
                      {coverLoading ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-pen" />
                      )}
                    </button>
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
                          <h3>LASU STUDENTS FORUM</h3>
                          <div className="d-flex align-items-center">
                            <h4>Private</h4>
                            <i class="fa-solid fa-circle" />
                            <h4>20k members</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-7 d-flex align-items-center justify-content-end">
                        <button id="invite-btn">Invite</button>
                        <button id="write-post">Write a Post</button>
                        <i className="fa-solid fa-magnifying-glass" />
                        <i class="fas fa-ellipsis-h" />
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
              <div className="story col-lg-8 col-md-8">
                {/* Groups  */}
                {view === "feed" ? (
                  <>
                    {stories.length === 0 ? (
                      <>
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
                  </>
                ) : (
                  <>
                    <div className="group-card">
                      <div className="row align-items-center">
                        <div className="col-9 d-flex align-items-center">
                          <div className="img-container">
                            <img src="/img/candidate.png" alt="" />
                          </div>
                          <div>
                            <h3>UNIJOS STUDENTS FORUM</h3>
                            <div className="d-flex align-items-center gap-2">
                              <h6>Public</h6>
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
                    <div className="group-card">
                      <div className="row align-items-center">
                        <div className="col-9 d-flex align-items-center">
                          <div className="img-container">
                            <img src="/img/candidate.png" alt="" />
                          </div>
                          <div>
                            <h3>UNIJOS STUDENTS FORUM</h3>
                            <div className="d-flex align-items-center gap-2">
                              <h6>Public</h6>
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
                    <div className="group-card">
                      <div className="row align-items-center">
                        <div className="col-9 d-flex align-items-center">
                          <div className="img-container">
                            <img src="/img/candidate.png" alt="" />
                          </div>
                          <div>
                            <h3>UNIJOS STUDENTS FORUM</h3>
                            <div className="d-flex align-items-center gap-2">
                              <h6>Public</h6>
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
                    <div className="group-card">
                      <div className="row align-items-center">
                        <div className="col-9 d-flex align-items-center">
                          <div className="img-container">
                            <img src="/img/candidate.png" alt="" />
                          </div>
                          <div>
                            <h3>UNIJOS STUDENTS FORUM</h3>
                            <div className="d-flex align-items-center gap-2">
                              <h6>Public</h6>
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
                  </>
                )}

                {/* footer  */}
                <Footer />
              </div>
              <div className="col-lg-4">
                <div className="group-aside-sticky">
                  <div className="group-info">
                    <h3>Group Info</h3>
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
                    <div className="d-flex mb-3">
                      <i className="fa-solid fa-user-group" />
                      <div>
                        <h4>Members</h4>
                        <p>20k members</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex">
                        <i className="fa-regular fa-image" />
                        <div>
                          <h4>Group Profile Image</h4>
                        </div>
                      </div>
                      <i className="fa-solid fa-pen" />
                    </div>
                    <div className="d-flex">
                      <i className="fa-solid fa-earth-asia" />
                      <div>
                        <h4>Private</h4>
                        <p>
                          Only members can see who is in the group and what they
                          post
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

export default SingleGroup;
