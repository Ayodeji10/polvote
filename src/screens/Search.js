import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useParams, Link, useNavigate } from "react-router-dom";
import StoryCard from "../components/storyCard";
import Loader from "../components/loader";
import SingleProfileCard from "../components/singleProfileCard";
import PollCard from "../components/pollCard";
import NavAspirantsSvg from "../components/svg/NavAspirantsSvg";
import NavPollsSvg from "../components/svg/NavPollsSvg";
import NavStoriesSvg from "../components/svg/NavStoriesSvg";
import NavGroupSvg from "../components/svg/NavGroupSvg";
import UsersSvg from "../components/svg/UsersSvg";
import GroupCard from "../components/groupCard";

function Search() {
  // context
  const { context, setContext } = useContext(DataContext);

  // params
  const { param } = useParams();

  // history
  const navigate = useNavigate();

  // redirect if user is not logged in
  useEffect(() => {
    if (localStorage.getItem("ballotbox_token") === null) {
      navigate("/");
    }
  }, []);

  // view
  const [currentView, setCurrentView] = useState("profiles");
  const [pageLoading, setPageLoading] = useState(true);

  // fetch aspirants
  const [aspirants, setAspirants] = useState([]);
  const fetchAspirants = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/aspirant`)
      .catch((error) => [
        // console.log('Err', error)
      ]);
    param
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 1)
      .forEach((word) => {
        const people = response.data.filter(
          (aspirant) =>
            `${aspirant.firstname} ${aspirant.lastname}`
              .toLowerCase()
              .indexOf(word) !== -1 && aspirant.status == 1
        );
        setAspirants(people);
      });
  };

  // fetch polls
  const [polls, setPolls] = useState([]);
  const fetchPolls = async () => {
    const response = await axios.get(`${API.API_ROOT}/polls`).catch((error) => [
      // console.log('Err', error)
    ]);
    param
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 1)
      .forEach((word) => {
        const poll = response.data.filter(
          (poll) => poll.polltitle.toLowerCase().indexOf(word) !== -1
        );
        setPolls(poll);
      });
  };

  // fetch stories
  const [stories, setStories] = useState([]);
  const fetchStories = () => {
    axios({
      method: "GET",
      url: `${API.API_ROOT}/story?page=1&limit=500`,
    })
      .then((response) => {
        param
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 1)
          .forEach((word) => {
            const stories = response.data.stories.filter(
              (story) =>
                story.story
                  .replace(/(<([^>]+)>)/gi, "")
                  .toLowerCase()
                  .indexOf(word) !== -1
            );
            setStories(stories);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetch groups
  const [groups, setGroups] = useState([]);
  const fetchGroups = () => {
    axios
      .get(`${API.API_ROOT}/group`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        param
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 1)
          .forEach((word) => {
            const groups = response.data.filter(
              (group) => group.groupname.toLowerCase().indexOf(word) !== -1
            );
            setGroups(groups);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetch users
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/users/allusers`)
      .catch((error) => [console.log("Err", error)]);
    param
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 1)
      .forEach((word) => {
        const users = response.data.filter(
          (user) =>
            `${user.firstname} ${user.lastname}`.toLowerCase().indexOf(word) !==
            -1
        );
        setUsers(users);
      });
    console.log(response.data);
  };

  useEffect(() => {
    fetchAspirants();
    fetchPolls();
    fetchStories();
    fetchGroups();
    fetchUsers();
    setPageLoading(false);
  }, [param]);

  // enter key to search
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && context.homeSearchKey !== "") {
      navigate(`/search=${context.homeSearchKey}`);
    }
  };

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      {/* navigation */}
      <Nav />
      {/* feed  */}
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          {/* main  */}
          <div className="col-lg-9 col-md-9 search">
            <div className="row">
              <div className="col-lg-8">
                <div className="searchbar d-flex align-items-center">
                  <input
                    type="text"
                    placeholder="Adekunle Ahmed Ibrahim"
                    value={context.homeSearchKey}
                    onChange={(e) =>
                      setContext({ ...context, homeSearchKey: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                  />
                  <img
                    src="img/search-normal.png"
                    alt="search"
                    onClick={() => navigate(`/search=${context.homeSearchKey}`)}
                  />
                </div>
              </div>
              <div className="col-2">
                {/* <button id="filter"><i className="fas fa-filter" />Filter</button> */}
              </div>
            </div>
            <div className="toggle d-flex justify-content-between">
              <div className="d-flex">
                <button
                  className={currentView === "profiles" && "active"}
                  onClick={() => setCurrentView("profiles")}
                >
                  <NavAspirantsSvg />
                  Aspirants
                </button>
                <button
                  className={currentView === "polls" && "active"}
                  onClick={() => setCurrentView("polls")}
                >
                  <NavPollsSvg />
                  Polls
                </button>
                <button
                  className={currentView === "stories" && "active"}
                  onClick={() => setCurrentView("stories")}
                >
                  <NavStoriesSvg />
                  Posts
                </button>
                <button
                  className={currentView === "groups" && "active"}
                  onClick={() => setCurrentView("groups")}
                >
                  <NavGroupSvg />
                  Groups
                </button>
                <button
                  className={currentView === "users" && "active"}
                  onClick={() => setCurrentView("users")}
                >
                  <UsersSvg />
                  Users
                </button>
              </div>
              <p>
                {aspirants.length +
                  polls.length +
                  stories.length +
                  groups.length +
                  users.length}{" "}
                Search Results
              </p>
            </div>
            {pageLoading ? (
              <Loader pageLoading={pageLoading} />
            ) : (
              <div className="col-lg-8">
                {/* profiles  */}
                {currentView === "profiles" && (
                  <>
                    {aspirants.length === 0 ? (
                      <p>No matching aspirant Profiles for '{param}'</p>
                    ) : (
                      <>
                        <div className="profile">
                          {aspirants.map((aspirant, index) => {
                            return (
                              <SingleProfileCard
                                aspirant={aspirant}
                                key={index}
                              />
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* polls  */}
                {currentView === "polls" && (
                  <>
                    {polls.length === 0 ? (
                      <p>No matching polls for '{param}'</p>
                    ) : (
                      <>
                        <div className="polls-page">
                          <p>'{param}' is found in the following polls</p>
                        </div>
                        <div className="polls">
                          {polls.map((poll, index) => {
                            let pollVotes = poll.aspirant.reduce(
                              (total, aspirant) => {
                                let increament = aspirant.votes.length;
                                total += increament;
                                if (total !== 0) {
                                  return total;
                                } else {
                                  return 0.000000001;
                                }
                              },
                              0
                            );
                            let liveVotes = poll.aspirant.reduce(
                              (total, aspirant) => {
                                let increament = parseInt(aspirant.livevote);
                                total += increament;
                                if (total !== 0) {
                                  return total;
                                } else {
                                  return 0.000000001;
                                }
                              },
                              0
                            );
                            return (
                              <PollCard
                                poll={poll}
                                key={index}
                                pollVotes={pollVotes}
                                liveVotes={liveVotes}
                                fetchPolls={fetchPolls}
                              />
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* stories */}
                {currentView === "stories" && (
                  <>
                    {stories.length === 0 ? (
                      <p>No matching stories for '{param}'</p>
                    ) : (
                      <>
                        <div className="polls-page">
                          <p>'{param}' is found in the following stories</p>
                        </div>
                        <div className="story">
                          {stories
                            .map((story, index) => {
                              return (
                                <StoryCard
                                  story={story}
                                  stories={stories}
                                  setStories={setStories}
                                  index={index}
                                  key={index}
                                />
                              );
                            })
                            .reverse()}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* groups  */}
                {currentView === "groups" && (
                  <>
                    {groups.length === 0 ? (
                      <p>No matching Group for '{param}'</p>
                    ) : (
                      <>
                        {groups.map((group, index) => {
                          return <GroupCard group={group} key={index} />;
                        })}
                      </>
                    )}
                  </>
                )}

                {/* users  */}
                {currentView === "users" && (
                  <>
                    {users.map((user, index) => {
                      return (
                        <div
                          className="group-card"
                          onClick={() => navigate(`/user/${user._id}`)}
                        >
                          <div className="row align-items-center">
                            <div className="col-lg-7 col-md-7 col-sm-7 col-7 d-flex align-items-center">
                              <div className="img-container">
                                {user.image !== null &&
                                user.image !== undefined ? (
                                  <img src={user.image} alt="profile-img" />
                                ) : (
                                  <img src="/img/place.jpg" alt="profile-img" />
                                )}
                                <img src="/img/candidate.png" alt="" />
                              </div>
                              <div>
                                <h3>
                                  {user.firstname} {user.lastname}
                                </h3>
                                <h6>{user.username}</h6>
                              </div>
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-5 col-5 d-flex justify-content-end">
                              <button>Follow</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
            {/* footer  */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Search;
