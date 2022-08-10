import React from 'react'
import { Link } from "react-router-dom";

function CourseInProgressWidget() {
    return (
        <>
            <Link to={'/courses/dashboard'}><h6><i className="fa-solid fa-arrow-left-long" />RETURN TO MY COURSES</h6></Link>
            <div className="widget">
                <h1>The Morals of Natural Politics</h1>
                <h3>2/5 COMPLETED</h3>
                <div className="d-flex justify-content-between">
                    <div className="bar">
                        <div className="indicator done" />
                    </div>
                    <div className="bar">
                        <div className="indicator done" />
                    </div>
                    <div className="bar">
                        <div className="indicator current" />
                    </div>
                    <div className="bar">
                        <div className="indicator" />
                    </div>
                    <div className="bar">
                        <div className="indicator" />
                    </div>
                </div>
                <div className="chapters">
                    <div className="chapter done d-flex">
                        <div className="index d-flex justify-content-center align-items-center">
                            <span>1</span>
                        </div>
                        <h2 className="mb-0">Political systems / forms of government</h2>
                    </div>
                    <div className="chapter done d-flex">
                        <div className="index d-flex justify-content-center align-items-center">
                            <span>1</span>
                        </div>
                        <h2 className="mb-0">Political systems / forms of government</h2>
                    </div>
                    <div className="chapter current d-flex">
                        <div className="index d-flex justify-content-center align-items-center">
                            <span>1</span>
                        </div>
                        <h2 className="mb-0">Political systems / forms of government</h2>
                    </div>
                    <div className="chapter d-flex">
                        <div className="index d-flex justify-content-center align-items-center">
                            <span>1</span>
                        </div>
                        <h2 className="mb-0">Political systems / forms of government</h2>
                        <i className="fa-solid fa-lock" />
                    </div>
                    <div className="chapter d-flex">
                        <div className="index d-flex justify-content-center align-items-center">
                            <span>1</span>
                        </div>
                        <h2 className="mb-0">Political systems / forms of government</h2>
                        <i className="fa-solid fa-lock" />
                    </div>
                </div>
                <div className="d-flex discuss justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Discussion</h1>
                    <h3 className="mb-0">Add Comment</h3>
                </div>
                <div className="comment">
                    <div className="avatar d-flex align-items-center mb-2">
                        <div className="img-container">
                            <img src="/img/Candidate.png" alt="profile-img" />
                        </div>
                        <h4 className="mb-0">Andrews Amos</h4>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing
                        sed amet
                        vestibulum. Tellus velit tellus,
                        risus tempor commodo netus vel fermentum</p>
                    <div className="d-flex reply align-items-center">
                        <div>
                            <img src="/img/reply.png" alt="reply" />
                            <span>Reply</span>
                        </div>
                        <i className="fa-solid fa-circle" />
                        <span>Show 12 Replies</span>
                    </div>
                </div>
                <div className="comment">
                    <div className="avatar d-flex align-items-center mb-2">
                        <div className="img-container">
                            <img src="/img/Candidate.png" alt="profile-img" />
                        </div>
                        <h4 className="mb-0">Andrews Amos</h4>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing
                        sed amet
                        vestibulum. Tellus velit tellus,
                        risus tempor commodo netus vel fermentum</p>
                    <div className="d-flex reply align-items-center">
                        <div>
                            <img src="/img/reply.png" alt="reply" />
                            <span>Reply</span>
                        </div>
                        <i className="fa-solid fa-circle" />
                        <span>Hide Replies</span>
                    </div>
                    <div className="replies">
                        <div className="avatar d-flex align-items-center mb-2">
                            <div className="img-container">
                                <img src="/img/Candidate.png" alt="profile-img" />
                            </div>
                            <h4 className="mb-0">Andrews Amos</h4>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing sed amet
                            vestibulum. Tellus velit tellus,
                            risus tempor commodo netus vel fermentum</p>
                    </div>
                    <div className="replies">
                        <div className="avatar d-flex align-items-center mb-2">
                            <div className="img-container">
                                <img src="/img/Candidate.png" alt="profile-img" />
                            </div>
                            <h4 className="mb-0">Andrews Amos</h4>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing sed amet
                            vestibulum. Tellus velit tellus,
                            risus tempor commodo netus vel fermentum</p>
                    </div>
                </div>
                <div className="comment">
                    <div className="avatar d-flex align-items-center mb-2">
                        <div className="img-container">
                            <img src="/img/Candidate.png" alt="profile-img" />
                        </div>
                        <h4 className="mb-0">Andrews Amos</h4>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, adipiscing
                        sed amet
                        vestibulum. Tellus velit tellus,
                        risus tempor commodo netus vel fermentum</p>
                    <div className="d-flex reply align-items-center">
                        <div>
                            <img src="/img/reply.png" alt="reply" />
                            <span>Reply</span>
                        </div>
                        <i className="fa-solid fa-circle" />
                        <span>Show 12 Replies</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseInProgressWidget 