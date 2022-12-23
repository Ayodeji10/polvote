import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../components/apiRoot";
import Modal from "react-modal";
import UnitMemberCard from "./unitMemberCard";
Modal.setAppElement("#root");

function UnitCard({ unit, id, members, group }) {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  const [name, setName] = useState(unit.unit);

  const [unitModal, setUnitModal] = useState(false);
  const [unitError, setUnitError] = useState("");
  const [unitLoading, setUnitLoading] = useState(false);
  const [viewMembers, setViewMembers] = useState(false);

  const editUnit = () => {
    setUnitError("");
    if (name === "") {
      setUnitError("Please Enter Unit Name");
    } else {
      setUnitLoading(true);
      axios({
        url: `${API.API_ROOT}/group/editunit/${id}`,
        method: "patch",
        data: { unit: name, unitid: unit._id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      }).then(
        (response) => {
          //   console.log(response);
          setUnitLoading(false);
          window.location.reload();
        },
        (error) => {
          setUnitError("Something went wrong, please try again");
          setUnitLoading(false);
          console.log(error);
        }
      );
    }
  };

  const [loading, setLoading] = useState(false);
  const deleteUnit = () => {
    setLoading(true);
    axios({
      url: `${API.API_ROOT}/group/deleteunit/${id}`,
      method: "patch",
      data: { unitid: unit._id },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
      },
    }).then(
      (response) => {
        console.log(response);
        window.location.reload();
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <div className="unit">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-5 col-sm-3 col-5">
          <h3>Unit Name</h3>
          <p className="mb-0">{unit.unit}</p>
        </div>
        <div className="col-lg-1 col-md-1 col-sm-1 col-1 d-flex justify-content-end">
          {group.userid === context.user._id && (
            <>
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                <i className="fa-solid fa-trash-can" onClick={deleteUnit} />
              )}
            </>
          )}
        </div>
        <div className="col-lg-3 col-md-3 col-sm-4 col-6 d-flex justify-content-end">
          {group.userid === context.user._id && (
            <p className="mb-0" onClick={() => setUnitModal(true)}>
              <i className="fa-solid fa-pen" />
              Edit Unit Name
            </p>
          )}
          {/* edit unit modal  */}
          <Modal
            isOpen={unitModal}
            onRequestClose={() => setUnitModal(false)}
            id="group-modal"
            className={`${context.darkMode ? "dm" : ""}`}
          >
            <i
              className="far fa-times-circle"
              onClick={() => setUnitModal(false)}
            />
            <h1>Edit Unit Name</h1>
            <label htmlFor="name">Unit Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Unit Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="error-msg">{unitError}</p>
            <button onClick={editUnit}>
              {unitLoading ? (
                <>
                  Loading... <i className="fa-solid fa-spinner fa-spin" />
                </>
              ) : (
                "Save"
              )}
            </button>
          </Modal>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-4 col-12 d-flex justify-content-end">
          <p className="mb-0" onClick={() => setViewMembers(!viewMembers)}>
            See Members
            <i className={`fa-solid fa-angle-${viewMembers ? "up" : "down"}`} />
          </p>
        </div>
      </div>
      {viewMembers && (
        <>
          {members
            .filter(
              (member) => member.unitid === unit._id && member.status === 1
            )
            .map((member, i) => {
              return (
                <UnitMemberCard
                  group={group}
                  member={member}
                  unit={unit}
                  id={id}
                  key={i}
                />
              );
            })}
        </>
      )}
    </div>
  );
}

export default UnitCard;
