import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/footer";
import Nav from "../components/nav";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../dataContext";
import { removeUserSession } from "../utils/common";
import { API } from "../components/apiRoot";
import axios from "axios";
import StoryCard from "../components/storyCard";
import SingleProfileCard from "../components/singleProfileCard";
import WriteStoryModal from "../components/writeStoryModal";
import Loader from "../components/loader";
import Modal from "react-modal";
import MyProfileSvg from "../components/svg/MyProfileSvg";
import MyWalletSvg from "../components/svg/MyWalletSvg";
import MyPayoutSettingsSvg from "../components/svg/MyPayoutSettingsSvg";
import EditPasswordSvg from "../components/svg/EditPasswordSvg";
import LogoutSvg from "../components/svg/LogoutSvg";
import PromotionsSvg from "../components/svg/PromotionsSvg";
import { isContentEditable } from "@testing-library/user-event/dist/utils";
Modal.setAppElement("#root");

function UserProfile() {
  // context
  const { context, setContext } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // redirect if user is not logged in
  useEffect(() => {
    if (localStorage.getItem("ballotbox_token") === null) {
      navigate("/");
    }
  }, []);

  const [walletView, setWalletView] = useState("stories");

  // modal
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // profile setting
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState("");

  // handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfileUpdateError(null);
    setProfileUpdateLoading(true);
    axios
      .post(
        `${API.API_ROOT}/users/editprofile`,
        {
          firstname: context.user.firstname,
          lastname: context.user.lastname,
          email: context.user.email,
          username: context.user.username,
          phonenumber: context.user.phonenumber,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setContext({ ...context, user: { ...context.user, ...response.data } });
        setProfileUpdateLoading(false);
        // window.location.reload()
      })
      .catch((error) => {
        setProfileUpdateLoading(false);
        setProfileUpdateError("Something went wrong, please try again");
        console.error(error);
      });
  };

  // password change
  const [oldPasswoord, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState("");

  // handl update password
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordUpdateError(null);
    setPasswordUpdateLoading(true);
    if (newPassword !== confirmPassword) {
      setPasswordUpdateError("New passwords dont match");
    } else {
      axios
        .post(
          `${API.API_ROOT}/users/changepassword`,
          { password: oldPasswoord, passwordnew: newPassword },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${context.user.token}`,
            },
          }
        )
        .then((response) => {
          // console.log(response)
          // setContext({ ...context, user: response.data, backupUser: response.data })
          setPasswordUpdateLoading(false);
          // window.location.reload()
        })
        .catch((error) => {
          setPasswordUpdateLoading(false);
          setPasswordUpdateError("Something went wrong, please try again");
          console.error(error);
        });
    }
  };

  // fetch aspirants, storie, countries and transactions
  // const [aspirantLoading, setAspirantLoading] = useState(true)
  const [aspirants, setAspirants] = useState([]);
  // const fetchAspirants = async () => {
  //     const response = await axios
  //         .get(`${API.API_ROOT}/aspirant`)
  //         .catch((error) => [
  //             console.log('Err', error)
  //         ]);
  //     setAspirants(response.data)
  //     setAspirantLoading(false)
  // }

  // const [storiesLoading, setStoriesLoading] = useState(true)
  const [stories, setStories] = useState([]);
  // const fetchStories = async () => {
  //     const response = await axios
  //         .get(`${API.API_ROOT}/story`)
  //         .catch((error) => [
  //             console.log('Err', error)
  //         ]);
  //     setStories(response.data)
  //     setStoriesLoading(false)
  // }

  // get story likes
  const [userTotalLikes, setUserTotalLikes] = useState(0);
  let storyTotalLikes = stories
    .filter((story) => story.userid === context.user._id)
    .reduce((total, story) => {
      let increament = story.likes.length;
      total += increament;
      return total;
    }, 0);
  useEffect(() => {
    setUserTotalLikes(storyTotalLikes);
  }, [stories]);

  const [dataLoading, setDataLoading] = useState(true);
  const getUserData = () => {
    axios
      .post(
        `${API.API_ROOT}/users/viewprofile`,
        { userid: context.user._id },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
          },
        }
      )
      .then((response) => {
        // console.log(response)
        if (response.data.message !== "Token is not valid") {
          setStories(response.data.story);
          setAspirants(response.data.aspirant);
          // setStoriesLoading(false)
          // setAspirantLoading(false)
        }
        setDataLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setDataLoading(false);
      });
  };

  // get story wallet total
  const [storyTotal, setStoryTotal] = useState(0);
  let storyWallet = stories
    .filter((story) => story.userid === context.user._id)
    .reduce((total, story) => {
      let increament =
        story.storyviews.filter(
          (view) => view.status === "0" || view.status === "3"
        ).length * 5; // multiplied by conversion rate (5naira per view of story)
      total += increament;
      return total;
    }, 0);
  useEffect(() => {
    setStoryTotal(storyWallet);
  }, [stories]);

  // countries
  const [countries, setCountries] = useState([]);
  const fetchCountries = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/countries/countries`)
      .catch((error) => [console.log("Err", error)]);
    setCountries(response.data);
  };

  // transction history
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const fetchHistory = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/wallet`)
      .catch((error) => [console.log("Err", error)]);
    setHistory(response.data);
    setHistoryLoading(false);
  };

  // followers
  const [followers, setFollowers] = useState([]);
  const fetchFollowers = () => {
    axios
      .get(`${API.API_ROOT}/follow/followers/${context.user._id}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        // console.log(response)
        setFollowers(response.data.followers);
        // setLoading(false)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // fetch polls and groups
  const [polls, setPolls] = useState([]);
  const fetchPolls = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/polls`)
      .catch((error) => [console.log("Err", error)]);
    setPolls(response.data);
    // console.log(response.data);
  };

  // get referrals
  const [referals, setReferals] = useState([]);
  const fetchReferrals = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/reference/${context.user._id}`)
      .catch((error) => [console.log("Err", error)]);
    console.log(response);
    setReferals(response.data);
  };

  useEffect(() => {
    getUserData();
    fetchCountries();
    fetchHistory();
    fetchFollowers();
    fetchPolls();
    fetchReferrals();
  }, []);

  // cover picture
  // click cover photo input
  const coverPhoto = () => {
    document.getElementById("cover-pic").click();
  };

  // cover image and looader
  const [coverImgae, setCoverImage] = useState(null);
  const [coverPhotoLoader, setCoverPhotoLoader] = useState(false);

  // upload cover image
  useEffect(() => {
    if (coverImgae !== null) {
      setCoverPhotoLoader(true);
      const fd = new FormData();
      fd.append("image", coverImgae);
      console.log(coverImgae);
      console.log(Array.from(fd));
      axios({
        url: `${API.API_ROOT}/users/coverimage`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          console.log(response);
          // navigate(`/edit-aspirant/setup-aspirant/${id}`)
          setContext({
            ...context,
            user: { ...context.user, coverimage: response.data.coverimage },
          });
          setCoverPhotoLoader(false);
        },
        (error) => {
          setCoverPhotoLoader(false);
          // setError('Something went wrong, please try again')
          console.log(error);
        }
      );
    }
  }, [coverImgae]);

  // profile picture
  // click profile photo input
  const profilePhoto = () => {
    document.getElementById("profile-pic").click();
  };

  // // cover image and looader
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicLoader, setProfilePicLoader] = useState(false);

  // // upload profile pic, check if it is updated and upload immediately
  useEffect(() => {
    if (profilePic !== null) {
      setProfilePicLoader(true);
      const fd = new FormData();
      fd.append("image", profilePic);
      axios({
        url: `${API.API_ROOT}/users/addimage`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          // console.log(response)
          setContext({
            ...context,
            user: { ...context.user, image: response.data.image },
          });
          setProfilePicLoader(false);
        },
        (error) => {
          setProfilePicLoader(false);
          // console.log(error)
        }
      );
    }
  }, [profilePic]);

  // log out
  const [logoutModal, setLogoutModal] = useState(false);

  // write story
  const [writeStoryModal, setWriteStoryModal] = useState(false);

  const handleWriteStoryModal = (variable) => {
    setWriteStoryModal(variable);
  };

  // update payout settings
  const [paySettingLoader, setPaySettingLoader] = useState(false);
  const [paySettingError, setPaySettingError] = useState("");
  const [paySettingSuccess, setPaySettingSuccess] = useState(false);

  const updatePaySettings = () => {
    setPaySettingLoader(true);
    setPaySettingError("");
    if (
      context.user.bankname === "" ||
      context.user.bankcountry === "" ||
      context.user.accountname === "" ||
      context.user.accountnumber === "" ||
      context.user.sortcode === ""
    ) {
      setPasswordUpdateError("Please fill all account details");
      setPasswordUpdateLoading(false);
    } else {
      axios({
        url: `${API.API_ROOT}/users/paymentsettings`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: {
          bankname: context.user.bankname,
          bankcountry: context.user.bankcountry,
          accountname: context.user.accountname,
          accountnumber: context.user.accountnumber,
          sortcode: context.user.sortcode,
        },
      }).then(
        (response) => {
          setContext({ ...context, user: response.data.users });
          setPaySettingSuccess(true);
          setPaySettingLoader(false);
          setPaySettingError("");
          setTimeout(() => {
            setPaySettingSuccess(false);
          }, 800000);
        },
        (error) => {
          console.log(error);
          setPaySettingLoader(false);
        }
      );
    }
  };

  // withdrawal modal
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [withdrawalModalState, setWithdrawalModalState] = useState("proceed");

  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const withdraw = () => {
    if (storyTotal < 10000) {
      setWithdrawalModalState(false);
    } else {
      setWithdrawalLoading(true);
      axios
        .post(
          `${API.API_ROOT}/wallet/withdrawl`,
          {
            amount: storyTotal,
            bankname: context.user.bankname,
            bankcountry: context.user.bankcountry,
            accountname: context.user.accountname,
            accountnumber: context.user.accountnumber,
            sortcode: context.user.sortcode,
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${context.user.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setWithdrawalLoading(false);
          setWithdrawalModalState(true);
        })
        .catch((error) => {
          console.error(error);
          setWithdrawalLoading(false);
        });
    }
  };

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      {/* navigation */}
      <Nav />
      <div className="home-feed container">
        <div className="row">
          <div className="col-lg- col-md-9 col-12 order-lg-1 order-md-1 order-sm-2 order-2">
            <div className="user-main">
              <div
                className="user-widget"
                style={{
                  backgroundImage:
                    context.user.coverimage != undefined &&
                    `url(${context.user.coverimage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <button
                  className="d-flex justify-content-center align-items-center"
                  onClick={coverPhoto}
                >
                  {coverPhotoLoader ? (
                    <i className="fa-solid fa-spinner fa-spin" />
                  ) : (
                    <i className="fa-solid fa-pen" />
                  )}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id="cover-pic"
                  hidden
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
                <div className="img-container">
                  {context.user.image !== null &&
                  context.user.image !== undefined ? (
                    <img
                      src={context.user.image}
                      alt="profile-img"
                      id="profile-img"
                    />
                  ) : (
                    <img
                      src="/img/place.jpg"
                      alt="profile-img"
                      id="profile-img"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="profile-pic"
                    onChange={(e) => {
                      setProfilePic(e.target.files[0]);
                    }}
                  />
                </div>
                {profilePicLoader ? (
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    id="profilePicLoader"
                  />
                ) : (
                  <img
                    id="change-img"
                    src={`img/add-img${context.darkMode ? "2" : ""}.png`}
                    alt="change-profile-pic"
                    onClick={profilePhoto}
                  />
                )}
              </div>
              <div className="bio">
                <div className="d-flex justify-content-end mt-3 mb-lg-5 mb-md-4 mb-sm-3 mb-2">
                  <button onClick={() => setEditProfile(true)}>
                    Edit Profile
                  </button>
                  {/* edit profile modal  */}
                  <Modal
                    isOpen={editProfile}
                    onRequestClose={() => setEditProfile(false)}
                    id="edit-profile"
                    className={`${context.darkMode ? "dm" : ""}`}
                  >
                    <i
                      className="fa-solid fa-circle-xmark"
                      onClick={() => setEditProfile(false)}
                    />
                    <h1>Edit Profile</h1>
                    <label htmlFor="fname">First Name</label>
                    <input
                      type="text"
                      name=""
                      id="fname"
                      placeholder="First Name"
                      value={context.user.firstname}
                      onChange={(e) =>
                        setContext({
                          ...context,
                          user: { ...context.user, firstname: e.target.value },
                        })
                      }
                    />
                    <label htmlFor="lname">Last Name</label>
                    <input
                      type="text"
                      name=""
                      id="lname"
                      placeholder="Last Name"
                      value={context.user.lastname}
                      onChange={(e) =>
                        setContext({
                          ...context,
                          user: { ...context.user, lastname: e.target.value },
                        })
                      }
                    />
                    <label htmlFor="Username">Username</label>
                    <input
                      type="text"
                      name=""
                      id="Username"
                      placeholder="Username"
                      value={context.user.username}
                      onChange={(e) =>
                        setContext({
                          ...context,
                          user: { ...context.user, username: e.target.value },
                        })
                      }
                    />
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      name=""
                      id="email"
                      placeholder="Email Address"
                      value={context.user.email}
                    />
                    <label htmlFor="number">Phone Number</label>
                    <input
                      type="number"
                      id="number"
                      placeholder="+234567890"
                      value={context.user.phonenumber}
                      onChange={(e) =>
                        setContext({
                          ...context,
                          user: {
                            ...context.user,
                            phonenumber: e.target.value,
                          },
                        })
                      }
                    />
                    <button onClick={(e) => handleProfileUpdate(e)}>
                      {profileUpdateLoading ? (
                        <>
                          loading...
                          <i className="fa-solid fa-spinner fa-spin" />
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </Modal>
                </div>
                <h1 className="mb-0">
                  {context.user.firstname} {context.user.lastname}
                </h1>
                <h4>{context.user.username}</h4>
                {/* followers  */}
                <div className="row mb-3">
                  <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                    <h3>
                      0 <span>Followers</span>
                    </h3>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-3 col-5">
                    <h3>
                      0 <span>Following</span>
                    </h3>
                  </div>
                </div>
                <div className="row mb-lg-4 mb-md-3 mb-sm-3 mb-3 impresssions">
                  <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                    <h3>
                      {
                        stories.filter(
                          (story) => story.userid === context.user._id
                        ).length
                      }{" "}
                      <span>
                        Post
                        {stories.filter(
                          (story) => story.userid === context.user._id
                        ).length !== 1 && "s"}
                      </span>
                    </h3>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                    <h3>
                      {userTotalLikes}{" "}
                      <span>Like{userTotalLikes !== 1 && "s"}</span>
                    </h3>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6 col-4">
                    <h3>
                      {
                        aspirants.filter(
                          (aspirant) =>
                            aspirant.creatorid === context.user._id &&
                            aspirant.status === "1"
                        ).length
                      }{" "}
                      <span>Aspirant Profiles</span>
                    </h3>
                  </div>
                </div>
              </div>

              {/* articles  */}
              {context.profileView === "articles" && (
                <>
                  <div className="d-flex justify-content-between page-nav">
                    <button
                      className={context.articleView === "stories" && "active"}
                      onClick={() =>
                        setContext({ ...context, articleView: "stories" })
                      }
                    >
                      Posts
                    </button>
                    <button
                      className={
                        context.articleView === "aspirants" && "active"
                      }
                      onClick={() =>
                        setContext({ ...context, articleView: "aspirants" })
                      }
                    >
                      Aspirant Profiles
                    </button>
                    <button
                      className={context.articleView === "courses" && "active"}
                      onClick={() =>
                        setContext({ ...context, articleView: "courses" })
                      }
                    >
                      Courses
                    </button>
                  </div>

                  {/* stories */}
                  {context.articleView === "stories" && (
                    <>
                      {dataLoading ? (
                        <Loader pageLoading={dataLoading} />
                      ) : (
                        <>
                          {stories.filter(
                            (story) => story.userid === context.user._id
                          ).length < 1 ? (
                            <div className="empty">
                              {context.darkMode ? (
                                <img
                                  src="/img/empty-stories-lt.png"
                                  alt="no stories"
                                />
                              ) : (
                                <img
                                  src="/img/empty-stories.png"
                                  className="img-fluid"
                                  alt="no stories"
                                />
                              )}
                              <p>No Stories Yet</p>
                            </div>
                          ) : (
                            <>
                              {writeStoryModal && (
                                <WriteStoryModal
                                  openModal={writeStoryModal}
                                  handleWriteStoryModal={handleWriteStoryModal}
                                />
                              )}
                              <div className="story">
                                {stories
                                  .filter(
                                    (story) => story.userid === context.user._id
                                  )
                                  .map((story, index) => {
                                    return (
                                      <StoryCard story={story} key={index} />
                                    );
                                  })
                                  .reverse()}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* profile  */}
                  {context.articleView === "aspirants" && (
                    <>
                      {dataLoading ? (
                        <Loader pageLoading={dataLoading} />
                      ) : (
                        <>
                          {aspirants.filter(
                            (aspirant) =>
                              aspirant.creatorid === context.user._id &&
                              aspirant.status === "1"
                          ).length < 1 ? (
                            <div className="empty">
                              {context.darkMode ? (
                                <img
                                  src="/img/empty-profile-lt.png"
                                  className="img-fluid"
                                  alt="no stories"
                                />
                              ) : (
                                <img
                                  src="/img/empty-profile.png"
                                  className="img-fluid"
                                  alt="no stories"
                                />
                              )}
                              <p>No Profiles Created Yet</p>
                            </div>
                          ) : (
                            <div className="profile">
                              {aspirants
                                .filter(
                                  (aspirant) =>
                                    aspirant.creatorid === context.user._id &&
                                    aspirant.status === "1"
                                )
                                .map((aspirant, index) => {
                                  return (
                                    <SingleProfileCard
                                      aspirant={aspirant}
                                      key={index}
                                    />
                                  );
                                })
                                .reverse()}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {context.articleView == "courses" && (
                    <div className="empty">
                      <h1>Coming Soon!!!</h1>
                    </div>
                  )}
                </>
              )}
              {/* payout setting  */}
              {context.profileView === "pay" && (
                <div className="payout-setting mt-sm-3 mt-md-0 mt-3">
                  <h1>Manage your Payout Settings</h1>
                  <h3>
                    If you want to receive your payouts in your bank account,
                    you have to enter your bank details here.{" "}
                    <span>
                      Please ensure your account name is the same with your
                      profile name.
                    </span>
                  </h3>
                  {paySettingSuccess && (
                    <div className="row success-msg align-items-center">
                      <div className="col-11">
                        <h4 className="mb-0">
                          You have successfully updated your bank account
                          details
                        </h4>
                      </div>
                      <div className="col-1">
                        <i
                          onClick={() => setPaySettingSuccess(false)}
                          className="fa-solid fa-xmark"
                        />
                      </div>
                    </div>
                  )}
                  <label htmlFor="bankname">Bank Name</label>
                  <input
                    type="text"
                    id="bankname"
                    placeholder="FCMB"
                    value={context.user.bankname}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        user: { ...context.user, bankname: e.target.value },
                      })
                    }
                  />
                  <label htmlFor="bankcountry">Bank Country</label>
                  <select
                    name="category"
                    id="category"
                    onChange={(e) =>
                      setContext({
                        ...context,
                        user: { ...context.user, bankcountry: e.target.value },
                      })
                    }
                  >
                    <option value="">-- Select country --</option>
                    {countries.map((country) => {
                      return (
                        <option
                          value={country.country}
                          selected
                          key={country._id}
                        >
                          {country.country}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="accountname">Account Name</label>
                  <input
                    type="text"
                    id="accountname"
                    placeholder="James Jackson"
                    value={context.user.accountname}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        user: { ...context.user, accountname: e.target.value },
                      })
                    }
                  />
                  <label htmlFor="acctnumber">Account Number</label>
                  <input
                    type="number"
                    id="acctnumber"
                    placeholder="1234567890"
                    value={context.user.accountnumber}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        user: {
                          ...context.user,
                          accountnumber: e.target.value,
                        },
                      })
                    }
                  />
                  <label htmlFor="sortcode">Sort Code</label>
                  <input
                    type="number"
                    id="sortcode"
                    placeholder="032943479"
                    value={context.user.sortcode}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        user: { ...context.user, sortcode: e.target.value },
                      })
                    }
                  />
                  <h3>
                    <span>{paySettingError}</span>
                  </h3>
                  <button onClick={updatePaySettings}>
                    {paySettingLoader ? "Loading..." : "Save"}
                  </button>
                </div>
              )}
              {/* promotions */}
              {context.profileView === "promotions" && (
                <div className="promotions">
                  <div className="row">
                    <div className="col-3">
                      <h3>Polls</h3>
                    </div>
                    <div className="col-7">
                      <h3 className="text-center">No of Referral Clicks</h3>
                    </div>
                  </div>
                  {polls
                    .filter((poll) => poll.status === "0")
                    .map((poll, index) => {
                      return (
                        <div className="row" key={index}>
                          <div className="col-3">
                            <p>{poll.polltitle}</p>
                          </div>
                          <div className="col-7">
                            <p className="text-center">
                              {
                                referals.filter(
                                  (ref) =>
                                    ref.pollid === poll._id &&
                                    ref.referenceid === context.user._id
                                ).length
                              }
                            </p>
                          </div>
                          <div className="col-2">
                            <Link to={`/polls/${poll._id}`}>
                              Open Poll
                              <i className="fa-solid fa-angle-right" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              {/* wallet  */}
              {context.profileView === "wallet" && (
                <div className="wallet">
                  <div className="d-flex justify-content-between align-items-center page-nav">
                    <button
                      className={walletView === "stories" && "active"}
                      onClick={() => setWalletView("stories")}
                    >
                      {context.darkMode ? (
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z"
                            fill="#0A183D"
                            fillOpacity="0.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z"
                            fill="white"
                            fillOpacity="0.6"
                          />
                        </svg>
                      )}
                      Posts
                    </button>
                    <button
                      className={walletView === "courses" && "active"}
                      onClick={() => setWalletView("courses")}
                    >
                      {context.darkMode ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_4845_911)">
                            <path
                              d="M15.8395 19.8554C12.5143 17.4008 6.98846 13.2166 0.115356 12.3037L3.05329 9.43035C11.4864 12.6869 15.8395 19.8554 15.8395 19.8554ZM0.466253 15.2582L2.75867 13.4234C9.44887 15.0687 15.1228 19.8621 15.1228 19.8621C12.7336 18.5131 5.95563 15.1945 0.466253 15.2582ZM2.5708 8.60276L10.226 1.79172L11.8745 2.74593L8.1628 6.96C12.16 10.2563 16.5959 13.7628 16.1987 19.4789C12.2627 13.9026 7.62239 9.91448 2.57163 8.60276H2.5708ZM9.11453 6.83917L14.9945 0C18.1319 2.56552 19.8856 6.54869 19.8856 8.70041C19.6298 11.4497 16.941 18.0935 16.6927 18.8268C16.5065 17.1658 17.8795 14.2254 9.11453 6.83917Z"
                              fill="#0A183D"
                              fill-opacity="0.5"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_4845_911">
                              <rect
                                width="19.8621"
                                height="19.8621"
                                fill="white"
                                transform="translate(0.0689697)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_4839_50821)">
                            <path
                              d="M15.8394 19.8554C12.5142 17.4008 6.9884 13.2166 0.115295 12.3037L3.05323 9.43035C11.4863 12.6869 15.8394 19.8554 15.8394 19.8554ZM0.466192 15.2582L2.75861 13.4234C9.44881 15.0687 15.1227 19.8621 15.1227 19.8621C12.7335 18.5131 5.95557 15.1945 0.466192 15.2582ZM2.57074 8.60276L10.2259 1.79172L11.8745 2.74593L8.16274 6.96C12.16 10.2563 16.5958 13.7628 16.1986 19.4789C12.2626 13.9026 7.62233 9.91448 2.57157 8.60276H2.57074ZM9.11447 6.83917L14.9945 0C18.1318 2.56552 19.8855 6.54869 19.8855 8.70041C19.6298 11.4497 16.941 18.0935 16.6927 18.8268C16.5065 17.1658 17.8794 14.2254 9.11447 6.83917Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_4839_50821">
                              <rect
                                width="19.8621"
                                height="19.8621"
                                fill="white"
                                transform="translate(0.0689697)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      )}
                      Courses
                    </button>
                    <button
                      className={walletView === "history" && "active"}
                      onClick={() => setWalletView("history")}
                    >
                      <i className="fas fa-history"></i>
                      Transaction History
                    </button>
                    <div>
                      <p className="mb-0">Wallet Balance</p>
                      <h3>N{storyTotal.toFixed(2)}</h3>
                    </div>
                    <button onClick={() => setWithdrawalModal(true)}>
                      <img src="img/withdrawl.png" alt="withdrawl" />
                      {withdrawalLoading ? "Loading..." : "Withdraw"}
                    </button>
                    {/* withdrawal modal  */}
                    <Modal
                      isOpen={withdrawalModal}
                      onRequestClose={() => {
                        setWithdrawalModalState("proceed");
                        setWithdrawalModal(false);
                      }}
                      id="withdrawalModal"
                      className={`${context.darkMode ? "dm" : ""}`}
                    >
                      <i
                        className="fas fa-times"
                        onClick={() => {
                          setWithdrawalModalState("proceed");
                          setWithdrawalModal(false);
                        }}
                      />
                      {withdrawalModalState === "proceed" && (
                        <div className="proceed">
                          <h1>Withrawal Request</h1>
                          <p>
                            PS: You must have a minimum amount of N10,000 in
                            your wallet before you can withdraw.
                          </p>
                          <div className="row">
                            <div className="col-6">
                              <h4>Available Balance</h4>
                              <h2>N{storyTotal}</h2>
                            </div>
                            <div className="col-6">
                              <h4>MInimum Payout</h4>
                              <h2>N10,000</h2>
                            </div>
                          </div>
                          <button onClick={withdraw}>
                            {withdrawalLoading
                              ? "Loading..."
                              : "Withdraw Funds"}
                          </button>
                        </div>
                      )}
                      {withdrawalModalState === false && (
                        <div className="response">
                          <img
                            src="/img/false.png"
                            className="img-fluid"
                            alt="declined"
                          />
                          <h2>Withdrawal Failed!</h2>
                          <p>
                            You need to have a minimum amount of N10,000 before
                            you can withdraw
                          </p>
                        </div>
                      )}
                      {withdrawalModalState === true && (
                        <div className="response">
                          <img
                            src="/img/verify.png"
                            className="img-fluid"
                            alt="confirm"
                          />
                          <h2>One More Step!</h2>
                          <p>
                            A Verification link has been sent to{" "}
                            <span>{context.user.email}</span>. Please click on
                            the link to verify your withdrawal request.
                          </p>
                        </div>
                      )}
                    </Modal>
                  </div>

                  {walletView === "stories" && (
                    <>
                      {dataLoading ? (
                        <Loader pageLoading={dataLoading} />
                      ) : (
                        <>
                          {stories.filter(
                            (story) => story.userid === context.user._id
                          ).length < 1 ? (
                            <div className="empty">
                              {context.darkMode ? (
                                <img
                                  src="/img/empty-stories-lt.png"
                                  alt="no stories"
                                />
                              ) : (
                                <img
                                  src="/img/empty-stories.png"
                                  className="img-fluid"
                                  alt="no stories"
                                />
                              )}
                              <p>No Stories Yet</p>
                            </div>
                          ) : (
                            <div className="stories">
                              {stories
                                .filter(
                                  (story) => story.userid === context.user._id
                                )
                                .map((story, index) => {
                                  return (
                                    <div className="story" key={index}>
                                      <div className="row align-items-center">
                                        <div className="col-lg-10 col-sm-9 col-12 mb-2">
                                          <p className="mb-0">
                                            {story.story.substring(0, 200)}...
                                          </p>
                                        </div>
                                        <div className="col-lg-2 col-sm-3 col-12 d-flex flex-column">
                                          <span>
                                            {context.darkMode ? (
                                              <svg
                                                width="22"
                                                height="16"
                                                viewBox="0 0 22 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M20.257 6.962C20.731 7.582 20.731 8.419 20.257 9.038C18.764 10.987 15.182 15 11 15C6.818 15 3.236 10.987 1.743 9.038C1.51238 8.74113 1.3872 8.37592 1.3872 8C1.3872 7.62408 1.51238 7.25887 1.743 6.962C3.236 5.013 6.818 1 11 1C15.182 1 18.764 5.013 20.257 6.962V6.962Z"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11Z"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                width="22"
                                                height="16"
                                                viewBox="0 0 22 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M20.257 6.962C20.731 7.582 20.731 8.419 20.257 9.038C18.764 10.987 15.182 15 11 15C6.81801 15 3.23601 10.987 1.74301 9.038C1.51239 8.74113 1.38721 8.37592 1.38721 8C1.38721 7.62408 1.51239 7.25887 1.74301 6.962C3.23601 5.013 6.81801 1 11 1C15.182 1 18.764 5.013 20.257 6.962V6.962Z"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11Z"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                            )}
                                            {story.storyviews.length} View
                                            {story.storyviews.length !== 1 &&
                                              "s"}
                                          </span>
                                          <span>
                                            {context.darkMode ? (
                                              <svg
                                                width="22"
                                                height="16"
                                                viewBox="0 0 22 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M1 3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H19C19.5304 1 20.0391 1.21071 20.4142 1.58579C20.7893 1.96086 21 2.46957 21 3V13C21 13.5304 20.7893 14.0391 20.4142 14.4142C20.0391 14.7893 19.5304 15 19 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V3Z"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11Z"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M1 5C2.06087 5 3.07828 4.57857 3.82843 3.82843C4.57857 3.07828 5 2.06087 5 1"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M17 15C17 13.9391 17.4214 12.9217 18.1716 12.1716C18.9217 11.4214 19.9391 11 21 11"
                                                  stroke="#0A183D"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                width="22"
                                                height="16"
                                                viewBox="0 0 22 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M1 3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H19C19.5304 1 20.0391 1.21071 20.4142 1.58579C20.7893 1.96086 21 2.46957 21 3V13C21 13.5304 20.7893 14.0391 20.4142 14.4142C20.0391 14.7893 19.5304 15 19 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V3Z"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11Z"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M1 5C2.06087 5 3.07828 4.57857 3.82843 3.82843C4.57857 3.07828 5 2.06087 5 1"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                                <path
                                                  d="M17 15C17 13.9391 17.4214 12.9217 18.1716 12.1716C18.9217 11.4214 19.9391 11 21 11"
                                                  stroke="white"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                            )}
                                            N
                                            {story.storyviews.filter(
                                              (storyview) =>
                                                storyview.status === "0" ||
                                                storyview.status === "0"
                                            ).length * 5}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {walletView == "courses" && (
                    <div className="courses">
                      <h1>Coming Soon!!!</h1>
                    </div>
                  )}

                  {walletView === "history" && (
                    <div className="history">
                      <div className="row header mt-3">
                        <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                          <p>Status</p>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                          <p>Account Name</p>
                        </div>
                        <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                          <p>Amount</p>
                        </div>
                        <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                          <p>Bank Name</p>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                          <p>Acct Number</p>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-4">
                          <p>Reason of Rejection</p>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                          <p>Date &amp; Time</p>
                        </div>
                      </div>
                      {historyLoading ? (
                        <Loader pageLoading={dataLoading} />
                      ) : (
                        <>
                          {history.filter(
                            (history) => history.userid === context.user._id
                          ).length < 1 ? (
                            <div className="history-empty">
                              <h1>
                                <i className="fas fa-history"></i>No Transaction{" "}
                              </h1>
                            </div>
                          ) : (
                            <div className="transactions">
                              {history
                                .filter(
                                  (history) =>
                                    history.userid === context.user._id
                                )
                                .map((history, index) => {
                                  return (
                                    <div
                                      className="row align-items-center"
                                      key={index}
                                    >
                                      <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                                        {history.status === "0" ||
                                          (history.status === "1" && (
                                            <i class="fa-solid fa-triangle-exclamation"></i>
                                          ))}
                                        {/* <i class="fa-solid fa-triangle-exclamation"></i> */}
                                        {history.status === "2" && (
                                          <i class="fa-solid fa-square-check"></i>
                                        )}
                                        {history.status === "3" && (
                                          <i class="fa-solid fa-rectangle-xmark"></i>
                                        )}
                                      </div>
                                      <div className="col-lg-2 col-md-3 col-sm-3 col-4">
                                        <h3>{history.accountname}</h3>
                                      </div>
                                      <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                                        <h4>{history.amount}</h4>
                                      </div>
                                      <div className="col-lg-1 col-md-3 col-sm-3 col-4">
                                        <h3>{history.bankname}</h3>
                                      </div>
                                      <div className="col-lg-2 col-md-3 col-sm-3 col-4 mt-lg-0 mt-md-2 mt-sm-2 mt-2">
                                        <h3>{history.accountnumber}</h3>
                                      </div>
                                      <div className="col-lg-3 col-md-3 col-sm-3 col-4 mt-lg-0 mt-md-2 mt-sm-2 mt-2">
                                        <h4>
                                          {history.reason === null ||
                                          history.reason === undefined
                                            ? "Nil"
                                            : history.reason}
                                        </h4>
                                      </div>
                                      <div className="col-lg-2 col-md-3 col-sm-3 col-4 mt-lg-0 mt-md-2 mt-sm-2 mt-2">
                                        <h4>
                                          {history.createdAt.substring(0, 19)}
                                        </h4>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Footer />
          </div>
          <div className="col-lg-3 col-md-3 col-12 order-lg-2 order-md-2 order-sm-1 order-1 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
            <div className="aside-sticky">
              <div className="user-aside">
                <button
                  className={context.profileView === "articles" && "active"}
                  onClick={() =>
                    setContext({ ...context, profileView: "articles" })
                  }
                >
                  <MyProfileSvg />
                  My Profile
                </button>
                <button
                  className={context.profileView === "wallet" && "active"}
                  onClick={() =>
                    setContext({ ...context, profileView: "wallet" })
                  }
                >
                  <MyWalletSvg />
                  My Wallet
                </button>
                <button
                  className={context.profileView === "pay" && "active"}
                  onClick={() => setContext({ ...context, profileView: "pay" })}
                >
                  <MyPayoutSettingsSvg />
                  Payout Settings
                </button>
                <button
                  className={context.profileView === "promotions" && "active"}
                  onClick={() =>
                    setContext({ ...context, profileView: "promotions" })
                  }
                >
                  <PromotionsSvg />
                  Promotions
                </button>
                <button onClick={(e) => setEditPassword(true)}>
                  <EditPasswordSvg />
                  Edit Password
                </button>
                {/* edit password modal */}
                <Modal
                  isOpen={editPassword}
                  onRequestClose={() => setEditPassword(false)}
                  id="editPassword"
                  className={`${context.darkMode ? "dm" : ""}`}
                >
                  <i
                    className="fa-solid fa-circle-xmark"
                    onClick={() => setEditPassword(false)}
                  />
                  <h1>Edit Password</h1>
                  <label htmlFor="oldp">Current Password</label>
                  <input
                    type="password"
                    id="oldp"
                    placeholder="*******************"
                    value={oldPasswoord}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <label htmlFor="newp">New Password</label>
                  <input
                    type="password"
                    id="newp"
                    placeholder="*******************"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label htmlFor="again">Confirm Password</label>
                  <input
                    type="password"
                    id="again"
                    placeholder="*******************"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button onClick={handleUpdatePassword}>
                    {passwordUpdateLoading ? (
                      <>
                        loading...
                        <i className="fa-solid fa-spinner fa-spin" />
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </Modal>
                <button onClick={(e) => setLogoutModal(true)}>
                  <LogoutSvg />
                  Logout
                </button>
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
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                    <button
                      id="cancel-log"
                      onClick={() => {
                        setLogoutModal(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
