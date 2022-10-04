import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeUserSession } from "../utils/common";
import axios from "axios";
import { API } from "../components/apiRoot";
import { DataContext } from "../dataContext";
import WriteStoryModal from "./writeStoryModal";
import AuthModals from "./authenticationModlas";
// import Ad1 from './ad1';
import Modal from "react-modal";
import WriteStorySvg from "./svg/writeStorySvg";
import CreateProfileSvg from "./svg/createProfileSvg";
import GroupFeedSvg from "./svg/GroupFeedSvg";
import GroupFindFriendsSvg from "./svg/GroupFindFriendsSvg";
Modal.setAppElement("#root");

function Aside({ view, setView }) {
  // context
  const { context, setContext } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  const [userOPtions, setUserOptions] = useState(false);

  // fetch stories, aspirants, and presidential poll
  const [stories, setStories] = useState([]);
  const [storyFetch, setStoryFetch] = useState(true);
  const fetchStories = () => {
    axios({
      method: "GET",
      url: `${API.API_ROOT}/story?page=1&limit=500`,
    })
      .then((response) => {
        // console.log(response.data)
        setStories(response.data.stories);
        setStoryFetch(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [aspirants, setAspirants] = useState([]);
  const [aspirantFetch, setAspirantFetch] = useState(true);
  const fetchAspirants = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/aspirant`)
      .catch((error) => [console.log("Err", error)]);
    setAspirants(response.data);
    setAspirantFetch(false);
  };

  useEffect(() => {
    fetchStories();
    fetchAspirants();
  }, []);

  // get story likes
  const [userTotalLikes, setUserTotalLikes] = useState(0);
  let storyWallet = stories
    .filter((story) => story.userid === context.user._id)
    .reduce((total, story) => {
      let increament = story.likes.length;
      total += increament;
      return total;
    }, 0);
  useEffect(() => {
    setUserTotalLikes(storyWallet);
  }, [stories]);

  // fetch polls
  const [polls, setPolls] = useState([]);
  const fetchPolls = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/polls`)
      .catch((error) => [console.log("Err", error)]);
    // console.log(response.data)
    setPolls(response.data);
  };
  useEffect(() => {
    fetchPolls();
  }, []);

  // modals
  const [writeStoryModal, setWriteStoryModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  const handleWriteStoryModal = (variable) => {
    setWriteStoryModal(variable);
  };

  // google ads
  // useEffect(() => {
  //     (window.adsbygoogle = window.adsbygoogle || []).push({});
  // }, [])
  // useEffect(() => {
  //     const pushAd = () => {
  //         try {
  //             const adsbygoogle = window.adsbygoogle
  //             console.log({ adsbygoogle })
  //             adsbygoogle.push({})
  //         } catch (e) {
  //             console.error(e)
  //         }
  //     }

  //     let interval = setInterval(() => {
  //         // Check if Adsense script is loaded every 300ms
  //         if (window.adsbygoogle) {
  //             pushAd()
  //             // clear the interval once the ad is pushed so that function isn't called indefinitely
  //             clearInterval(interval)
  //         }
  //     }, 300)

  //     return () => {
  //         clearInterval(interval)
  //     }
  // }, [])

  // logout modal
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <div className="aside-sticky">
      {localStorage.getItem("ballotbox_token") !== null && (
        <>
          {/* user  */}
          <div className="user d-flex justify-content-between align-items-center mb-3">
            <div
              className="d-flex"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/user-profile")}
            >
              <div className="avatar">
                {context.user.image !== null &&
                context.user.image !== undefined ? (
                  <img src={context.user.image} alt="avatar" id="profile-img" />
                ) : (
                  <img
                    src="/img/place.jpg"
                    className="img-fluid"
                    alt="avatar"
                    id="profile-img"
                  />
                )}
              </div>
              <div className="d-flex flex-column justify-content-center">
                <p>Welcome</p>
                <h3 className="mb-0">{context.user.email}</h3>
              </div>
            </div>
            <i
              className="fas fa-ellipsis-h"
              style={{ cursor: "pointer" }}
              onMouseOver={() => setUserOptions(true)}
            />
            {/* <i style={{ cursor: "pointer" }} className="fas fa-ellipsis-v" onMouseOver={() => setUserOptions(true)} /> */}
          </div>

          {/* stats  */}
          {window.location.pathname.includes("/groups") ? (
            ""
          ) : (
            <div className="stats mb-3">
              <div
                className="d-flex justify-content-between mb-2"
                onClick={() => {
                  setContext({ ...context, articleView: "stories" });
                  navigate("/user-profile");
                }}
              >
                <h4>No of Posts published</h4>
                <h5>
                  {!storyFetch && (
                    <>
                      {stories.filter(
                        (story) => story.userid === context.user._id
                      ).length > 500
                        ? "500+"
                        : stories.filter(
                            (story) => story.userid === context.user._id
                          ).length}
                    </>
                  )}
                </h5>
              </div>
              <div
                className="d-flex justify-content-between mb-2"
                onClick={() => {
                  setContext({ ...context, articleView: "aspirants" });
                  navigate("/user-profile");
                }}
              >
                <h4>No of Aspirants created</h4>
                <h5>
                  {!aspirantFetch &&
                    aspirants.filter(
                      (aspirant) => aspirant.creatorid === context.user._id
                    ).length}
                </h5>
              </div>
              <div
                className="d-flex justify-content-between"
                onClick={() => {
                  setContext({ ...context, articleView: "stories" });
                  navigate("/user-profile");
                }}
              >
                <h4>Impressions of your Posts</h4>
                <h5>{!storyFetch && userTotalLikes}</h5>
              </div>
            </div>
          )}
        </>
      )}

      {/* settings  */}
      {userOPtions && (
        <div
          className="settings mb-4"
          onMouseLeave={() => setUserOptions(false)}
        >
          <p
            onClick={() => {
              setContext({ ...context, profileView: "edit" });
              navigate("/user-profile");
            }}
          >
            Account Settings
          </p>
          <p
            onClick={() => {
              setContext({ ...context, profileView: "aspirants" });
              navigate("/user-profile");
            }}
          >
            Aspirant Profiles
          </p>
          <p
            onClick={() => {
              setContext({ ...context, profileView: "stories" });
              navigate("/user-profile");
            }}
          >
            My Posts
          </p>
          <p onClick={() => setLogoutModal(true)}>Logout</p>

          {/* logout modal  */}
          <Modal
            isOpen={logoutModal}
            onRequestClose={() => setLogoutModal(false)}
            id="logoutModal"
            className={`${context.darkMode ? "dm" : ""}`}
          >
            <div className="d-flex flex-column align-items-center">
              <h3>Are you sure you want to Logout?</h3>
              <button
                id="log-out"
                onClick={(e) => {
                  e.preventDefault();
                  removeUserSession();
                  setContext({ ...context, user: {} });
                  setLogoutModal(false);
                  setUserOptions(false);
                }}
              >
                Logout
              </button>
              <button
                id="cancel-log"
                onClick={() => {
                  setLogoutModal(false);
                  setUserOptions(false);
                }}
              >
                Cancel
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* courses  */}
      {/* <div className="course">
                <h3 className="mb-2">Sponsored Courses</h3>
                <div className="card">
                    <div className="header" />
                    <div className="body">
                        <h3>The Politics of Skepticism</h3>
                        <span className="d-flex align-items-center mb-lg-4">
                            <i className="fas fa-star" />
                            <h4 className="mb-0">4.9</h4>
                            <h5 className="mb-0">4,709 Ratings</h5>
                        </span>
                        <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipisci
                            ng elit. Dui orci enim habitant ornare eget sem.
                            Ipsum nibh nisl donec lacus. Consequat, ac phas
                            ellus augue nunc sed. Molestie sodales feugiat d
                            iam, metus, elementum ipsum hendrerit.</p>
                        <button>Enrol Now</button>
                    </div>
                </div>
            </div> */}

      {/* ad  */}
      {/* <div className='ad mb-4'>
                <span className='mb-2'>Close Ad <i className="fas fa-times-circle" /></span>
                <img src="/img/EZ-Cash-loan 2.png" alt="" />
            </div> */}
      {/* <div>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                    crossOrigin="anonymous"></script>
                <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={2804702051} data-ad-format="auto" data-full-width-responsive="true" />
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div> */}
      {/* <Ad1 /> */}

      {/* content  */}
      {window.location.pathname.includes("/groups") ? (
        ""
      ) : (
        <div className="content">
          <span
            className="d-flex align-items-center mb-3"
            onClick={() => {
              if (localStorage.getItem("ballotbox_token") !== null) {
                setWriteStoryModal(true);
              } else {
                setLoginModal(true);
              }
            }}
          >
            <WriteStorySvg />
            <span>New Post</span>
          </span>

          {/* write modal  */}
          {writeStoryModal && (
            <WriteStoryModal
              openModal={writeStoryModal}
              handleWriteStoryModal={handleWriteStoryModal}
            />
          )}
          <span
            className="d-flex align-items-center"
            onClick={() => {
              if (localStorage.getItem("ballotbox_token") !== null) {
                navigate("/create-aspirant");
              } else {
                setLoginModal(true);
              }
            }}
          >
            <CreateProfileSvg />
            <span>New Aspirant Profile</span>
          </span>
          {/* authentication */}
          <AuthModals
            loginModal={loginModal}
            setLoginModal={setLoginModal}
            signupModal={signupModal}
            setSignupModal={setSignupModal}
            verificationModal={verificationModal}
            setVerificationModal={setVerificationModal}
          />
        </div>
      )}

      {/* courses  */}
      {/* <div className="courses">
                <h3>My Courses</h3>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector.png" alt="" />
                    <h4 className="mb-0">In Progress</h4>
                </a>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector (1).png" alt="" />
                    <h4 className="mb-0">Completed</h4>
                </a>
                <a href className="d-flex align-items-center mb-0"><img src="/img/Vector (2).png" alt="" />
                    <h4 className="mb-0">My Certificates</h4>
                </a>
            </div> */}

      {/* polls  */}
      {window.location.pathname.includes("/groups") ? (
        ""
      ) : (
        <div className="polls">
          <h3>Active Polls</h3>
          <div className="active-polls">
            {polls
              .filter((poll) => poll.status !== "1")
              .map((poll) => {
                return (
                  <Link
                    to={`/polls/${poll._id}`}
                    className="d-flex justify-content-between align-items-center"
                    key={poll._id}
                  >
                    <h4 className="mb-0">{poll.polltitle}</h4>
                    <i className="fas fa-angle-right" />
                  </Link>
                );
              })}
            {/* <a href className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">2023 Presidential Poll</h4><i className="fas fa-angle-right" />
                        </a> */}
          </div>
        </div>
      )}

      {/* group asides  */}
      {window.location.pathname.includes("/groups") &&
        localStorage.getItem("ballotbox_token") !== null && (
          <>
            <div className="feed">
              <button
                className={`${
                  view === "feed" && "active"
                } d-flex align-items-center`}
                onClick={() => setView("feed")}
              >
                <GroupFeedSvg />
                My Feed
              </button>
              <button
                className={`${
                  view === "groups" && "active"
                } d-flex align-items-center`}
                onClick={() => setView("groups")}
              >
                <GroupFindFriendsSvg />
                Find more Groups
              </button>
            </div>
            {/* admin  */}
            <div className="group-admin">
              <h2>Groups you’re an admin</h2>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* member  */}
            <div className="group-admin">
              <h2>Groups you’ve joined</h2>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
              <div className="group d-flex">
                <div className="img-container">
                  <img src="/img/Candidate.png" />
                </div>
                <div>
                  <h3>LASU STUDENTS FORUM</h3>
                  <div className="d-flex align-items-center">
                    <h4>Private</h4>
                    <i className="fa-solid fa-circle" />
                    <h4>20k members</h4>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
}

export default Aside;
