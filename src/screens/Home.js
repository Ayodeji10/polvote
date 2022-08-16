import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../dataContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../components/apiRoot";
import Nav from '../components/nav'
import Aside from "../components/aside";
import LoginPrompt from "../components/loginPrompt";
import Footer from "../components/footer";
import Modal from 'react-modal'
import HomeStoryCard from "../components/homeStoryCard";
import SingleProfileCard from "../components/singleProfileCard";
import HomePollCard from "../components/homePollCard";
import WriteStoryModal from "../components/writeStoryModal";
import StoryCard from "../components/storyCard";
// import Helmet from "react-helmet";
// import Ad1 from "../components/ad1"
// import { Adsense } from '@ctrl/react-adsense';
Modal.setAppElement('#root')

const Home = () => {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // story modal 
    const [writeStoryModal, setWriteStoryModal] = useState(false)

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    // fetch stories, aspirants, and presidential poll
    const [stories, setStories] = useState([])
    const [storyFetch, setStoryFetch] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setStories(response.data)
        setStoryFetch(false)
    }

    const [aspirants, setAspirants] = useState([])
    const [aspirantFetch, setAspirantFetch] = useState(true)
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
        setAspirantFetch(false)
    }

    useEffect(() => {
        fetchStories()
        fetchAspirants()
    }, [])

    // google ad
    // useEffect(() => {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }, [])
    // useEffect(() => {
    //     const pushAd = () => {
    //         try {
    //             const adsbygoogle = window.adsbygoogle
    //             console.log({ adsbygoogle })
    //             adsbygoogle.push({})
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }

    //     let interval = setInterval(() => {
    //         // Check if Adsense script is loaded every 300ms
    //         if (window.adsbygoogle) {
    //             pushAd()
    //             // clear the interval once the ad is pushed so that function isn't called indefinitely
    //             clearInterval(interval)
    //         }
    //     }, 300)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    // enter key to search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search()
        }
    }

    // search 
    const search = () => {
        if (context.homeSearchKey !== "") {
            navigate(`/search=${context.homeSearchKey}`)
        }
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`} >
            {/* nav  */}
            <Nav />
            {/* feed  */}
            <div className="home-feed container">
                <div className={`row ${localStorage.getItem('ballotbox_token') === null && "justify-content-lg-between"} `}>
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1 col-md-0" /> */}
                    {/* main  */}
                    <div className={`main ${localStorage.getItem('ballotbox_token') === null ? "col-lg-8 col-md-9" : "col-lg-6 col-md-9"} `}>
                        {/* header  */}
                        <div className="header">
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <div className="searchbar d-flex align-items-center justify-content-between">
                                <input type="text" placeholder="Search for Polls, Stories, and Profiles" value={context.homeSearchKey} onChange={(e) => setContext({ ...context, homeSearchKey: e.target.value })} onKeyPress={handleKeyPress} />
                                <img src="img/search-normal.png" alt="search" onClick={search} />
                            </div>
                        </div>
                        {/* advert  */}
                        {/* <img src="img/newBanner.png" alt="advert" className="banner-add" /> */}
                        {/* <Ad1 /> */}
                        {/* <Adsense
                            client="ca-pub-7640562161899788"
                            slot="7259870550"
                            style={{ width: 500, height: 300 }}
                            format=""
                        /> */}
                        {/* poll  */}
                        <HomePollCard pollId="626d7109c44fc4e4698417c8" />
                        {/* stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>Recent Stories</h3>
                                <div className="d-flex align-items-center">
                                    <h4 onClick={() => setWriteStoryModal(true)}><i className="fas fa-edit" />Write New Story</h4>
                                    {/* write story modal  */}
                                    {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                                </div>
                            </div>
                            <div className="story">
                                {!storyFetch &&
                                    <>
                                        {stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0 && story.status !== "1").slice(Math.max(stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0 && story.status !== "1").length - 3, 1)).map((story, index) => {
                                            return (
                                                <StoryCard story={story} key={index} />
                                                // <HomeStoryCard story={story} key={index} />
                                            )
                                        }).reverse()}
                                    </>
                                }
                            </div>
                            <div className="d-flex justify-content-end">
                                <button id="all-stories" onClick={() => navigate('/stories')}>See More Stories<i className="fa-solid fa-angle-right" /></button>
                            </div>
                        </div>
                        {/* adds  */}
                        {/* <div className="adds">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Recently added profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(Math.max(aspirants.filter(aspirant => aspirant.status === "1").length - 3, 1)).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    }).reverse()}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="load-more">See More Profiles<i className="fa-solid fa-angle-right" /></button>
                            </div>
                        </div>
                        {/* Ekiti polls  */}
                        <HomePollCard pollId="626dd7317f225bf461a81abb" />
                        {/* more profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">More profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(0, 4).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    })}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="go-to-profile">Go to Profiles</button>
                            </div>
                        </div>
                        {/* osun polls  */}
                        <HomePollCard pollId="626dd7ac7f225bf461a81b00" />
                        {/* adds  */}
                        {/* <div className="adds mt-5">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* courses  */}
                        {/* <div className="courses">
                            <div className="header d-flex justify-content-between align-items-center mb-2">
                                <h3>Courses (Hot Picks for you)</h3>
                                <a href>See All Courses<i className="fas fa-angle-right" /></a>
                            </div>
                            <div className="carousel">
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* add  */}
                        {/* <img src="img/newBanner.png" alt="advert" /> */}
                        {/* <div>
                            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                crossorigin="anonymous"></script>
                            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                            <script>
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </script>
                        </div> */}
                        {/* footer  */}
                        <Footer />
                    </div>
                    {localStorage.getItem('ballotbox_token') !== null &&
                        <div className="profile-widget col-lg-3">
                            <div className="aside-sticky">
                                <div className="story-recomentdations mb-3">
                                    <h2>Recommended Stories</h2>
                                    {stories.slice(0).sort(function () { return .5 - Math.random() }).slice(0, 3).map((each, index) => { ///slice(0) at the beginning is to duplicate the stories array
                                        return (
                                            <div className="story row" key={index}>
                                                <div className="col-2">
                                                    <div className="img-container">
                                                        {each.userimage === null || each.userimage === undefined ?
                                                            <img src="/img/place.jpg" className="img-fluid" alt="avatar" id='profile-img' /> :
                                                            <img src={each.userimage} alt="avatar" id='profile-img' />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-10 details">
                                                    <h3>{each.fullname}</h3>
                                                    <h4>{each.username}</h4>
                                                    {each.story.split("\r\n").filter((each, index) => index === 0).map((text, index) => {
                                                        return <p key={index}>{text.substring(0, 200)}{text.length > 200 && "..."}</p>
                                                    })}
                                                    <button onClick={() => navigate(`/stories/${each._id}`)}>Read more</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="profile-recomentdations">
                                    <h2>Recommended Aspirants</h2>
                                    {aspirants.slice(0).sort(function () { return .5 - Math.random() }).slice(0, 4).map((each, index) => {
                                        return (
                                            <div className="profile row" key={index}>
                                                <div className="col-lg-2 col-md-1">
                                                    <div className="img-container">
                                                        <img src={each.image === null || each.image === undefined ? `img/user (1) 1.png` : `${each.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-10 col-md-11 details">
                                                    <h3>{each.overview.substring(0, 160)}...</h3>
                                                    <button onClick={() => navigate(`/profiles/single/${each._id}`)}>Read more</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {localStorage.getItem('ballotbox_token') === null && <LoginPrompt />}
        </div>
    );
}
export default Home;