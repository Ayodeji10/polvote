import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import axios from "axios";
Modal.setAppElement("#root");

function CreateGroupModal({ createGroupModal, setCreateGroupModal }) {
  // context
  const { context } = useContext(DataContext);

  const [options, setOptions] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createGroup = () => {
    if (name === "") {
      setError("Please Enter Group name and Select Type");
    } else {
      setLoading(true);
      axios
        .post(
          `${API.API_ROOT}/group`,
          {
            groupname: name,
            grouptype: type,
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${context.user.token}`,
            },
          }
        )
        .then((response) => {
          console.log(name, type);
          console.log(response);
          window.location.reload();
          setLoading(false);
        })
        .catch((error) => {
          setError("Something went wrong, Please try agai later");
          setLoading(false);
        });
    }
  };

  return (
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
      <div className="d-flex align-items-center mb-3">
        <div className="img-container">
          {context.user.image !== null && context.user.image !== undefined ? (
            <img src={context.user.image} alt="admin" />
          ) : (
            <img src="/img/place.jpg" alt="placeholder" />
          )}
        </div>
        <div>
          <h3 className="mb-0">
            {context.user.firstname} {context.user.lastname}
          </h3>
          <p className="mb-0">Admin</p>
        </div>
      </div>
      <label htmlFor="name">Group Name</label>
      <input
        type="text"
        id="name"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="type">Public/Private</label>
      <div className="drop">
        <div
          className="link d-flex justify-content-between"
          onClick={() => setOptions(!options)}
        >
          {type === "" ? (
            <span>Select Public / Private</span>
          ) : (
            <p className="mb-0" id="option">
              {type}
            </p>
          )}
          <i className="fa-solid fa-angle-down" />
        </div>
        {options && (
          <div className="drop-menu">
            <div
              className="d-flex"
              onClick={() => {
                setType("public");
                setOptions(false);
              }}
            >
              <i class="fa-solid fa-earth-americas"></i>
              <div>
                <h3>Public</h3>
                <p>Anyone can see who is in the group and what they post</p>
              </div>
            </div>
            <div
              className="d-flex"
              onClick={() => {
                setType("private");
                setOptions(false);
              }}
            >
              <i class="fa-solid fa-lock"></i>
              <div>
                <h3>Private</h3>
                <p>
                  Only members can see who is in the group and what they post
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="mb-3 text-center">{error}</p>
      <button onClick={createGroup}>
        {loading ? (
          <>
            Loading... <i className="fa-solid fa-spinner fa-spin" />
          </>
        ) : (
          "Create Group"
        )}
      </button>
    </Modal>
  );
}

export default CreateGroupModal;
