import React, { useState } from "react";

function CreateProfileCard({
  person,
  personIndex,
  instructors,
  setInstructors,
  setCreateProfileModal,
  setFname,
  setLname,
  setHeadline,
  setAbout,
  setPic,
  setEditBtn,
  setEditInedex,
}) {
  const [sub, setSub] = useState(false);

  // delete profile
  const deleteProfile = () => {
    const newInstructors = [...instructors];
    newInstructors.splice(personIndex, 1);
    setInstructors(newInstructors);
    setSub(false);
  };

  return (
    <div className="col-3">
      <div className="instructor">
        <i className="fa-solid fa-ellipsis" onClick={() => setSub(!sub)} />
        <div className="img-container">
          <img src={URL.createObjectURL(person.image)} alt="profile-image" />
        </div>
        <h4>
          {person.firstName} {person.lastName}
        </h4>
        <p className="mb-0">{person.headline}</p>
        {sub && (
          <div className="sub">
            <h5
              className="mb-3"
              onClick={() => {
                setFname(person.firstName);
                setLname(person.lastName);
                setHeadline(person.headline);
                setAbout(person.about);
                setPic(person.image);
                setEditBtn(true);
                setEditInedex(personIndex);
                setSub(false);
                setCreateProfileModal(true);
              }}
            >
              <i className="fa-solid fa-pen" />
              Edit Instructor Profile
            </h5>
            <h5 className="delete" onClick={deleteProfile}>
              <i className="fa-regular fa-trash-can" />
              Delete Instructor Profile
            </h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateProfileCard;
