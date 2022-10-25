import React, { useState } from "react";
import Aside from "../components/aside";
import Footer from "../components/footer";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";

function CoursesDashboardUser() {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("progress");

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
          <div className="col-lg-8 courses-page dashboard">
            {/* header  */}
            <div className="header d-flex justify-content-between align-items-center">
              <h4 className="mb-0" onClick={() => navigate(`/courses`)}>
                <i className="fa-solid fa-arrow-left" />
                My Learning
              </h4>
              <div className="searchbar d-flex align-items-center">
                <input type="text" placeholder="Search for Course" />
                <img src="/img/search-normal.png" alt="search" />
              </div>
            </div>
            <div
              className="d-flex align-items-center mb-5"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/courses/dashboard/instructor`)}
            >
              <label className="switch">
                <input
                  type="checkbox"
                  // checked={live}
                />
                <span className="slider" />
              </label>
              <p className="mb-0 label">Switch to Instructor Mode</p>
            </div>

            <div className="board">
              <section className="d-flex">
                <button
                  className={currentView === "progress" && "active"}
                  onClick={() => setCurrentView("progress")}
                >
                  In Progress
                </button>
                <button
                  className={currentView === "complete" && "active"}
                  onClick={() => setCurrentView("complete")}
                >
                  Completed
                </button>
              </section>

              {/* in progress */}
              {currentView === "progress" && (
                <>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-6">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>Module 7 / 12</span>
                        <p>The Awesome Trade Experience in the Sub-Sahara</p>
                        <div className="d-flex align-items-center footer">
                          <div className="bar">
                            <div className="indicator" />
                          </div>
                          <span>Overall Progress</span>
                          <span>64%</span>
                        </div>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <button>Continue</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-6">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>Module 7 / 12</span>
                        <p>The Awesome Trade Experience in the Sub-Sahara</p>
                        <div className="d-flex align-items-center footer">
                          <div className="bar">
                            <div className="indicator" />
                          </div>
                          <span>Overall Progress</span>
                          <span>64%</span>
                        </div>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <button>Continue</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-6">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>Module 7 / 12</span>
                        <p>The Awesome Trade Experience in the Sub-Sahara</p>
                        <div className="d-flex align-items-center footer">
                          <div className="bar">
                            <div className="indicator" />
                          </div>
                          <span>Overall Progress</span>
                          <span>64%</span>
                        </div>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <button>Continue</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* complete */}
              {currentView === "complete" && (
                <>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-5">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>
                          Great Work! You have passed all requirements and can
                          view your course certificate now.
                        </span>
                      </div>
                      <div className="col-lg-3 d-flex justify-content-end">
                        <button>Download Certificate</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-5">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>
                          Great Work! You have passed all requirements and can
                          view your course certificate now.
                        </span>
                      </div>
                      <div className="col-lg-3 d-flex justify-content-end">
                        <button>Download Certificate</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                  <div className="course">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <img
                          src="/img/pexels-george-ikwegbu-2379429 1.png"
                          alt=""
                        />
                      </div>
                      <div className="col-lg-5">
                        <h3>Cultural Diversity and Trade</h3>
                        <span>
                          Great Work! You have passed all requirements and can
                          view your course certificate now.
                        </span>
                      </div>
                      <div className="col-lg-3 d-flex justify-content-end">
                        <button>Download Certificate</button>
                      </div>
                      <div className="col-lg-1 d-flex justify-content-end">
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* similar courses  */}
            <section>
              <h1>Recommended courses for you</h1>
              <p>These are similar courses you can enrol for</p>
              <div className="carousel">
                <div className="card">
                  <div className="top-img">
                    <img
                      src="/img/pexels-george-ikwegbu-2379429 1.png"
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
                      src="/img/pexels-george-ikwegbu-2379429 1.png"
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
                      src="/img/pexels-george-ikwegbu-2379429 1.png"
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
                      src="/img/pexels-george-ikwegbu-2379429 1.png"
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
    </div>
  );
}

export default CoursesDashboardUser;
