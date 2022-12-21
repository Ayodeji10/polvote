import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import Loader from "../components/loader";
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useParams, useNavigate } from "react-router-dom";
import AuthModals from "../components/authenticationModlas";
import LoginPrompt from "../components/loginPrompt";
import Modal from "react-modal";
import UnitCard from "../components/unitCard";
Modal.setAppElement("#root");

function GroupUnits() {
  // context
  const { context } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // params
  const { id } = useParams();

  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  const [group, setGroup] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  const fetchCurrentGroup = () => {
    axios
      .get(`${API.API_ROOT}/group/${id}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ballotbox_token")}`,
        },
      })
      .then((response) => {
        setGroup(response.data);
        setPageLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCurrentGroup();
  }, []);

  const [unitModal, setUnitModal] = useState(false);
  const [name, setName] = useState("");
  const [unitLoading, setUnitLoading] = useState(false);
  const [unitError, setUnitError] = useState("");

  const addUnit = () => {
    setUnitError("");
    if (name === "") {
      setUnitError("Please Enter Unit Name");
    } else {
      setUnitLoading(true);
      axios({
        url: `${API.API_ROOT}/group/addunit/${id}`,
        method: "post",
        data: { unit: name },
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

  return (
    <div className={`container-fluid ${context.darkMode ? "dm" : ""}`}>
      <Nav />
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3  aside">
            <Aside />
          </div>
          {/* main  */}
          <div className="col-md-9 col-12">
            <div className="group-unit">
              <header className="d-flex justify-content-between align-items-center mb-md-5 mb-3 mt-md-0 mt-3">
                <h4 className="mb-0" onClick={() => navigate(`/groups/${id}`)}>
                  <i className="fa-solid fa-arrow-left" />
                  Group Units
                </h4>
                <h6 onClick={() => setUnitModal(true)}>
                  <i className="fa-solid fa-circle-plus" />
                  Add Group Unit
                </h6>

                {/* add unit modal  */}
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
                  <h1>Add Unit</h1>
                  <label htmlFor="name">Unit Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter Unit Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="error-msg">{unitError}</p>
                  <button onClick={addUnit}>
                    {unitLoading ? (
                      <>
                        Loading... <i className="fa-solid fa-spinner fa-spin" />
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </Modal>
              </header>
              {/* requests */}
              {pageLoading ? (
                <Loader pageLoading={pageLoading} />
              ) : (
                <>
                  {group.units.map((unit, i) => {
                    return (
                      <UnitCard
                        unit={unit}
                        key={i}
                        id={id}
                        members={group.members}
                      />
                    );
                  })}
                </>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
      {/* authentication */}
      <AuthModals
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        signupModal={signupModal}
        setSignupModal={setSignupModal}
        verificationModal={verificationModal}
        setVerificationModal={setVerificationModal}
      />
      {/* login prompt  */}
      {localStorage.getItem("ballotbox_token") === null && (
        <LoginPrompt
          setLoginModal={setLoginModal}
          setSignupModal={setSignupModal}
        />
      )}
    </div>
  );
}

export default GroupUnits;
