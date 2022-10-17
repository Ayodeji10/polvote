import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/footer";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    getUserData();
    fetchCountries();
    fetchHistory();
    fetchFollowers();
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
                  {context.darkMode ? (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M23.625 3.5H0.875V21H23.625V3.5ZM21.875 19.25H2.625V5.25H21.875V19.25Z"
                          fill="#0A183D"
                        />
                        <path
                          d="M25.375 7.875V22.75H5.25V24.5H27.125V7.875H25.375Z"
                          fill="#0A183D"
                        />
                        <path
                          d="M12.25 16.5408C14.4211 16.5408 16.1875 14.6192 16.1875 12.2573C16.1875 9.89543 14.4211 7.97387 12.25 7.97387C10.0789 7.97387 8.3125 9.89538 8.3125 12.2573C8.3125 14.6193 10.0789 16.5408 12.25 16.5408ZM12.25 9.72388C13.4562 9.72388 14.4375 10.8604 14.4375 12.2573C14.4375 13.6543 13.4562 14.7908 12.25 14.7908C11.0438 14.7908 10.0625 13.6543 10.0625 12.2573C10.0625 10.8604 11.0438 9.72388 12.25 9.72388ZM4.375 7.4375H6.125V17.0625H4.375V7.4375ZM18.375 7.4375H20.125V17.0625H18.375V7.4375Z"
                          fill="#0A183D"
                        />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M23.625 3.5H0.875V21H23.625V3.5ZM21.875 19.25H2.625V5.25H21.875V19.25Z"
                          fill="white"
                        />
                        <path
                          d="M25.375 7.875V22.75H5.25V24.5H27.125V7.875H25.375Z"
                          fill="white"
                        />
                        <path
                          d="M12.25 16.5408C14.4211 16.5408 16.1875 14.6192 16.1875 12.2573C16.1875 9.89543 14.4211 7.97387 12.25 7.97387C10.0789 7.97387 8.3125 9.89538 8.3125 12.2573C8.3125 14.6193 10.0789 16.5408 12.25 16.5408ZM12.25 9.72388C13.4562 9.72388 14.4375 10.8604 14.4375 12.2573C14.4375 13.6543 13.4562 14.7908 12.25 14.7908C11.0438 14.7908 10.0625 13.6543 10.0625 12.2573C10.0625 10.8604 11.0438 9.72388 12.25 9.72388ZM4.375 7.4375H6.125V17.0625H4.375V7.4375ZM18.375 7.4375H20.125V17.0625H18.375V7.4375Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  )}
                  Payout Settings
                </button>
                <button onClick={(e) => setEditPassword(true)}>
                  {context.darkMode ? (
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.75 8.55534H20.8333C21.1096 8.55534 21.3746 8.66509 21.5699 8.86044C21.7653 9.05579 21.875 9.32074 21.875 9.597V22.097C21.875 22.3733 21.7653 22.6382 21.5699 22.8336C21.3746 23.0289 21.1096 23.1387 20.8333 23.1387H4.16667C3.8904 23.1387 3.62545 23.0289 3.4301 22.8336C3.23475 22.6382 3.125 22.3733 3.125 22.097V9.597C3.125 9.32074 3.23475 9.05579 3.4301 8.86044C3.62545 8.66509 3.8904 8.55534 4.16667 8.55534H6.25V7.51367C6.25 5.85607 6.90848 4.26636 8.08058 3.09425C9.25269 1.92215 10.8424 1.26367 12.5 1.26367C14.1576 1.26367 15.7473 1.92215 16.9194 3.09425C18.0915 4.26636 18.75 5.85607 18.75 7.51367V8.55534ZM16.6667 8.55534V7.51367C16.6667 6.4086 16.2277 5.34879 15.4463 4.56739C14.6649 3.78599 13.6051 3.34701 12.5 3.34701C11.3949 3.34701 10.3351 3.78599 9.55372 4.56739C8.77232 5.34879 8.33333 6.4086 8.33333 7.51367V8.55534H16.6667ZM11.4583 14.8053V16.8887H13.5417V14.8053H11.4583ZM7.29167 14.8053V16.8887H9.375V14.8053H7.29167ZM15.625 14.8053V16.8887H17.7083V14.8053H15.625Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.75 8.55534H20.8333C21.1096 8.55534 21.3746 8.66509 21.5699 8.86044C21.7653 9.05579 21.875 9.32074 21.875 9.597V22.097C21.875 22.3733 21.7653 22.6382 21.5699 22.8336C21.3746 23.0289 21.1096 23.1387 20.8333 23.1387H4.16667C3.8904 23.1387 3.62545 23.0289 3.4301 22.8336C3.23475 22.6382 3.125 22.3733 3.125 22.097V9.597C3.125 9.32074 3.23475 9.05579 3.4301 8.86044C3.62545 8.66509 3.8904 8.55534 4.16667 8.55534H6.25V7.51367C6.25 5.85607 6.90848 4.26636 8.08058 3.09425C9.25269 1.92215 10.8424 1.26367 12.5 1.26367C14.1576 1.26367 15.7473 1.92215 16.9194 3.09425C18.0915 4.26636 18.75 5.85607 18.75 7.51367V8.55534ZM16.6667 8.55534V7.51367C16.6667 6.4086 16.2277 5.34879 15.4463 4.56739C14.6649 3.78599 13.6051 3.34701 12.5 3.34701C11.3949 3.34701 10.3351 3.78599 9.55372 4.56739C8.77232 5.34879 8.33333 6.4086 8.33333 7.51367V8.55534H16.6667ZM11.4583 14.8053V16.8887H13.5417V14.8053H11.4583ZM7.29167 14.8053V16.8887H9.375V14.8053H7.29167ZM15.625 14.8053V16.8887H17.7083V14.8053H15.625Z"
                        fill="black"
                      />
                    </svg>
                  )}
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
                  {context.darkMode ? (
                    <svg
                      width={22}
                      height={20}
                      viewBox="0 0 22 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.3437 14.7598H17.696C17.5835 14.7598 17.4781 14.8052 17.4078 14.8853C17.2437 15.0692 17.0679 15.2466 16.8828 15.4153C16.1255 16.1151 15.2285 16.6727 14.2414 17.0574C13.2187 17.4561 12.1195 17.6607 11.0093 17.6589C9.88668 17.6589 8.79918 17.4555 7.77731 17.0574C6.79019 16.6727 5.89318 16.1151 5.1359 15.4153C4.37727 14.718 3.77235 13.8914 3.35466 12.9814C2.92106 12.0382 2.70309 11.0365 2.70309 10.0002C2.70309 8.96389 2.92341 7.96221 3.35466 7.01894C3.77184 6.10812 4.37184 5.28817 5.1359 4.58504C5.89996 3.88192 6.78824 3.32807 7.77731 2.94297C8.79918 2.5449 9.88668 2.34153 11.0093 2.34153C12.132 2.34153 13.2195 2.54273 14.2414 2.94297C15.2304 3.32807 16.1187 3.88192 16.8828 4.58504C17.0679 4.75596 17.2414 4.93336 17.4078 5.11509C17.4781 5.19514 17.5859 5.24057 17.696 5.24057H19.3437C19.4914 5.24057 19.5828 5.08913 19.5007 4.97447C17.7031 2.39562 14.5578 0.688645 10.9836 0.697298C5.36793 0.710279 0.865597 4.91822 0.921847 10.0954C0.978097 15.1903 5.4734 19.3031 11.0093 19.3031C14.5742 19.3031 17.7054 17.5983 19.5007 15.0259C19.5804 14.9113 19.4914 14.7598 19.3437 14.7598ZM21.4273 9.86389L18.1015 7.44081C17.9773 7.34995 17.7968 7.43216 17.7968 7.57711V9.22134H10.4375C10.3343 9.22134 10.25 9.29923 10.25 9.39442V10.606C10.25 10.7012 10.3343 10.779 10.4375 10.779H17.7968V12.4233C17.7968 12.5682 17.9796 12.6504 18.1015 12.5596L21.4273 10.1365C21.4497 10.1203 21.4678 10.0996 21.4803 10.076C21.4927 10.0524 21.4992 10.0265 21.4992 10.0002C21.4992 9.97392 21.4927 9.948 21.4803 9.92438C21.4678 9.90077 21.4497 9.88008 21.4273 9.86389Z"
                        fill="#0A183D"
                        fillOpacity="0.6"
                      />
                    </svg>
                  ) : (
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3437 16.7608H18.696C18.5835 16.7608 18.4781 16.8062 18.4078 16.8863C18.2437 17.0702 18.0679 17.2476 17.8828 17.4163C17.1255 18.116 16.2285 18.6737 15.2414 19.0584C14.2187 19.4571 13.1195 19.6617 12.0093 19.6598C10.8867 19.6598 9.79918 19.4565 8.77731 19.0584C7.79019 18.6737 6.89318 18.116 6.1359 17.4163C5.37727 16.719 4.77235 15.8924 4.35466 14.9824C3.92106 14.0391 3.70309 13.0375 3.70309 12.0012C3.70309 10.9649 3.92341 9.96319 4.35466 9.01992C4.77184 8.1091 5.37184 7.28914 6.1359 6.58602C6.89996 5.88289 7.78824 5.32905 8.77731 4.94395C9.79918 4.54587 10.8867 4.34251 12.0093 4.34251C13.132 4.34251 14.2195 4.54371 15.2414 4.94395C16.2304 5.32905 17.1187 5.88289 17.8828 6.58602C18.0679 6.75693 18.2414 6.93434 18.4078 7.11607C18.4781 7.19612 18.5859 7.24155 18.696 7.24155H20.3437C20.4914 7.24155 20.5828 7.09011 20.5007 6.97544C18.7031 4.39659 15.5578 2.68962 11.9836 2.69827C6.36793 2.71126 1.8656 6.91919 1.92185 12.0964C1.9781 17.1913 6.4734 21.3041 12.0093 21.3041C15.5742 21.3041 18.7054 19.5993 20.5007 17.0269C20.5804 16.9122 20.4914 16.7608 20.3437 16.7608ZM22.4273 11.8649L19.1015 9.44179C18.9773 9.35092 18.7968 9.43314 18.7968 9.57809V11.2223H11.4375C11.3343 11.2223 11.25 11.3002 11.25 11.3954V12.6069C11.25 12.7021 11.3343 12.78 11.4375 12.78H18.7968V14.4242C18.7968 14.5692 18.9796 14.6514 19.1015 14.5605L22.4273 12.1375C22.4497 12.1213 22.4678 12.1006 22.4803 12.077C22.4927 12.0534 22.4992 12.0274 22.4992 12.0012C22.4992 11.9749 22.4927 11.949 22.4803 11.9254C22.4678 11.9017 22.4497 11.8811 22.4273 11.8649Z"
                        fill="white"
                      />
                    </svg>
                  )}
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
