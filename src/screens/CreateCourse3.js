import React, { useState, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import { DataContext } from "../dataContext";
import Modal from "react-modal";
import CreateProfileCard from "../components/createProfileCard";
Modal.setAppElement("#root");

function CreateCourse3() {
  // context
  const { context } = useContext(DataContext);

  const [createProfileModal, setCreateProfileModal] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [pic, setPic] = useState();
  const [editBtn, setEditBtn] = useState(false);
  const [editIndex, setEditInedex] = useState("");

  //   add instructor
  const addInstructor = () => {
    console.log(pic);
    setInstructors([
      ...instructors,
      {
        firstName: fname,
        lastName: lname,
        headline,
        about,
        image: pic,
      },
    ]);
    setCreateProfileModal(false);
  };

  // edit profile
  const editInstructor = () => {
    setInstructors(
      instructors.map((instructor, i) => {
        if (editIndex === i) {
          return {
            firstName: fname,
            lastName: lname,
            headline,
            about,
            image: pic,
          };
        }
        return instructor;
      })
    );
    setEditBtn(false);
    setEditInedex("");
    setCreateProfileModal(false);
  };

  return (
    <div className="container-fluid">
      {/* navigation */}
      <Nav />
      {/* feed  */}
      <div className="home-feed container">
        <div className="row">
          {/* aside  */}
          <div className="col-lg-3 aside">
            <Aside />
          </div>
          {/* gutter  */}
          <div className="col-lg-1" />
          {/* main  */}
          <div className="col-lg-8 create-course info">
            <h3>
              <i className="fa-solid fa-arrow-left" />
              Back to courses
            </h3>
            <div className="information profiles mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Course Modules</h3>
                <h3
                  id="add-profile"
                  className="mb-0"
                  onClick={() => setCreateProfileModal(true)}
                >
                  <i className="fa-solid fa-circle-plus" />
                  Add Instructor
                </h3>
              </div>
              <div className="row mt-5">
                {instructors.map((person, i) => {
                  return (
                    <CreateProfileCard
                      key={i}
                      person={person}
                      personIndex={i}
                      instructors={instructors}
                      setInstructors={setInstructors}
                      setCreateProfileModal={setCreateProfileModal}
                      setFname={setFname}
                      setLname={setLname}
                      setHeadline={setHeadline}
                      setAbout={setAbout}
                      setPic={setPic}
                      setEditBtn={setEditBtn}
                      setEditInedex={setEditInedex}
                    />
                  );
                })}
              </div>
              {/* create profile  */}
              <Modal
                isOpen={createProfileModal}
                onRequestClose={() => setCreateProfileModal(false)}
                id="create-quiz-modal"
                className={`${context.darkMode ? "dm" : ""}`}
              >
                <i
                  className="far fa-times-circle"
                  onClick={() => setCreateProfileModal(false)}
                />
                <h2>Instructor Profile</h2>
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  id="fname"
                  placeholder="Type Here"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  placeholder="Type Here"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
                <label htmlFor="Headline">Headline</label>
                <input
                  type="text"
                  id="Headline"
                  placeholder="Ex. UI/UX Instructor "
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <label htmlFor="about">About the Instructor</label>
                <textarea
                  id="about"
                  rows="5"
                  placeholder="Type Here"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                ></textarea>
                <label htmlFor="pic">Profile Picture</label>
                <p>
                  Upload your profile image here. It must meet our image quality
                  standards to be accepted. Important guidelines: 750x422
                  pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
                </p>
                <input
                  type="file"
                  id="pic"
                  accept="image/*"
                  // value={pic.name}
                  onChange={(e) => setPic(e.target.files[0])}
                />
                {editBtn ? (
                  <button onClick={editInstructor}>Update Instructor</button>
                ) : (
                  <button onClick={addInstructor}>Add Instructor</button>
                )}
              </Modal>
            </div>
            <div className="d-flex justify-content-end">
              <button id="preview">Preview</button>
              <button id="save">Save</button>
            </div>
            {/* footer  */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse3;
