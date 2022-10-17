import React, { useState } from "react";
import Aside from "../components/aside";
import Footer from "../components/footer";
import Nav from "../components/nav";
import LoginPrompt from "../components/loginPrompt";
import AuthModals from "../components/authenticationModlas";
import { Link } from "react-router-dom";
import MyCoursesSvg from "../components/svg/MyLearningSvg.";

function Courses() {
  // auth modals
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  return (
    <div className="container-fluid">
      {/* navigation */}
      <Nav />
      {/* feed  */}
      <div className="home-feed container">
        <div className="row justify-content-md-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          {/* main  */}
          <div className="col-lg-8 col-md-9 courses-page">
            {/* header  */}
            <div className="header mb-4">
              <div className="row align-items-center">
                <div className="col-8">
                  <div className="searchbar d-flex align-items-center">
                    <input type="text" placeholder="Search for Course" />
                    <img src="/img/search-normal.png" alt="search" />
                  </div>
                </div>
                <div className="col-4 d-flex justify-content-around">
                  <span>
                    Categories
                    <i className="fa-solid fa-angle-down" />
                  </span>
                  <span>
                    <MyCoursesSvg />
                    My Learning
                  </span>
                </div>
              </div>
            </div>
            {/* hot picks */}
            <section>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1>Hot Picks for you!</h1>
                  <p>These are popular courses on BallotBox</p>
                </div>
                <div className="d-flex align-items-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      // checked={live}
                    />
                    <span className="slider" />
                  </label>
                  <p className="mb-0 label">Switch to Instructor Mode</p>
                </div>
              </div>
              <div className="carousel">
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
              </div>
            </section>
            {/* previously enrolled */}
            <section>
              <h1>Because you enrolled for Game Theory</h1>
              <p>These are similar courses</p>
              <div className="carousel">
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
              </div>
            </section>
            {/* commerce  */}
            <section>
              <h2>Some Courses About Commerce</h2>
              <div className="carousel">
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
              </div>
            </section>
            {/* recently added */}
            <section>
              <h2>Recently Added</h2>
              <div className="carousel">
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
                <div className="card">
                  <div className="top-img">
                    <img
                      src="img/pexels-george-ikwegbu-2379429 1.png"
                      alt="course-img"
                    />
                  </div>
                  <div className="body px-3">
                    <h3>Moral Foundations of Politics</h3>
                    <h6>James Jackson</h6>
                    <div className="rating mb-2">
                      <span>4.9</span>
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star active" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <span className="ratings">4,709 Ratings</span>
                    </div>
                    <h2 className="mb-0">N4,500</h2>
                  </div>
                </div>
              </div>
            </section>
            {/* footer  */}
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

export default Courses;
