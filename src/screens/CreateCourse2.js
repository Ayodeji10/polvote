import React, { useState } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";
import ModuleCreateard from "../components/moduleCreateCard";

function CreateCourse2() {
  const [modules, setModules] = useState([{ title: "", assets: [] }]);
  const [error, setError] = useState("");

  // add module
  const addModule = () => {
    setError("");
    const item = { title: "", assets: [] };
    setModules([...modules, item]);
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
            <div className="information mb-4">
              <h3>Course Modules</h3>
              {modules.map((module, i) => {
                return (
                  <ModuleCreateard
                    module={module}
                    modules={modules}
                    index={i}
                    key={i}
                    setModules={setModules}
                    setError={setError}
                  />
                );
              })}
              <h6 className="error">{error}</h6>
              <button id="add-module" onClick={addModule}>
                <i className="fa-solid fa-circle-plus" />
                Add Module
              </button>
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

export default CreateCourse2;
