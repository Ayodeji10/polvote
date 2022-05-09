import React, { useState, useEffect, useContext } from 'react'
import Nav from '../components/nav'
import Aside from '../components/aside'
import Footer from '../components/footer'
import { DataContext } from "../dataContext";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useParams, Link, useNavigate } from "react-router-dom";
import StoryCard from '../components/storyCard';
import Loader from '../components/loader';
import PulseLoader from "react-spinners/PulseLoader";

function Search() {
  // context 
  const { context, setContext } = useContext(DataContext)

  // params 
  const { param } = useParams()

  // history 
  const navigate = useNavigate()

  // redirect if user is not logged in 
  useEffect(() => {
    if (localStorage.getItem('ballotbox_token') === null) {
      navigate('/')
    }
  }, [])

  // view 
  const [currentView, setCurrentView] = useState("profiles")
  const [pageLoading, setPageLoading] = useState(true)

  // fetch aspirants 
  const [aspirants, setAspirants] = useState([])
  const fetchAspirants = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/aspirant`)
      .catch((error) => [
        // console.log('Err', error)
      ]);
    const people = response.data.filter(aspirant => `${aspirant.firstname} ${aspirant.lastname}`.toLowerCase().includes(param.toLowerCase()) && aspirant.status === "1")
    // console.log(people)
    setAspirants(people)
    // setAspirants(response.data)
  }

  // fetch polls 
  const [polls, setPolls] = useState([])
  const fetchPolls = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/polls`)
      .catch((error) => [
        // console.log('Err', error)
      ]);
    const polls = response.data.filter(poll => poll.polltitle.toLowerCase().includes(param.toLowerCase()))
    setPolls(polls)
  }

  // fetch stories
  const [stories, setStories] = useState([])
  const fetchStories = async () => {
    const response = await axios
      .get(`${API.API_ROOT}/story`)
      .catch((error) => [
        console.log('Err', error)
      ]);
    const stories = response.data.filter(story => story.story.toLowerCase().includes(param.toLowerCase()))
    setStories(stories)
  }

  useEffect(() => {
    fetchAspirants()
    fetchPolls()
    fetchStories()
    setPageLoading(false)
  }, [param])

  // enter key to search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && context.homeSearchKey !== "") {
      navigate(`/search=${context.homeSearchKey}`)
    }
  }

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
                  <input type="text" placeholder="Adekunle Ahmed Ibrahim" value={context.homeSearchKey} onChange={(e) => setContext({ ...context, homeSearchKey: e.target.value })} onKeyPress={handleKeyPress} />
                  <img src="img/search-normal.png" alt="search" onClick={() => navigate(`/search=${context.homeSearchKey}`)} />
                </div>
              </div>
              <div className="col-2">
                {/* <button id="filter"><i className="fas fa-filter" />Filter</button> */}
              </div>
            </div>
            {pageLoading ?
              <Loader pageLoading={pageLoading} /> :
              <>
                <div className="toggle d-flex justify-content-between">
                  <div className="d-flex">
                    <button className={currentView === "profiles" && "active"} onClick={() => setCurrentView("profiles")} ><img src="img/profile.png" alt="profile" />Profiles</button>
                    <button className={currentView === "polls" && "active"} onClick={() => setCurrentView("polls")} ><img src="img/poll.png" alt="poll" />Polls</button>
                    <button className={currentView === "stories" && "active"} onClick={() => setCurrentView("stories")} ><img src="img/stories.png" alt="stories" />Stories</button>
                    {/* <button><img src="img/courses.png" alt="courses" />Courses</button> */}
                  </div>
                  {/* <p>{currentView === "profiles" && aspirants.length}{currentView === "polls" && polls.length}{currentView === "stories" && stories.length} Search Results</p> */}
                  <p>{aspirants.length + polls.length + stories.length} Search Results</p>
                </div>
                {/* profiles  */}
                {currentView === "profiles" &&
                  <>
                    {aspirants.length === 0 ?
                      <p>No matching aspirant Profiles for '{param}'</p> :
                      <>
                        {aspirants.map((aspirant, index) => {
                          return (
                            <Link to={`/profiles/single/${aspirant._id}`} key={index}>
                              <div className="profile">
                                <div className="row">
                                  <div className="col-lg-2">
                                    <img src={aspirant.image === null || aspirant.image == undefined ? `img/user (1) 1.png` : `${aspirant.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                                  </div>
                                  <div className="col-lg-10">
                                    <h3>{aspirant.firstname} {aspirant.lastname}</h3>
                                    <p>{aspirant.overview}</p>
                                    <footer>
                                      <div className="row align-items-center">
                                        <div className="col-lg-3">
                                          <h4 className="mb-0">Born: {aspirant.dob.substring(0, 15)}</h4>
                                        </div>
                                        <div className="col-lg-3">
                                          <h4 className="mb-0">Party: {aspirant.pparty}</h4>
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
                            </Link>
                          )
                        })}
                      </>
                    }
                  </>
                }

                {/* polls  */}
                {currentView === "polls" &&
                  <>
                    {polls.length === 0 ?
                      <p>No matching polls for '{param}'</p> :
                      <>
                        <div className="polls-page">
                          <p>'{param}' is found in the following polls</p>
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
                          {polls.map((poll, index) => {
                            return (
                              <div className="poll" key={index}>
                                <div className="row align-items-center">
                                  <div className="col-lg-5">
                                    <h3>{poll.polltitle}</h3>
                                    <h6>{poll.category}</h6>
                                  </div>
                                  <div className="col-lg-2">
                                    <h6>{poll.startdate.substring(0, 10)}</h6>
                                  </div>
                                  <div className="col-lg-2">
                                    <h6>{poll.enddate.substring(0, 10)}</h6>
                                  </div>
                                  <div className="col-lg-1 d-flex align-items-center">
                                    <i className="fas fa-circle" style={{ color: poll.status == 0 ? 'rgba(50, 186, 124, 1)' : 'rgba(135, 195, 254, 1)' }} />
                                    <h6>{poll.status == 0 ? "Ongoing" : "Concluded"}</h6>
                                  </div>
                                  <div className="col-lg-2 d-flex justify-content-end">
                                    <Link to={`/polls/${poll._id}`}>Open<i className="fas fa-angle-right" /></Link>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    }
                  </>
                }

                {/* stories */}
                {currentView === "stories" &&
                  <>
                    {stories.length === 0 ?
                      <p>No matching stories for '{param}'</p> :
                      <>
                        <div className="polls-page">
                          <p>'{param}' is found in the following stories</p>
                        </div>
                        <div className="story">
                          {stories.map((story, index) => {
                            return (
                              <StoryCard story={story} key={index} />
                            )
                          }).reverse()}
                        </div>
                      </>
                    }
                  </>
                }
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