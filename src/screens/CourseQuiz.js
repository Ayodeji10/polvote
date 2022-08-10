import React from 'react'
import Nav from '../components/nav'
import CourseInProgressWidget from '../components/courseInProgressWidget'
import Footer from '../components/footer'

function CourseQuiz() {
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
                        <div className="d-flex page justify-content-between align-items-center mb-4">
                            <div>
                                <button>
                                    <span>Notes</span>
                                </button>
                                <button>
                                    <span>Resources</span>
                                </button>
                                <button className='active'>
                                    <span>Quiz (3)</span>
                                    <i className="fa-solid fa-circle" />
                                </button>
                            </div>
                            <button className='active'><span>About Instructor</span></button>
                        </div>

                        {/* quiz */}
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
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseQuiz