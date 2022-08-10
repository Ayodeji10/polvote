import React, { useState } from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import CourseInProgressWidget from '../components/courseInProgressWidget'
import { useNavigate } from "react-router-dom";

function CourseInProgress() {
    // history
    const navigate = useNavigate()

    const [currentView, setCurrentView] = useState("notes")

    return (
        <div className="container-fluid">
            {/* navigation */}
            <Nav />
            {/* feed  */}
            <div className="course-page container">
                <div className="row">
                    <div className="col-lg-3">
                        <CourseInProgressWidget />
                    </div>
                    <div className="col-lg-1" />
                    <div className="col-lg-8 main">
                        <div className="header d-flex justify-content-between">
                            <div>
                                <p>The Morals of Natural Politics</p>
                                <h1>Political theorists</h1>
                                <h5 className="mb-0">Nathaniel Nnamdi</h5>
                            </div>
                            <div className="d-flex align-items-start">
                                <span>CHAPTER 3/5</span>
                                <span className="d-flex">
                                    <button id="left"><i className="fa-solid fa-angle-left" /></button>
                                    <button id="right" className="active"><i className="fa-solid fa-angle-right" /></button>
                                </span>
                            </div>
                        </div>
                        <iframe width="100%" height={475} src="https://www.youtube.com/embed/dcbs4MMCsFc" className="mb-4" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        <div className="d-flex page justify-content-between align-items-center mb-4">
                            <div>
                                <button className={currentView === "notes" && "active"} onClick={() => setCurrentView('notes')}>
                                    <span>Notes</span>
                                    {currentView === "notes" && <i className="fa-solid fa-circle" />}
                                </button>
                                <button className={currentView === "resources" && "active"} onClick={() => setCurrentView('resources')}>
                                    <span>Resources</span>
                                    {currentView === "resources" && <i className="fa-solid fa-circle" />}
                                </button>
                                <button className={currentView === "quiz" && "active"} onClick={() => navigate("/courses/dashboard/single/quiz")}>
                                    <span>Quiz (3)</span>
                                    {currentView === "quiz" && <i className="fa-solid fa-circle" />}
                                </button>
                            </div>
                            <button className='active'><span>About Instructor</span></button>
                        </div>

                        {/* notes  */}
                        {currentView === 'notes' &&
                            <div className="chapter-text">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing sed amet
                                    vestibulum. Tellus velit tellus,
                                    risus tempor commodo netus vel fermentum id. Turpis libero dictum hendrerit viverra. Dictum
                                    sodales quam consectetur
                                    malesuada arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing
                                    sed amet vestibulum. Tellus
                                    velit tellus, risus tempor commodo netus vel fermentum id. Turpis libero dictum hendrerit
                                    viverra. Dictum sodales quam
                                    consectetur malesuada arcu. <br /><br />
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing sed amet
                                    vestibulum. Tellus velit tellus,
                                    risus tempor commodo netus vel fermentum id. Turpis libero dictum hendrerit viverra. Dictum
                                    sodales quam consectetur
                                    malesuada arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing
                                    sed amet vestibulum. Tellus
                                    velit tellus, risus tempor commodo netus vel fermentum id. Turpis libero dictum hendrerit
                                    viverra. Dictum sodales quam
                                    consectetur malesuada arcu. <br /><br />
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing sed amet
                                    vestibulum. Tellus velit tellus,
                                    risus tempor commodo netus vel fermentum id. Turpis libero dictum hendrerit viverra. Dictum
                                    sodales quam consectetur
                                    malesuada arcu.Lorem ipsum dolor sit amet,</p>
                            </div>
                        }

                        {/* resources */}
                        {currentView === "resources" &&
                            <>
                                {/* books */}
                                <div className="ebooks">
                                    <h2>eBooks</h2>
                                    <div className="ebooks-carousel">
                                        <div className="ebook">
                                            <img src="/img/book1.png" alt="book-img" />
                                            <h4>City on the Edge</h4>
                                            <p>Mark Goldman</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="bar">
                                                    <div className="indicator" />
                                                </div>
                                                <span>48%</span>
                                            </div>
                                        </div>
                                        <div className="ebook">
                                            <img src="/img/book2.png" alt="book-img" />
                                            <h4>City on the Edge</h4>
                                            <p>Mark Goldman</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="bar">
                                                    <div className="indicator" />
                                                </div>
                                                <span>48%</span>
                                            </div>
                                        </div>
                                        <div className="ebook">
                                            <img src="/img/book3.png" alt="book-img" />
                                            <h4>City on the Edge</h4>
                                            <p>Mark Goldman</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="bar">
                                                    <div className="indicator" />
                                                </div>
                                                <span>48%</span>
                                            </div>
                                        </div>
                                        <div className="ebook">
                                            <img src="/img/book1.png" alt="book-img" />
                                            <h4>City on the Edge</h4>
                                            <p>Mark Goldman</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="bar">
                                                    <div className="indicator" />
                                                </div>
                                                <span>48%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* videos  */}
                                <div className="videos">
                                    <h2>Videos</h2>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <img src="/img/video.png" alt="thumbnail" />
                                            <div className="d-flex">
                                                <i className="fa-solid fa-circle-play" />
                                                <div>
                                                    <h4>Censorship &amp; Freedom of Speech</h4>
                                                    <p>08:22</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <img src="/img/video.png" alt="thumbnail" />
                                            <div className="d-flex">
                                                <i className="fa-solid fa-circle-play" />
                                                <div>
                                                    <h4>Censorship &amp; Freedom of Speech</h4>
                                                    <p>08:22</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <img src="/img/video.png" alt="thumbnail" />
                                            <div className="d-flex">
                                                <i className="fa-solid fa-circle-play" />
                                                <div>
                                                    <h4>Censorship &amp; Freedom of Speech</h4>
                                                    <p>08:22</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        {/* quiz */}
                        {currentView === "quiz" &&
                            <div className="quiz">
                                <div className="d-flex justify-content-between">
                                    <p>Total Points - 11</p>
                                    <p>1 of 6</p>
                                </div>
                                <div className="body">
                                    <h5>2 Point</h5>
                                    <p>Question 1</p>
                                    <p className="mb-4">Evaluation is the ____________ step in the 4 step User Interface Design
                                        cycle</p>
                                    <div className="input d-flex align-items-center">
                                        <input type="radio" id={1} />
                                        <label htmlFor={1} className="mb-0">First</label>
                                    </div>
                                    <div className="input d-flex align-items-center">
                                        <input type="radio" id={2} />
                                        <label htmlFor={2} className="mb-0">Second</label>
                                    </div>
                                    <div className="input d-flex align-items-center">
                                        <input type="radio" id={3} />
                                        <label htmlFor={3} className="mb-0">Third</label>
                                    </div>
                                    <div className="input d-flex align-items-center">
                                        <input type="radio" id={4} />
                                        <label htmlFor={4} className="mb-0">Fourth</label>
                                    </div>
                                </div>
                                <div className="indicators d-flex justify-content-between mt-lg-5 mb-lg-5">
                                    <div className="check" />
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Back</h5>
                                    <button>Next Question</button>
                                </div>
                            </div>
                        }


                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseInProgress 