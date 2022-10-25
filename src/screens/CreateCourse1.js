import React from "react";
import Nav from "../components/nav";
import Aside from "../components/aside";
import Footer from "../components/footer";

function CreateCourse1() {
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
              <h3>Course Information</h3>
              <label htmlFor="title">Course Title</label>
              <input
                type="text"
                id="title"
                placeholder="Type Course Title Here"
              />
              <label htmlFor="category">Course Category</label>
              <input type="text" id="category" placeholder="Select Category" />
              <label htmlFor="desc">Course Description</label>
              <textarea type="text" id="desc" placeholder="Type Here..." />
              <label htmlFor="learn">
                What will students learn in your course?
              </label>
              <p>
                List the learning objectives students should expect to achieve
                after completing your course
              </p>
              <input type="text" id="learn" placeholder="Type Here" />
              <label htmlFor="require">
                Course Requirements or Pre-requistes
              </label>
              <p>
                List the required tools, skills, experience or equipments
                students should have before taking your course
              </p>
              <input type="text" id="require" placeholder="Type Here" />
              <label htmlFor="who">Whos is this course for?</label>
              <p>
                List descriptions of students who will find your course valuable
              </p>
              <input type="text" id="who" placeholder="Type Here" />
              <label htmlFor="image">Course Cover image</label>
              <p>
                Upload your course image here. It must meet our course image
                quality standards to be accepted. Important guidelines: 750x422
                pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
              </p>
              <input
                type="file"
                id="image"
                placeholder="Upload image"
                accept="image/*"
              />
              <label htmlFor="video">Free Preview Video</label>
              <p>
                Upload a short preview video for your course. Interested
                students who watch this video are 10 times likely to enroll for
                your course
              </p>
              <input type="file" id="video" accept="video/*" />
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

export default CreateCourse1;
