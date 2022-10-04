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

function Groups() {
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
  const [createGroupModal, setCreateGroupModal] = useState(true);

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3  aside">
            <Aside view={view} setView={setView} />
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
                    <input type="text" placeholder="Search for Group" />
                    <img src="/img/search-normal.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <button className="d-flex align-items-center justify-content-center">
                    <img src="/img/edit.png" alt="write" />
                    New Group
                  </button>
                  {/* create group modal  */}
                  <Modal
                    isOpen={createGroupModal}
                    onRequestClose={() => setCreateGroupModal(false)}
                    id="group-modal"
                    className={`${context.darkMode ? "dm" : ""}`}
                  >
                    <i
                      className="far fa-times-circle"
                      onClick={() => setCreateGroupModal(false)}
                    />
                    <h1>New Group</h1>
                    <div className="d-flex align-items-center">
                      <div className="img-container">
                        <img src="/img/candidate.png" alt="admin" />
                      </div>
                      <div>
                        <h3 className="mb-0">James Jackson</h3>
                        <p className="mb-0">Admin</p>
                      </div>
                    </div>
                    <label htmlFor="name">Group Name</label>
                    <input type="text" id="name" placeholder="Enter Name" />
                    <label htmlFor="type">Public/Private</label>
                    <div className="drop">
                      <div className="link d-flex justify-content-between">
                        <span>Select Public / Private</span>
                        <i className="fa-solid fa-angle-down"></i>
                      </div>
                      <div className="drop-menu">
                        <div className="d-flex">
                          <i class="fa-solid fa-earth-americas"></i>
                          <div>
                            <h3>Public</h3>
                            <p>
                              Anyone can see who is in the group and what they
                              post
                            </p>
                          </div>
                        </div>
                        <div className="d-flex">
                          <i class="fa-solid fa-lock"></i>
                          <div>
                            <h3>Private</h3>
                            <p>
                              Only members can see who is in the group and what
                              they post
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button>Create Group</button>
                  </Modal>
                </div>
              </div>
            </div>
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

export default Groups;
