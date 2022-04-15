import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { DataContext } from "../dataContext";

function Aside() {
    // context 
    const { context, setContext } = useContext(DataContext)

    return (
        <>
            {/* user  */}
            < div className="user d-flex justify-content-between align-items-center mb-lg-5" >
                <div className="d-flex">
                    <div className="avatar">
                        <Link to={"/user-profile"}><img src="/img/unsplash_g7oN-4RMV_M.png" className="img-fluid" alt="avatar" /></Link>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                        <p>Welcome</p>
                        <h3 className="mb-0">{context.user.email}</h3>
                    </div>
                </div>
                <i className="fas fa-ellipsis-v" />
            </div >

            {/* courses  */}
            <div className="course">
                <h3 className="mb-2">Sponsored Courses</h3>
                <div className="card">
                    <div className="header" />
                    <div className="body">
                        <h3>The Politics of Skepticism</h3>
                        <span className="d-flex align-items-center mb-lg-4">
                            <i className="fas fa-star" />
                            <h4 className="mb-0">4.9</h4>
                            <h5 className="mb-0">4,709 Ratings</h5>
                        </span>
                        <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipisci
                            ng elit. Dui orci enim habitant ornare eget sem.
                            Ipsum nibh nisl donec lacus. Consequat, ac phas
                            ellus augue nunc sed. Molestie sodales feugiat d
                            iam, metus, elementum ipsum hendrerit.</p>
                        <button>Enrol Now</button>
                    </div>
                </div>
            </div>

            {/* Stories  */}
            <div className="content">
                <a href className="d-flex align-items-center mb-3"><img src="/img/Group.png" alt="" /><span>Write a
                    Story</span>
                </a>
                <Link to={"/create-aspirant"} className="d-flex align-items-center mb-0">
                    <img src="/img/carbon_user-profile.png" alt="" /><span>Create Aspirant Profile</span>
                </Link>
            </div>

            {/* courses  */}
            <div className="courses">
                <h3>My Courses</h3>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector.png" alt="" />
                    <h4 className="mb-0">In Progress</h4>
                </a>
                <a href className="d-flex align-items-center mb-3"><img src="/img/Vector (1).png" alt="" />
                    <h4 className="mb-0">Completed</h4>
                </a>
                <a href className="d-flex align-items-center mb-0"><img src="/img/Vector (2).png" alt="" />
                    <h4 className="mb-0">My Certificates</h4>
                </a>
            </div>

            {/* polls  */}
            <div className="polls">
                <h3>Active Polls</h3>
                <div className="active-polls">
                    <a href className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">2023 Presidential Poll</h4><i className="fas fa-angle-right" />
                    </a>
                    <a href className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">2023 Presidential Poll</h4><i className="fas fa-angle-right" />
                    </a>
                    <a href className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">2023 Presidential Poll</h4><i className="fas fa-angle-right" />
                    </a>
                </div>
            </div>
        </>
    )
}

export default Aside