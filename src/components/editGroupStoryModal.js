import React, { useContext, useState } from "react";
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
Modal.setAppElement("#root");

function EditGroupStoryModal({ story, setEditStoryModal, index, openModal }) {
  // context
  const { context } = useContext(DataContext);

  // share story
  const [editImages, setEditImages] = useState(story.image);
  const [newImages, setNewImages] = useState([]);
  const [editStoryText, setEditStoryText] = useState(story.post);
  const [editAnonymous, setEditAnonymous] = useState(false);

  const modules = {
    toolbar: [
      // [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      // [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        // { 'indent': '-1' }, { 'indent': '+1' }
      ],
      [
        "link",
        // 'image', 'video'
      ],
      // ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  // click to add image
  const addShareImage = (index) => {
    document.getElementById(`add-image${index}`).click();
  };

  // add image to array
  const handleSharePreviewer = (e) => {
    const selectedFiles = e.target.files;
    const selectedFileArray = Array.from(selectedFiles);
    setNewImages((prev) => prev.concat(selectedFileArray));
  };

  // remove edit image
  const removeEditImage = (index) => {
    const filteredEditImage = editImages.filter((image, i) => index !== i);
    setEditImages(filteredEditImage);
  };

  // remove new image
  const removeNewImage = (index) => {
    const filteredEditImage = newImages.filter((image, i) => index !== i);
    setNewImages(filteredEditImage);
  };

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const editStory = () => {
    setEditLoading(true);
    setEditError("");
    const fd = new FormData();
    fd.append("post", editStoryText); // text
    fd.append("ananymous", editAnonymous); // anonymous
    let oldImages = JSON.stringify(editImages); // old images
    fd.append("imageold", oldImages);
    for (const key of Object.keys(newImages)) {
      //new images
      fd.append("image", newImages[key]);
    }

    console.log(Array.from(fd));
    axios({
      url: `${API.API_ROOT}/post/editstory/${story._id}`,
      method: "patch",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${context.user.token}`,
      },
      data: fd,
    }).then(
      (response) => {
        setEditLoading(false);
        // console.log(response)
        window.location.reload();
      },
      (error) => {
        setEditLoading(false);
        // console.log(error)
        setEditError("Something went wrong, please try again");
      }
    );
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={() => setEditStoryModal(false)}
      className={`story-write-modal edit-story-modal ${
        context.darkMode ? "dm" : ""
      }`}
      id="share-story-modal"
    >
      <i
        className="far fa-times-circle"
        onClick={() => setEditStoryModal(false)}
      />
      <h2 className="header">Edit Post</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <div className="img-container">
            {context.user.image !== null && context.user.image !== undefined ? (
              <img
                src={context.user.image}
                alt="profile-img"
                id="profile-img"
              />
            ) : (
              <img src="/img/place.jpg" alt="profile-img" id="profile-img" />
            )}
          </div>
          <div>
            <h3>
              {context.user.firstname} {context.user.lastname}
            </h3>
            <h4 className="mb-0">{context.user.username}</h4>
          </div>
        </div>
        {/* <select name="status" id="status" onChange={(e) => setShareAnonymous(e.target.value)}>
                    <option value={false}>Public</option>
                    <option value={true}>Stay Anonymous</option>
                </select> */}
      </div>
      <ReactQuill
        theme="snow"
        placeholder="Share your thought"
        value={editStoryText}
        onChange={setEditStoryText}
        modules={modules}
        formats={formats}
      />
      {/* <textarea name id cols={30} rows={2} placeholder="Share your thought" value={editStoryText} onChange={(e) => setEditStoryText(e.target.value)} /> */}
      <div className="row">
        {editImages.map((image, index) => {
          return (
            <div
              className="col-lg-6 d-flex justify-content-between align-items-start"
              key={index}
            >
              <img src={image} alt="img" className="img-fluid mb-3" />
              <i
                className="fa-solid fa-trash-can"
                onClick={() => removeEditImage(index)}
              ></i>
            </div>
          );
        })}
        {newImages.map((image, index) => {
          return (
            <div
              className="col-lg-6 d-flex justify-content-between align-items-start"
              key={index}
            >
              <img
                src={URL.createObjectURL(image)}
                alt="img"
                className="img-fluid mb-3"
              />
              <i
                className="fa-solid fa-trash-can"
                onClick={() => removeNewImage(index)}
              ></i>
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <span>Add Image</span>
          <i className="fas fa-camera" onClick={() => addShareImage(index)} />
          <input
            type="file"
            hidden
            id={`add-image${index}`}
            accept="image/*"
            multiple
            max="3"
            onChange={handleSharePreviewer}
          />
        </div>
        <div>
          <p>{editError}</p>
          <button id="post" onClick={editStory}>
            {editLoading ? "loading..." : "Update Post"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditGroupStoryModal;
