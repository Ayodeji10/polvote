import React, { useState } from "react";
import Aside from "../components/aside";
import Footer from "../components/footer";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";

function CourseDashboardInstructor() {
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
                Courses
              </h4>
              <div className="searchbar d-flex align-items-center">
                <input type="text" placeholder="Search for Course" />
                <img src="/img/search-normal.png" alt="search" />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/courses/dashboard`)}
              >
                <label className="switch">
                  <input type="checkbox" checked />
                  <span className="slider" />
                </label>
                <p className="mb-0 label">Switch to Student Mode</p>
              </div>
              <button>hello</button>
            </div>

            {/* user board */}
            <div className="board">
              <section className="d-flex">
                <button
                  className={currentView === "progress" && "active"}
                  onClick={() => setCurrentView("progress")}
                >
                  Drafts
                </button>
                <button
                  className={currentView === "complete" && "active"}
                  onClick={() => setCurrentView("complete")}
                >
                  Published
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
                        <p>PUBLISHED</p>
                        {/* <div className="bar">
                          <div className="indicator" />
                        </div> */}
                      </div>
                      <div className="col-lg-3 d-flex justify-content-end">
                        <button>Edit Course</button>
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

            {/* footer  */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDashboardInstructor;
