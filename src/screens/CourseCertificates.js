import React from 'react'
import Nav from '../components/nav'
import Aside from '../components/aside'
import Footer from '../components/footer'
import { useNavigate } from "react-router-dom";


function CourseCertificates() {
    // history
    const navigate = useNavigate()

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
                    <div className="col-lg-8 courses-page">
                        {/* header  */}
                        <div className="header mb-5">
                            <div className="row">
                                <div className="col-lg-6">
                                    <button onClick={() => navigate('/courses/dashboard')} ><img src="/img/dashboard.png" alt="dashboard" />My Dashboad</button>
                                    <button><img src="/img/create.png" alt="create-course" />Create a course</button>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <div className="searchbar d-flex justify-content-between align-items-center">
                                        <input type="text" placeholder="Search for a course" />
                                        <img src="/img/search-normal.png" alt="search" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* certificates  */}
                        <div className="certificates">
                            <div className="row">
                                <div className="col-lg-4">
                                    <img src="/img/certificate.png" alt="certificate" />
                                    <h4>Foundation of Politics</h4>
                                    <p>Completed 14/02/2022</p>
                                    <a href=""><i className="fa-solid fa-download" />Download PDF</a>
                                </div>
                                <div className="col-lg-4">
                                    <img src="/img/certificate.png" alt="certificate" />
                                    <h4>Foundation of Politics</h4>
                                    <p>Completed 14/02/2022</p>
                                    <a href=""><i className="fa-solid fa-download" />Download PDF</a>
                                </div>
                                <div className="col-lg-4">
                                    <img src="/img/certificate.png" alt="certificate" />
                                    <h4>Foundation of Politics</h4>
                                    <p>Completed 14/02/2022</p>
                                    <a href=""><i className="fa-solid fa-download" />Download PDF</a>
                                </div>
                                <div className="col-lg-4">
                                    <img src="/img/certificate.png" alt="certificate" />
                                    <h4>Foundation of Politics</h4>
                                    <p>Completed 14/02/2022</p>
                                    <a href=""><i className="fa-solid fa-download" />Download PDF</a>
                                </div>
                            </div>
                        </div>
                        {/* hot picks */}
                        <section>
                            <h1>Because you’ve completed these courses</h1>
                            <p>These are similar courses you can enrol for</p>
                            <div className="carousel">
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    </div>
                                </div>
                                <div className="card">
                                    <img src="/img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
    )
}

export default CourseCertificates