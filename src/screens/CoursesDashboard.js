import React, { useState } from 'react'
import Aside from '../components/aside'
import Footer from '../components/footer'
import Nav from '../components/nav'
import { Link } from "react-router-dom";

function CoursesDashboardUser() {
    const [currentView, setCurrentView] = useState('progress')
    const [admin, setAdmin] = useState(false)
    const [adminView, setAdminView] = useState("courses")

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
                        <div className="header mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Link to={'/courses'}><span className="mb-0"><img src="/img/back.png" alt="back" />Back</span></Link>
                                <div className="searchbar d-flex align-items-center">
                                    <input type="text" placeholder="Search for a Course" />
                                    <img src="/img/search-normal.png" alt="search" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="switch">
                                    <input type="checkbox" onClick={() => setAdmin(!admin)} />
                                    <span className="slider" />
                                </label>
                                <p className="mb-0">{admin ? "Switch to Student Mode" : "Switch to Course Administrator"}</p>
                            </div>
                        </div>

                        {/* user board */}
                        {admin !== true &&
                            <>
                                <div className="board">
                                    <section className="d-flex">
                                        <button className={currentView === 'progress' && 'active'} onClick={() => setCurrentView('progress')}>In Progress</button>
                                        <button className={currentView === 'complete' && 'active'} onClick={() => setCurrentView('complete')}>Completed</button>
                                    </section>

                                    {/* in progress */}
                                    {currentView === 'progress' &&
                                        <>
                                            <div className="course">
                                                <div className="row align-items-center">
                                                    <div className="col-lg-3">
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
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
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
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
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
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
                                    }

                                    {/* complete */}
                                    {currentView === "complete" &&
                                        <>
                                            <div className="course">
                                                <div className="row align-items-center">
                                                    <div className="col-lg-3">
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
                                                    </div>
                                                    <div className="col-lg-5">
                                                        <h3>Cultural Diversity and Trade</h3>
                                                        <span>Great Work! You have passed all requirements and can view your course
                                                            certificate now.</span>
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
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
                                                    </div>
                                                    <div className="col-lg-5">
                                                        <h3>Cultural Diversity and Trade</h3>
                                                        <span>Great Work! You have passed all requirements and can view your course
                                                            certificate now.</span>
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
                                                        <img src="/img/pexels-george-ikwegbu-2379429 1.png" alt="" />
                                                    </div>
                                                    <div className="col-lg-5">
                                                        <h3>Cultural Diversity and Trade</h3>
                                                        <span>Great Work! You have passed all requirements and can view your course
                                                            certificate now.</span>
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
                                    }
                                </div>
                            </>
                        }

                        {/* admin board */}
                        {admin === true &&
                            <div className="admin">
                                <div className="button-container d-flex justify-content-between">
                                    <button className={adminView === 'courses' && "active"} onClick={() => setAdminView('courses')}><img src="/img/courses.png" alt="courses" />My Courses</button>
                                    <button className={adminView === 'new-course' && "active"} onClick={() => setAdminView('new-course')}><img src="/img/create.png" alt="add-course" />Create Course</button>
                                    <button className={adminView === 'resources' && "active"} onClick={() => setAdminView('resources')}><img src="/img/resource.png" alt="resourced" />Modules</button>
                                    <button className={adminView === 'instructor' && "active"} onClick={() => setAdminView('instructor')}><img src="/img/person.png" alt="Instructor" />Resources</button>
                                    <button className={adminView === 'instructor' && "active"} onClick={() => setAdminView('instructor')}><img src="/img/person.png" alt="Instructor" />Instructor</button>
                                </div>

                                {/* courses  */}
                                {adminView === 'courses' &&
                                    <div className="courses">
                                        <select name="cars" id="cars">
                                            <option value="volvo">Newest</option>
                                            <option value="saab">Oldest</option>
                                            <option value="mercedes">A - Z</option>
                                            <option value="audi">Z - A</option>
                                            <option value="audi">Published First</option>
                                            <option value="audi">Unpublished First</option>
                                        </select>
                                        <div className="course">
                                            <div className="row">
                                                <div className="col-lg-2">
                                                    <img src="/img/sample-course.png" alt="course-img" />
                                                </div>
                                                <div className="col-lg-7 d-flex flex-column justify-content-between">
                                                    <h2>Public Administration and Bureaucracy</h2>
                                                    <p className="mb-0">DRAFT</p>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="d-flex flex-column justify-content-between align-items-end" id="edit">
                                                        <button>Complete Course</button>
                                                        <div className="d-flex justify-content-between align-items-end">
                                                            <h4 className="mb-0">Last Edited</h4>
                                                            <h4 className="mb-0">24 Dec, 2021</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course">
                                            <div className="row">
                                                <div className="col-lg-2">
                                                    <img src="/img/sample-course.png" alt="course-img" />
                                                </div>
                                                <div className="col-lg-7 d-flex flex-column justify-content-between">
                                                    <h2>Public Administration and Bureaucracy</h2>
                                                    <div>
                                                        <p className="mb-0">PUBLISHED</p>
                                                        <h4>Published on 22 January 2021</h4>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="d-flex flex-column justify-content-between align-items-end" id="edit">
                                                        <button>Edit Course</button>
                                                        <div className="d-flex justify-content-between align-items-end">
                                                            <h4 className="mb-0">Last Edited</h4>
                                                            <h4 className="mb-0">24 Dec, 2021</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* new course */}
                                {adminView === 'new-course' &&
                                    <div className="create-course">
                                        <h1>New Course Information</h1>
                                        <label htmlFor="title">Course Title</label>
                                        <input type="text" id="title" placeholder="Type Course Title Here" />
                                        <label htmlFor="about">About the Course</label>
                                        <textarea name id="about" placeholder="Type Here..." defaultValue={""} />
                                        <label htmlFor="learn">What Student will learn</label>
                                        <div className="row mb-5">
                                            <div className="col-lg-11 mb-3">
                                                <div className="input d-flex align-items-center justify-content-between">
                                                    <input type="text" placeholder="Type Here..." />
                                                    <i className="fa-solid fa-trash-can" />
                                                </div>
                                            </div>
                                            <div className="col-lg-1 d-flex justify-content-end">
                                                <i className=" fa-solid fa-circle-plus" />
                                            </div>
                                        </div>
                                        <label htmlFor="Syllabus">Course Syllabus</label>
                                        <textarea name id="Syllabus" placeholder="Type Here..." defaultValue={""} />
                                        {/* file  */}
                                        <div className="row align-items-center mb-5">
                                            <div className="col-lg-2">
                                                <img src="/img/file.png" alt="upload-file" className="img-fluid" />
                                            </div>
                                            <div className="col-lg-8">
                                                <h4>Course Cover image</h4>
                                                <p className="mb-0">Upload your course image here. It must meet our course image quality
                                                    standards to be accepted. Important guidelines: 750x422 pixels;
                                                    .jpg, .jpeg,. gif, or .png. no text on the image.</p>
                                            </div>
                                            <div className="col-lg-2">
                                                <button>Upload File</button>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button id="save">Save &amp; Proceed</button>
                                        </div>
                                    </div>
                                }

                                {/* resourses */}
                                {adminView === 'resources' &&
                                    <div className="ebook">
                                        <div className="header d-flex justify-content-between align-items-center">
                                            <select name="cars" id="cars">
                                                <option value="mercedes">eBook Resources</option>
                                                <option value="volvo">Quizes</option>
                                                <option value="saab">Video Resources</option>
                                            </select>
                                            <button><i className="fa-solid fa-circle-plus" />Create New Quiz</button>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="book">
                                                    <img src="/img/book1.png" alt="cover" />
                                                    <h1>City on the Edge</h1>
                                                    <p className="mb-0">Mark Goldman</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="book">
                                                    <img src="/img/book1.png" alt="cover" />
                                                    <h1>City on the Edge</h1>
                                                    <p className="mb-0">Mark Goldman</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="book">
                                                    <img src="/img/book1.png" alt="cover" />
                                                    <h1>City on the Edge</h1>
                                                    <p className="mb-0">Mark Goldman</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="book">
                                                    <img src="/img/book1.png" alt="cover" />
                                                    <h1>City on the Edge</h1>
                                                    <p className="mb-0">Mark Goldman</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* instructor */}
                                {adminView === "instructor" &&
                                    <div className="instructor">
                                        <div className="mb-4 d-flex justify-content-between align-items-center">
                                            <h2 className="mb-0">Select Instructor(s)</h2>
                                            <button><i className="fa-solid fa-circle-plus" />Create Instructor Profile</button>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="instructor">
                                                    <div className="img-container">
                                                        <img src="/img/person2.png" alt="profile-img" className="profile-img" />
                                                    </div>
                                                    <h3>James Lark</h3>
                                                    <h4>Lobbyist</h4>
                                                    <p className="mb-0">Track record in a sentence</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="instructor">
                                                    <div className="img-container">
                                                        <img src="/img/person2.png" alt="profile-img" className="profile-img" />
                                                    </div>
                                                    <h3>James Lark</h3>
                                                    <h4>Lobbyist</h4>
                                                    <p className="mb-0">Track record in a sentence</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="instructor">
                                                    <div className="img-container">
                                                        <img src="/img/person2.png" alt="profile-img" className="profile-img" />
                                                    </div>
                                                    <h3>James Lark</h3>
                                                    <h4>Lobbyist</h4>
                                                    <p className="mb-0">Track record in a sentence</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="instructor">
                                                    <div className="img-container">
                                                        <img src="/img/person2.png" alt="profile-img" className="profile-img" />
                                                    </div>
                                                    <h3>James Lark</h3>
                                                    <h4>Lobbyist</h4>
                                                    <p className="mb-0">Track record in a sentence</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="instructor">
                                                    <div className="img-container">
                                                        <img src="/img/person2.png" alt="profile-img" className="profile-img" />
                                                    </div>
                                                    <h3>James Lark</h3>
                                                    <h4>Lobbyist</h4>
                                                    <p className="mb-0">Track record in a sentence</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {/* similar courses  */}
                        <section>
                            <h1>Because you’ve completed these courses</h1>
                            <p>These are similar courses you can enrol for</p>
                            <div className="carousel">
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="course-img" />
                                    <div className="body px-3">
                                        <h3>Moral Foundations of Politics</h3>
                                        <div className="rating mb-4">
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <span>4.9</span>
                                            <span className="ratings">4,709 Ratings</span>
                                        </div>
                                        <p className="mb-0">When do governments deserve our allegiance, and when should they be
                                            denied it? The participants will be encouraged to dive into the complex theories
                                            and phenomena and get familiar with the concepts
                                            that are still very relevant in the co</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="course-img" />
                                    <div className="body px-3">
                                        <h3>Moral Foundations of Politics</h3>
                                        <div className="rating mb-4">
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <span>4.9</span>
                                            <span className="ratings">4,709 Ratings</span>
                                        </div>
                                        <p className="mb-0">When do governments deserve our allegiance, and when should they be
                                            denied it? The participants will be encouraged to dive into the complex theories
                                            and phenomena and get familiar with the concepts
                                            that are still very relevant in the co</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="course-img" />
                                    <div className="body px-3">
                                        <h3>Moral Foundations of Politics</h3>
                                        <div className="rating mb-4">
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <span>4.9</span>
                                            <span className="ratings">4,709 Ratings</span>
                                        </div>
                                        <p className="mb-0">When do governments deserve our allegiance, and when should they be
                                            denied it? The participants will be encouraged to dive into the complex theories
                                            and phenomena and get familiar with the concepts
                                            that are still very relevant in the co</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="course-img" />
                                    <div className="body px-3">
                                        <h3>Moral Foundations of Politics</h3>
                                        <div className="rating mb-4">
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star active" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <span>4.9</span>
                                            <span className="ratings">4,709 Ratings</span>
                                        </div>
                                        <p className="mb-0">When do governments deserve our allegiance, and when should they be
                                            denied it? The participants will be encouraged to dive into the complex theories
                                            and phenomena and get familiar with the concepts
                                            that are still very relevant in the co</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CoursesDashboardUser 