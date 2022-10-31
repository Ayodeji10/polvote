import React, { useState } from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";

function CreateCourse4() {
  const [repeatScore, setRepeatScore] = useState("");

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
            <div className="information pricing mb-4">
              <h3>Pricing</h3>
              <p>
                Kindly select your currency and input the price you for your
                course. If you want to offer your course for free, input “0”
                instead.
              </p>
              <div className="d-flex align-items-center gap-5">
                <div>
                  <label htmlFor="">Currency</label>
                  <select
                    value={repeatScore}
                    onChange={(e) => setRepeatScore(e.target.value)}
                  >
                    <option value="yes" selected={repeatScore === "yes"}>
                      Yes
                    </option>
                    <option value="no" selected={repeatScore === "no"}>
                      No
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="">Course price</label>
                  <input type="number" placeholder="Type Here" />
                </div>
              </div>
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

export default CreateCourse4;
