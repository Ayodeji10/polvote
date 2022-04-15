import React, { useState } from 'react'
import Nav from '../components/nav'
import Aside from '../components/aside'
import Footer from '../components/footer'

function Search() {
  const [currentView, setCurrentView] = useState("profiles")

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
          <div className="col-lg-8 search">
            <div className="row">
              <div className="col-10">
                <div className="searchbar d-flex align-items-center">
                  <input type="text" placeholder="Adekunle Ahmed Ibrahim" />
                  <img src="img/search-normal.png" alt="search" />
                </div>
              </div>
              <div className="col-2">
                <button id="filter"><i className="fas fa-filter" />Filter</button>
              </div>
            </div>
            <div className="toggle d-flex justify-content-between">
              <div className="d-flex">
                <button className={currentView === "profiles" && "active"} onClick={() => setCurrentView("profiles")} ><img src="img/profile.png" alt="profile" />Profiles</button>
                <button className={currentView === "polls" && "active"} onClick={() => setCurrentView("polls")} ><img src="img/poll.png" alt="poll" />Polls</button>
                <button className={currentView === "stories" && "active"} onClick={() => setCurrentView("stories")} ><img src="img/stories.png" alt="stories" />Stories</button>
                <button><img src="img/courses.png" alt="courses" />Courses</button>
              </div>
              <p>5 Search Results</p>
            </div>
            {/* profiles  */}
            {currentView === "profiles" &&
              <>
                <div className="profile">
                  <div className="row">
                    <div className="col-lg-1">
                      <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                    </div>
                    <div className="col-lg-11">
                      <h3>Ahmed Bola Tinubu</h3>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                        leo dis viverra scelerisque volutpat
                        quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                        cursus enim, neque ipsum.</p>
                      <footer>
                        <div className="row align-items-center">
                          <div className="col-lg-3">
                            <h4 className="mb-0">Born: 8th February 1972</h4>
                          </div>
                          <div className="col-lg-3">
                            <h4 className="mb-0">Party: New Party</h4>
                          </div>
                          <div className="col-lg-2">
                            <p className="mb-0"><i className="far fa-eye" />204</p>
                          </div>
                          <div className="col-lg-1">
                            <i className="fas fa-share-alt" id="views" />
                          </div>
                          <div className="col-lg-3 d-flex justify-content-between align-items-center">
                            <p className="mb-0">No Active Poll</p>
                            <img src="img/Group 515.png" alt="" />
                          </div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
                <div className="profile">
                  <div className="row">
                    <div className="col-lg-1">
                      <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                    </div>
                    <div className="col-lg-11">
                      <h3>Ahmed Bola Tinubu</h3>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                        leo dis viverra scelerisque volutpat
                        quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                        cursus enim, neque ipsum.</p>
                      <footer>
                        <div className="row align-items-center">
                          <div className="col-lg-3">
                            <h4 className="mb-0">Born: 8th February 1972</h4>
                          </div>
                          <div className="col-lg-3">
                            <h4 className="mb-0">Party: New Party</h4>
                          </div>
                          <div className="col-lg-2">
                            <p className="mb-0"><i className="far fa-eye" />204</p>
                          </div>
                          <div className="col-lg-1">
                            <i className="fas fa-share-alt" id="views" />
                          </div>
                          <div className="col-lg-3 d-flex justify-content-between align-items-center">
                            <p className="mb-0">No Active Poll</p>
                            <img src="img/Group 516.png" alt="" />
                          </div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
                <div className="profile">
                  <div className="row">
                    <div className="col-lg-1">
                      <img src="img/pexels-george-ikwegbu-2379429 1.png" id="profile-img" alt="profile-img" className="img-fluid" />
                    </div>
                    <div className="col-lg-11">
                      <h3>Ahmed Bola Tinubu</h3>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dignissim
                        leo dis viverra scelerisque volutpat
                        quam. Ornare tellus, egestas amet posuere at est tellus, auctor. Lobortis ante
                        cursus enim, neque ipsum.</p>
                      <footer>
                        <div className="row align-items-center">
                          <div className="col-lg-3">
                            <h4 className="mb-0">Born: 8th February 1972</h4>
                          </div>
                          <div className="col-lg-3">
                            <h4 className="mb-0">Party: New Party</h4>
                          </div>
                          <div className="col-lg-2">
                            <p className="mb-0"><i className="far fa-eye" />204</p>
                          </div>
                          <div className="col-lg-1">
                            <i className="fas fa-share-alt" id="views" />
                          </div>
                          <div className="col-lg-3 d-flex justify-content-between align-items-center">
                            <p className="mb-0">No Active Poll</p>
                            <img src="img/Group 515.png" alt="" />
                          </div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
              </>
            }

            {/* polls  */}
            {currentView === "polls" &&
              <>
                <div className="polls-page">
                  <p>Adekunle Ahmed Ibrahim in found in the following polls</p>
                </div>
                <div className="polls">
                  <div className="header">
                    <div className="row">
                      <div className="col-lg-5">
                        <p>Polls</p>
                      </div>
                      <div className="col-lg-2">
                        <p>Open Date</p>
                      </div>
                      <div className="col-lg-2">
                        <p>End Date</p>
                      </div>
                      <div className="col-lg-2">
                        <p>Status</p>
                      </div>
                    </div>
                  </div>
                  <div className="poll">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <h3>2023 Presidential Poll</h3>
                        <h6>Presidential</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-1 d-flex align-items-center">
                        <i className="fas fa-circle" />
                        <h6>Ongoing</h6>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <a href>Open<i className="fas fa-angle-right" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="poll">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <h3>2023 Presidential Poll</h3>
                        <h6>Presidential</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-1 d-flex align-items-center">
                        <i className="fas fa-circle" />
                        <h6>Ongoing</h6>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <a href>Open<i className="fas fa-angle-right" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="poll">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <h3>2023 Presidential Poll</h3>
                        <h6>Presidential</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-1 d-flex align-items-center">
                        <i className="fas fa-circle" />
                        <h6>Ongoing</h6>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <a href>Open<i className="fas fa-angle-right" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="poll">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <h3>2023 Presidential Poll</h3>
                        <h6>Presidential</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-1 d-flex align-items-center">
                        <i className="fas fa-circle" />
                        <h6>Ongoing</h6>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <a href>Open<i className="fas fa-angle-right" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="poll">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <h3>2023 Presidential Poll</h3>
                        <h6>Presidential</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-2">
                        <h6>10/01/2022</h6>
                      </div>
                      <div className="col-lg-1 d-flex align-items-center">
                        <i className="fas fa-circle" />
                        <h6>Ongoing</h6>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-end">
                        <a href>Open<i className="fas fa-angle-right" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }

            {/* stories */}
            {currentView === "stories" &&
              <>
                <div className="polls-page">
                  <p>Adekunle Ahmed Ibrahim in found in the following stories</p>
                </div>
                <div className="story">
                  <div className="body">
                    <div className="row mb-5 align-items-center">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9 d-flex flex-column justify-content-center">
                        <h3>Aaron Dabson</h3>
                        <div className="d-flex">
                          <p className="mb-0">@AAron</p>
                          <p className="mb-0">23 Hours Ago</p>
                        </div>
                      </div>
                      <div className="col-2">
                        <button id="open">Open Story</button>
                      </div>
                    </div>
                    <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                    <div className="row mb-2">
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="widget">
                    <div className="row justify-content-md-center">
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/comment.png" alt="comment" />
                        <span>8</span>
                      </div>
                      <div className="col-md-auto d-flex align-items-center justify-content-center">
                        <img src="img/like.png" alt="like" />
                        <span>24</span>
                      </div>
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/share.png" alt="share" />
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="comment">
                    <div className="row">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9">
                        <input type="text" placeholder="Leave a comment..." />
                      </div>
                      <div className="col-2">
                        <button><img src="img/send.png" alt="send" /> Send</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="story">
                  <div className="body">
                    <div className="row mb-5 align-items-center">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9 d-flex flex-column justify-content-center">
                        <h3>Aaron Dabson</h3>
                        <div className="d-flex">
                          <p className="mb-0">@AAron</p>
                          <p className="mb-0">23 Hours Ago</p>
                        </div>
                      </div>
                      <div className="col-2">
                        <button id="open">Open Story</button>
                      </div>
                    </div>
                    <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                    <div className="row mb-2">
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="widget">
                    <div className="row justify-content-md-center">
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/comment.png" alt="comment" />
                        <span>8</span>
                      </div>
                      <div className="col-md-auto d-flex align-items-center justify-content-center">
                        <img src="img/like.png" alt="like" />
                        <span>24</span>
                      </div>
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/share.png" alt="share" />
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="comment">
                    <div className="row">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9">
                        <input type="text" placeholder="Leave a comment..." />
                      </div>
                      <div className="col-2">
                        <button><img src="img/send.png" alt="send" /> Send</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="story">
                  <div className="body">
                    <div className="row mb-5 align-items-center">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9 d-flex flex-column justify-content-center">
                        <h3>Aaron Dabson</h3>
                        <div className="d-flex">
                          <p className="mb-0">@AAron</p>
                          <p className="mb-0">23 Hours Ago</p>
                        </div>
                      </div>
                      <div className="col-2">
                        <button id="open">Open Story</button>
                      </div>
                    </div>
                    <h4>Adekunle Bolatito encourages women development and poverty alleviation in Lagos</h4>
                    <div className="row mb-2">
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                      <div className="col-6">
                        <img src="img/IMG_9056 1.png" alt="img" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="widget">
                    <div className="row justify-content-md-center">
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/comment.png" alt="comment" />
                        <span>8</span>
                      </div>
                      <div className="col-md-auto d-flex align-items-center justify-content-center">
                        <img src="img/like.png" alt="like" />
                        <span>24</span>
                      </div>
                      <div className="col col-lg-3 d-flex align-items-center justify-content-center">
                        <img src="img/share.png" alt="share" />
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                  <div className="comment">
                    <div className="row">
                      <div className="col-1">
                        <div className="img-container">
                          <img src="img/Candidate.png" className="profile-img" alt="profile-img" />
                        </div>
                      </div>
                      <div className="col-9">
                        <input type="text" placeholder="Leave a comment..." />
                      </div>
                      <div className="col-2">
                        <button><img src="img/send.png" alt="send" /> Send</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }



            {/* footer  */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Search 