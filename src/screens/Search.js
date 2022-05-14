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
import SingleProfileCard from '../components/singleProfileCard';
import PollCard from '../components/pollCard';

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
    <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
      {/* navigation */}
      <Nav />
      {/* feed  */}
      <div className="home-feed container">
        <div className="row justify-content-lg-between">
          {/* aside  */}
          <div className="col-lg-3 col-md-3 aside">
            <Aside />
          </div>
          {/* gutter  */}
          {/* <div className="col-lg-1" /> */}
          {/* main  */}
          <div className="col-lg-8 col-md-9 search">
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
                    <button className={currentView === "profiles" && "active"} onClick={() => setCurrentView("profiles")} >
                      {/* <img src="img/profile.png" alt="profile" /> */}
                      {context.darkMode ?
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="#0A183D" fillOpacity="0.5" />
                        </svg> :
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 10C13.1562 10 15.7143 7.76172 15.7143 5C15.7143 2.23828 13.1562 0 10 0C6.84375 0 4.28571 2.23828 4.28571 5C4.28571 7.76172 6.84375 10 10 10ZM14 11.25H13.2545C12.2634 11.6484 11.1607 11.875 10 11.875C8.83929 11.875 7.74107 11.6484 6.74554 11.25H6C2.6875 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.959821 20 2.14286 20H17.8571C19.0402 20 20 19.1602 20 18.125V16.5C20 13.6016 17.3125 11.25 14 11.25Z" fill="white" fillOpacity="0.6" />
                        </svg>
                      }
                      Profiles</button>
                    <button className={currentView === "polls" && "active"} onClick={() => setCurrentView("polls")} >
                      {/* <img src="img/poll.png" alt="poll" /> */}
                      {context.darkMode ?
                        <svg width={18} height={22} viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.3699 0.578068C10.2449 0.264568 9.36592 1.10457 9.05241 1.88607C8.69242 2.78607 8.37292 3.41607 7.99341 4.17207C7.75942 4.63707 7.50141 5.15307 7.19391 5.80707C6.48141 7.32057 5.77191 8.29107 5.25441 8.87307C5.06635 9.08857 4.86335 9.29057 4.64691 9.47757C4.59776 9.51924 4.54724 9.55927 4.49542 9.59757L4.47141 9.61557L1.66341 11.2731C1.05552 11.6317 0.593532 12.1932 0.358687 12.8587C0.123843 13.5243 0.131182 14.2514 0.379415 14.9121L1.15941 16.9881C1.31976 17.4143 1.57502 17.7984 1.90586 18.1113C2.2367 18.4242 2.63444 18.6577 3.06891 18.7941L11.1029 21.3186C11.5784 21.4679 12.0789 21.521 12.5752 21.4747C13.0714 21.4284 13.5535 21.2836 13.9931 21.0488C14.4328 20.8141 14.8212 20.494 15.1357 20.1074C15.4502 19.7208 15.6845 19.2753 15.8249 18.7971L17.8709 11.8281C18.0024 11.3806 18.0278 10.9086 17.945 10.4496C17.8623 9.99059 17.6736 9.55721 17.394 9.18387C17.1145 8.81053 16.7517 8.50752 16.3345 8.2989C15.9174 8.09028 15.4573 7.98179 14.9909 7.98207H12.9149C13.0139 7.64307 13.1144 7.26507 13.2074 6.87207C13.4039 6.03057 13.5719 5.06757 13.5554 4.26657C13.5419 3.51957 13.4654 2.73657 13.1594 2.07357C12.8309 1.35957 12.2564 0.824068 11.3714 0.578068H11.3699Z" fill="#0A183D" fillOpacity="0.5" />
                        </svg> :
                        <svg width={18} height={22} viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.3699 0.578068C10.2449 0.264568 9.36592 1.10457 9.05241 1.88607C8.69242 2.78607 8.37292 3.41607 7.99341 4.17207C7.75942 4.63707 7.50141 5.15307 7.19391 5.80707C6.48141 7.32057 5.77191 8.29107 5.25441 8.87307C5.06635 9.08857 4.86335 9.29057 4.64691 9.47757C4.59776 9.51924 4.54724 9.55927 4.49542 9.59757L4.47141 9.61557L1.66341 11.2731C1.05552 11.6317 0.593532 12.1932 0.358687 12.8587C0.123843 13.5243 0.131182 14.2514 0.379415 14.9121L1.15941 16.9881C1.31976 17.4143 1.57502 17.7984 1.90586 18.1113C2.2367 18.4242 2.63444 18.6577 3.06891 18.7941L11.1029 21.3186C11.5784 21.4679 12.0789 21.521 12.5752 21.4747C13.0714 21.4284 13.5535 21.2836 13.9931 21.0488C14.4328 20.8141 14.8212 20.494 15.1357 20.1074C15.4502 19.7208 15.6845 19.2753 15.8249 18.7971L17.8709 11.8281C18.0024 11.3806 18.0278 10.9086 17.945 10.4496C17.8623 9.99059 17.6736 9.55721 17.394 9.18387C17.1145 8.81053 16.7517 8.50752 16.3345 8.2989C15.9174 8.09028 15.4573 7.98179 14.9909 7.98207H12.9149C13.0139 7.64307 13.1144 7.26507 13.2074 6.87207C13.4039 6.03057 13.5719 5.06757 13.5554 4.26657C13.5419 3.51957 13.4654 2.73657 13.1594 2.07357C12.8309 1.35957 12.2564 0.824068 11.3714 0.578068H11.3699Z" fill="white" fillOpacity="0.6" />
                        </svg>
                      }
                      Polls</button>
                    <button className={currentView === "stories" && "active"} onClick={() => setCurrentView("stories")} >
                      {/* <img src="img/stories.png" alt="stories" /> */}
                      {context.darkMode ?
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="#0A183D" fillOpacity="0.5" />
                        </svg> :
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5833 0.25H2.41667C1.225 0.25 0.25 1.225 0.25 2.41667V17.5833C0.25 18.775 1.225 19.75 2.41667 19.75H17.5833C18.775 19.75 19.75 18.775 19.75 17.5833V2.41667C19.75 1.225 18.775 0.25 17.5833 0.25ZM8.91667 15.4167H4.58333C3.9875 15.4167 3.5 14.9292 3.5 14.3333C3.5 13.7375 3.9875 13.25 4.58333 13.25H8.91667C9.5125 13.25 10 13.7375 10 14.3333C10 14.9292 9.5125 15.4167 8.91667 15.4167ZM12.1667 11.0833H7.83333C7.2375 11.0833 6.75 10.5958 6.75 10C6.75 9.40417 7.2375 8.91667 7.83333 8.91667H12.1667C12.7625 8.91667 13.25 9.40417 13.25 10C13.25 10.5958 12.7625 11.0833 12.1667 11.0833ZM15.4167 6.75H11.0833C10.4875 6.75 10 6.2625 10 5.66667C10 5.07083 10.4875 4.58333 11.0833 4.58333H15.4167C16.0125 4.58333 16.5 5.07083 16.5 5.66667C16.5 6.2625 16.0125 6.75 15.4167 6.75Z" fill="white" fillOpacity="0.6" />
                        </svg>
                      }
                      Stories</button>
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
                        <div className="profile">
                          {aspirants.map((aspirant, index) => {
                            return (
                              <SingleProfileCard aspirant={aspirant} key={index} />
                            )
                          })}
                        </div>
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
                              <div className="col-6">
                                <p>Polls</p>
                              </div>
                              <div className="col-2">
                                <p>Open Date</p>
                              </div>
                              <div className="col-2">
                                <p>End Date</p>
                              </div>
                              <div className="col-2">
                                <p>Status</p>
                              </div>
                            </div>
                          </div>
                          {polls.map((poll, index) => {
                            return (
                              <PollCard poll={poll} key={index} />
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