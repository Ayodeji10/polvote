import React from 'react'
import Aside from '../components/aside'
import Footer from '../components/footer'
import Nav from '../components/nav'
import { Link } from "react-router-dom";

function Courses() {
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
                                    <Link to={"/courses/dashboard"}><button><img src="img/dashboard.png" alt="dashboard" />My Dashboad</button></Link>
                                    <button><img src="img/create.png" alt="create-course" />Create a course</button>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <div className="searchbar d-flex justify-content-between align-items-center">
                                        <input type="text" placeholder="Search for a course" />
                                        <img src="img/search-normal.png" alt="search" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* hot picks */}
                        <section>
                            <h1>Hot Picks for you!</h1>
                            <p>These are popular courses on BallotBox</p>
                            <div className="carousel">
                                <div className="card">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                        {/* previously enrolled */}
                        <section>
                            <h1>Because you enrolled for Game Theory</h1>
                            <p>These are similar courses</p>
                            <div className="carousel">
                                <div className="card">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                        {/* commerce  */}
                        <section>
                            <h2>Some Courses About Commerce</h2>
                            <div className="carousel">
                                <div className="card">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                        {/* recently added */}
                        <section>
                            <h2>Recently Added</h2>
                            <div className="carousel">
                                <div className="card">
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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
                                    <img src="img/pexels-george-ikwegbu-2379429 1.png" className="top-img" alt="" />
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

export default Courses 