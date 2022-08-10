import React from 'react'
import Aside from '../components/aside'
import Footer from '../components/footer'
import Nav from '../components/nav'
import { Link } from "react-router-dom";

function SingleCourse() {
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
                                    <Link to={'/courses/dashboard'}><button><img src="/img/dashboard.png" alt="dashboard" />My Dashboad</button></Link>
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
                        {/* single page */}
                        <div className="single-page">
                            {/* header */}
                            <div className="row header mb-5">
                                <div className="col-lg-8 d-flex">
                                    <Link to={"/courses"}><i className="fas fa-arrow-left" /></Link>
                                    <div>
                                        <h1>Moral Foundations of Politics</h1>
                                        <i className="fas fa-star" />
                                        <span>4.9</span>
                                        <span className="ratings">4,709 Ratings</span>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <button>Enrol Now for 20USD<i className="fas fa-chevron-right" /></button>
                                </div>
                            </div>
                            {/* video */}
                            <div className="video mb-5">
                                <div className="row">
                                    <div className="col-lg-8">
                                        <iframe width="100%" height={350} src="https://www.youtube.com/embed/dcbs4MMCsFc" className="mb-4" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                                        </iframe>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="widget">
                                            <section className="d-flex">
                                                <i className="fas fa-graduation-cap" />
                                                <div>
                                                    <h3>At Pace Learning</h3>
                                                    <p className="mb-0">Learn at your own Pace</p>
                                                </div>
                                            </section>
                                            <section className="d-flex">
                                                <i className="fab fa-youtube" />
                                                <div>
                                                    <h3>6 Video Materials</h3>
                                                    <p className="mb-0">Available on streaming</p>
                                                </div>
                                            </section>
                                            <section className="d-flex">
                                                <i className="far fa-file-pdf" />
                                                <div>
                                                    <h3>6 Text Materials</h3>
                                                    <p className="mb-0">Readable on your Dashboard</p>
                                                </div>
                                            </section>
                                            <section className="d-flex align-items-start">
                                                <img src="/img/certify.png" alt="" />
                                                <div>
                                                    <h3>Certificate on Completion</h3>
                                                    <p className="mb-0">Download from your dashboard</p>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* details */}
                            <div className="details">
                                <h4>About this Course</h4>
                                <p>This Massive Open Online Course (MOOC) will offer the participants an introduction into
                                    contemporary geopolitics,
                                    starting from the origins of classical geopolitics and continuing the discussion with
                                    the deep analysis of the examined
                                    country-cases, including the US, Russia, and China. Combined with small tests, based on
                                    the video’s and recommended
                                    readings, the participants will be encouraged to dive into the complex theories and
                                    phenomena and get familiar with the
                                    concepts that are still very relevant in the contemporary world.
                                </p>
                                <h4>What you will learn</h4>
                                <ul className="mb-5">
                                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                    <li>Mauris sagittis eros sit amet libero dapibus, iaculis mattis ante lacinia.</li>
                                    <li>Sed consectetur sapien eget ex egestas, ut semper quam feugiat.</li>
                                    <li>Nulla congue nunc ac lacinia luctus.</li>
                                </ul>
                                <h4>Syllabus</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est iaculis tristique felis
                                    suspendisse. Neque eu nunc
                                    suspendisse laoreet non accumsan. Ut amet accumsan, massa, ac eget. At urna lectus enim,
                                    sed est ut.
                                    In scelerisque nec cursus eget. Viverra viverra ultrices pulvinar mauris diam. Sit
                                    egestas tellus quisque donec.
                                    Faucibus et sed tempus interdum ut dictum urna suspendisse. Dolor at lectus pharetra
                                    tellus aliquet consectetur
                                    praesent. Eu justo et cras gravida tortor urna convallis felis. Faucibus lacinia
                                    pulvinar praesent vestibulum, ut.
                                    Adipiscing et, tellus sit vivamus enim congue hac semper. Sapien erat facilisi libero
                                    feugiat ac. Turpis accumsan mi id
                                    arcu, quis duis pulvinar volutpat. Ac nec nisl convallis senectus sed venenatis tellus.
                                    Vitae nec amet pellentesque non
                                    facilisis leo, ultricies nam. Scelerisque semper amet vitae, nam. Posuere ullamcorper
                                    enim in odio facilisi tortor,
                                    ultrices. Fringilla porttitor ipsum, tincidunt mauris eget sed. Et ultrices nascetur
                                    curabitur donec faucibus bibendum
                                    morbi. Integer consectetur ornare suspendisse nibh viverra porta nec. Leo est lectus
                                    tincidunt faucibus laoreet.
                                    Lorem ullamcorper vulputate commodo commodo quam sapien. Vulputate maecenas purus sociis
                                    risus nunc sed ipsum. Nec
                                    potenti lacinia aliquam risus. Neque, quis viverra varius vestibulum convallis. Lorem
                                    interdum facilisi ipsum rutrum
                                    commodo proin. Velit odio at purus euismod euismod quis facilisis. Lorem auctor luctus
                                    arcu gravida nam. Convallis
                                    volutpat turpis eget neque in consectetur in. Elit dapibus tellus sapien nec nunc.
                                </p>
                                <h4 id='instructor'>About the Instructor</h4>
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div className="img-container">
                                            <img src="/img/candidate.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-10">
                                        <h4 id='name'>Adewale Taofeek</h4>
                                        <h6>Loobyist</h6>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est iaculis tristique felis suspendisse. Neque eu nunc suspendisse laoreet non accumsan. Ut amet accumsan, massa, ac eget. At urna lectus enim, sed est ut.In scelerisque nec cursus eget. Viverra viverra ultrices pulvinar mauris diam. Sit egestas tellus quisque donec. Faucibus et sed tempus interdum ut dictum urna suspendisse. Dolor at lectus pharetra tellus aliquet consectetur praesent. Eu justo et cras gravida tortor urna convallis felis. Faucibus lacinia pulvinar praesent vestibulum, ut.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est iaculis tristique felis suspendisse. Neque eu nunc </p>
                                    </div>
                                </div>
                            </div>
                            {/* similar courses */}
                            <section>
                                <h2>Similar Courses</h2>
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
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleCourse 