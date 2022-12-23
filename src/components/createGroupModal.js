import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import axios from "axios";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

function CreateGroupModal({ createGroupModal, setCreateGroupModal }) {
  // context
  const { context } = useContext(DataContext);

  // navigate
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [useUnits, setUseUnits] = useState("no");
  const [units, setUnits] = useState([{ unit: "" }]);

  // add unit
  const addUnit = () => {
    setUnits([...units, { unit: "" }]);
  };

  // delete unit
  const deleteUnit = (index) => {
    if (units.length === 1) {
      setError("You cant have less than one unit");
    } else {
      const newUnits = [...units];
      newUnits.splice(index, 1);
      setUnits(newUnits);
    }
  };

  // handle unit input
  const handleUnitInput = (index, e) => {
    setUnits(
      units.map((unit, i) => {
        if (i !== index) {
          return unit;
        }
        return { unit: e.target.value };
      })
    );
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createGroup = () => {
    console.log(name);
    console.log(units);
    setError("");
    if (name === "") {
      setError("Please Enter Group name");
    } else {
      setLoading(true);
      axios
        .post(
          `${API.API_ROOT}/group`,
          {
            groupname: name,
            ...(useUnits === "yes" && { units: units }),
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${context.user.token}`,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          navigate(`/groups/${response.data.data._id}`);
          // window.location.reload();
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
      <label htmlFor="unit">Would you like to add units to your group</label>
      <select
        name="unit"
        id="unit"
        onChange={(e) => setUseUnits(e.target.value)}
      >
        <option value="no" selected={useUnits === "no"}>
          No
        </option>
        <option value="yes" selected={useUnits === "yes"}>
          Yes
        </option>
      </select>
      {useUnits === "yes" && (
        <>
          <label htmlFor="add">Add Unit</label>
          {units.map((unit, index) => {
            return (
              <div className="row align-items-center mb-4" key={index}>
                <div className="col-10">
                  <input
                    className="mb-0"
                    type="text"
                    placeholder="Enter Unit Name"
                    value={unit.unit}
                    onChange={(e) => handleUnitInput(index, e)}
                  />
                </div>
                <div className="col-1">
                  <img
                    src="/img/trash.png"
                    alt="delete"
                    onClick={() => deleteUnit(index)}
                  />
                </div>
                <div className="col-1">
                  {index === units.length - 1 && (
                    <img
                      src="/img/plus sign.png"
                      alt="add unit"
                      onClick={addUnit}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
      <h6 className="error-msg mb-3 text-center">{error}</h6>
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
