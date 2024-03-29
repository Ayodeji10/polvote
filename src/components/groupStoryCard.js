import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import NewLineText from "../components/newLineText";
import ShareStoryModal from "./shareStoryModal";
import AuthModals from "./authenticationModlas";
import ShareStoryModalOut from "./shareStoryModalOut";
import Modal from "react-modal";
import DeleteGroupStoryModal from "./deleteGroupStoryModal";
import EditGroupStoryModal from "./editGroupStoryModal";
import GroupStoryComment from "./groupStoryComment";
Modal.setAppElement("#root");

function GroupStoryCard({ story, index }) {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // story modals
  const [shareStoryModal, setShareStoryModal] = useState(false);
  const [editStoryModal, setEditStoryModal] = useState(false);
  const [deleteStoryModal, setDeleteStoryModal] = useState(false);
  const [shareStoryModalOut, setShareStoryModalOut] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  // MemberAnswerModal
  const [memberAnswerModal, setMemberAnswerModal] = useState(false);
  // const [error, setError] = useState("");

  // utilities
  const [options, setOptions] = useState(false);
  const [commentLenght, setCommentLenght] = useState(0);
  const [storyLike, setStoryLike] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

  // see more and increase views
  const IncreaseViews = () => {
    setSeeMore(true);
    axios({
      url: `${API.API_ROOT}/story/storyviews/${story._id}`,
      method: "patch",
      headers: { Authorization: `Bearer ${context.user.token}` },
    }).then(
      (response) => {
        // console.log(response)
      },
      (error) => {
        // console.log(error)
      }
    );
  };

  // comment
  const [text, setText] = useState("");
  const [commentImg, setCommentImg] = useState(null);
  const [loading, setLoading] = useState(false);
  // comment image
  const addImage = () => {
    document.getElementById("add-image").click();
  };

  const comment = () => {
    if (localStorage.getItem("ballotbox_token") !== null) {
      setLoading(true);
      const fd = new FormData();
      fd.append("comment", text);
      if ((commentImg !== null) & (commentImg !== undefined)) {
        fd.append("image", commentImg);
      }
      axios({
        url: `${API.API_ROOT}/post/addcomment/${story._id}`,
        method: "patch",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.user.token}`,
        },
        data: fd,
      }).then(
        (response) => {
          console.log(response);
          setLoading(false);
          setText("");
          window.location.reload();
        },
        (error) => {
          console.log(error);
          setLoading(false);
        }
      );
    } else {
      setLoginModal(true);
    }
  };

  // lenght of comment showed
  const [commentLength, setCommentLength] = useState(2);

  // like
  const like = () => {
    if (localStorage.getItem("ballotbox_token") !== null) {
      if (storyLike === 1) {
        setStoryLike(0);
      } else {
        setStoryLike(1);
      }
      axios({
        url: `${API.API_ROOT}/post/likers/${story._id}`,
        method: "patch",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      }).then(
        (response) => {
          // console.log(response);
          // if (response.data.message === "New Likes Added Successfully") {
          //     setStoryLike(1)
          // }
          // if (response.data.Success === "Unliked Successfully") {
          //     setStoryLike(0)
          // }
        },
        (error) => {}
      );
    } else {
      setLoginModal(true);
    }
  };

  // show like on load
  useEffect(() => {
    if (
      story.likes.filter((like) => like.userid === context.user._id).length ===
      0
    ) {
      setStoryLike(0);
    } else {
      setStoryLike(1);
    }
  }, []);

  // get time stamp
  const [storytime, setStoryTIme] = useState("");
  const [storyDate, setStoryDate] = useState("");

  const getDate = () => {
    let today = new Date(); // today's date
    let d = new Date(story.createdAt); // story date

    // get days differenece
    const time = Math.abs(today - d);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));

    // set date
    if (days <= 1) {
      setStoryTIme(
        `${
          parseInt(story.createdAt.substring(11, 13)) + 1
        }${story.createdAt.substring(13, 16)} ${
          story.createdAt.substring(11, 13) >= 12 ? "PM" : "AM"
        }`
      );
    } else {
      setStoryTIme(
        `${
          parseInt(story.createdAt.substring(11, 13)) + 1
        }${story.createdAt.substring(13, 16)} ${
          story.createdAt.substring(11, 13) >= 12 ? "PM" : "AM"
        }`
      );
      if (days < 30) {
        setStoryDate(`${days - 1} day${days - 1 > 1 ? "s" : ""} ago`);
      } else {
        setStoryDate(
          `${story.createdAt.substring(8, 10)}-${story.createdAt.substring(
            5,
            7
          )}-${story.createdAt.substring(0, 4)}`
        );
      }
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  return (
    <div className="story">
      {/* body  */}
      <div className="body">
        <div className="row mb-3 align-items-center">
          <div className="col-11 d-flex align-items-center gap-lg-3 gap-md-3 gap-sm-2 gap-2 position-relative">
            <div className="img-container">
              {story.groupimage === null || story.groupimage === undefined ? (
                <img
                  src="/img/place.jpg"
                  className="img-fluid"
                  alt="avatar"
                  id="profile-img"
                />
              ) : (
                <img src={story.groupimage} alt="avatar" id="profile-img" />
              )}
            </div>
            <div className="poster-img">
              {story.userimage === null || story.userimage === undefined ? (
                <img src="/img/candidate.png" alt="user" id="poster-img" />
              ) : (
                <img src={story.userimage} alt="user" id="poster-img" />
              )}
            </div>
            <div>
              <h3
                className="d-flex align-items-centter"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${story.userid}`);
                }}
              >
                {story.fullname}
                {/* <span
                  className="d-inline-flex align-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMemberAnswerModal(true);
                  }}
                >
                  <i class="fa-solid fa-circle"></i>Join
                </span> */}
              </h3>
              <div className="d-flex">
                <p className="mb-0">{story.username}</p>
                {storyDate && <p>{storyDate}</p>}
                {storytime && <p className="mb-0">{storytime}</p>}
              </div>
            </div>
          </div>
          <div className="col-1" onClick={() => setOptions(!options)}>
            <i className="fas fa-ellipsis-h" style={{ cursor: "pointer" }} />
            {!options ? (
              ""
            ) : (
              <div className="options">
                <div
                  className="d-flex align-items-center mb-2"
                  // onClick={() =>
                  //   navigator.clipboard.writeText(
                  //     `https://polvote.com/stories/${story.story
                  //       .replace(/(<([^>]+)>)/gi, "")
                  //       .replaceAll(" ", "-")
                  //       .replaceAll("?", "")
                  //       .substring(0, 45)}/${story._id}`
                  //   )
                  // }
                >
                  <i className="fa-solid fa-copy" />
                  <h4 className="mb-0">Copy Link</h4>
                </div>
                {/* <div className="d-flex align-items-center mb-2">
                  <i className="fa-solid fa-retweet" />
                  <h4
                    className="mb-0"
                    onClick={() => {
                      if (localStorage.getItem("ballotbox_token") === null) {
                        setLoginModal(true);
                      } else {
                        setShareStoryModal(true);
                      }
                    }}
                  >
                    Re-Post
                  </h4>
                </div> */}
                <div
                  className="d-flex align-items-center mb-2"
                  onClick={() => navigate(`/stories/groups/${story._id}`)}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <h4 className="mb-0">Open Post</h4>
                </div>
                {story.userid === context.user._id &&
                  localStorage.getItem("ballotbox_token") !== null && (
                    <>
                      <div
                        className="d-flex align-items-center mb-2"
                        onClick={() => setEditStoryModal(true)}
                      >
                        <i className="fa-solid fa-pen-to-square" />
                        <h4 className="mb-0">Edit Post</h4>
                      </div>
                      <div
                        className="d-flex align-items-center mb-2"
                        onClick={() => setDeleteStoryModal(true)}
                      >
                        <i className="fa-solid fa-trash-can" />
                        <h4 className="mb-0">Delete Post</h4>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        </div>
        {/* story text  */}
        <div className="storyText">
          {story.post.split("\r\n").length > 1 ? (
            <NewLineText text={story.post} />
          ) : (
            <>
              {!seeMore ? (
                <div className="mb-2">
                  <p
                    style={{ display: "inline" }}
                    dangerouslySetInnerHTML={{
                      __html: `${story.post
                        .replaceAll("<p>", "")
                        .replaceAll("</p>", "")
                        .substring(0, 400)}`,
                    }}
                  ></p>
                  {story.post.replace(/(<([^>]+)>)/gi, "").length > 400 && (
                    <span style={{ cursor: "pointer" }} onClick={IncreaseViews}>
                      ...see more
                    </span>
                  )}
                </div>
              ) : (
                <div className="mb-2">
                  <div dangerouslySetInnerHTML={{ __html: story.post }}></div>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setSeeMore(false)}
                  >
                    ...see less
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        {/* images  */}
        <div className="row mb-4 story-img">
          {story.image.length !== 0 && (
            <>
              {story.image.length === 1 ? (
                <div className="col-12" key={index}>
                  <img
                    src={story.image[0]}
                    alt="img"
                    className="single-story-img"
                    id="story-img"
                    onClick={() => setImageModal(true)}
                  />
                  <Modal
                    isOpen={imageModal}
                    onRequestClose={() => setImageModal(false)}
                    id="profileImgModal"
                    className={`${context.darkMode ? "dm" : ""}`}
                  >
                    <i
                      className="fas fa-times"
                      onClick={() => setImageModal(false)}
                    />
                    <img
                      src={story.image[0]}
                      alt="img"
                      className="img-fluid"
                      id="story-img"
                    />
                  </Modal>
                </div>
              ) : (
                <>
                  {story.image.map((each, index) => {
                    return (
                      <div className="col-6" key={index}>
                        <img
                          src={each}
                          alt="img"
                          className="img-fluid"
                          id="story-img"
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
        {/* shared story info  */}
        {story.postinfo.length !== 0 && (
          <div className="shareStory mt-4">
            <div className="row mb-3 align-items-center">
              <div className="col-2 col-sm-1 col-md-1 col-lg-1">
                <div className="img-container">
                  {story.postinfo[0].userimage === null ||
                  story.postinfo[0].userimage === undefined ? (
                    <img
                      src="/img/place.jpg"
                      className="img-fluid"
                      alt="avatar"
                      id="profile-img"
                    />
                  ) : (
                    <img
                      src={story.storyinfo[0].userimage}
                      alt="avatar"
                      id="profile-img"
                    />
                  )}
                </div>
              </div>
              <div className="col-10 col-sm-11 col-md-11 col-lg-11 d-flex flex-column justify-content-center">
                <h3
                  onClick={(e) => {
                    // e.preventDefault();
                    // navigate(`/user/${story.storyinfo[0].userid}`);
                  }}
                >
                  {story.postinfo[0].fullname}
                </h3>
                <div className="d-flex">
                  <p className="mb-0">{story.postinfo[0].username}</p>
                </div>
              </div>
            </div>
            {story.postinfo[0].image.length <= 1 ? (
              <div className="col-12 mt-4 mb-3" key={index}>
                <img
                  src={`${story.postinfo[0].image[0]}`}
                  alt="img"
                  className="single-story-img"
                  id="story-img"
                />
              </div>
            ) : (
              <div className="row mb-2">
                {story.postinfo[0].image.map((each, index) => {
                  return (
                    <div className="col-6 mt-4 mb-3" key={index}>
                      <img
                        src={`${each}`}
                        alt="img"
                        className="img-fluid"
                        id="story-img"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <NewLineText text={story.postinfo[0].story} />
          </div>
        )}
      </div>
      {/* widget  */}
      <div className="widget">
        <div className="row justify-content-md-center">
          <div
            className="col-5 d-flex align-items-center justify-content-center"
            // onClick={() =>
            //   navigate(
            //     `/stories/${story.story
            //       .replace(/(<([^>]+)>)/gi, "")
            //       .replaceAll(" ", "-")
            //       .replaceAll("?", "")
            //       .substring(0, 45)}/${story._id}`
            //   )
            // }
          >
            <img
              src={
                context.darkMode ? "/img/comments-lm.png" : "/img/comment.png"
              }
              alt="comment"
            />
            <span>{story.comments.length + commentLenght}</span>
          </div>
          <div className="col-2 d-flex align-items-center justify-content-center">
            <i
              className={
                storyLike === 0 ? "fa-regular fa-heart" : "fa-solid fa-heart"
              }
              onClick={like}
            />
            <span>{story.likes.length + storyLike}</span>
          </div>
          <div
            className="col-5 d-flex align-items-center justify-content-center"
            onClick={() => setShareStoryModalOut(true)}
          >
            <img
              src={context.darkMode ? "/img/share-lm.png" : "/img/share.png"}
              alt="share"
            />
            <span>{story.shares.length}</span>
          </div>
        </div>
      </div>
      {/* comments  */}
      {window.location.pathname !== "/user-profile" && (
        <>
          <div className="comment">
            <div className="row align-items-center">
              <div className="col-1">
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
                </div>
              </div>
              <div className="col-8">
                <div className="input d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    placeholder="Leave a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <input
                    type="file"
                    id="add-image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setCommentImg(e.target.files[0])}
                  />
                  <i className="fa-regular fa-image" onClick={addImage} />
                </div>
              </div>
              <div className="col-3">
                <button onClick={comment}>
                  <img src="/img/send.png" alt="send" />
                  {loading ? "loading" : "Send"}
                </button>
              </div>
            </div>
          </div>
          {story.comments.length > 0 && (
            <div className="comments">
              <h2>Comments</h2>
              {story.comments.slice(0, commentLength).map((comment, index) => {
                return (
                  <GroupStoryComment
                    story={story}
                    comment={comment}
                    id={story._id}
                    key={index}
                  />
                );
              })}
              {story.comments.length > 2 && (
                <h5
                  id="loadMore"
                  onClick={() => setCommentLength(story.comments.length)}
                >
                  Load more comments
                </h5>
              )}
            </div>
          )}
        </>
      )}

      {/* share modal  */}
      {shareStoryModal && (
        <ShareStoryModal
          story={story}
          index={index}
          openModal={shareStoryModal}
          setShareStoryModal={setShareStoryModal}
        />
      )}
      {/* edit story modal */}
      {editStoryModal && (
        <EditGroupStoryModal
          story={story}
          index={index}
          openModal={editStoryModal}
          setEditStoryModal={setEditStoryModal}
        />
      )}
      {/* deleteStoryModal  */}
      {deleteStoryModal && (
        <DeleteGroupStoryModal
          story={story}
          openModal={deleteStoryModal}
          setDeleteStoryModal={setDeleteStoryModal}
        />
      )}
      {/* share story out modal  */}
      {shareStoryModalOut && (
        <ShareStoryModalOut
          story={story}
          openModal={shareStoryModalOut}
          setShareStoryModalOut={setShareStoryModalOut}
        />
      )}

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
    // }
  );
}

export default GroupStoryCard;
