import React, { useEffect, useContext } from 'react'
import Nav from '../components/nav';
import Aside from '../components/aside';
import RecommendedStories from '../components/recommendedStories';
import RecomendedAspirants from '../components/recomendedAspirants';
import Footer from '../components/footer';
import { DataContext } from "../dataContext";
import { useNavigate } from "react-router-dom";

function Notifications() {
    // context 
    const { context } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

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
                    <div className="main col-lg-6 col-md-9">
                        <div className="notifications">
                            <div className="row">
                                <div className="col-lg-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <i className="fa-solid fa-circle" />
                                        <div className="img-container">
                                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <p>New post from <span>Polvote</span>: Lorem ipsum Lorem ipsumLorem ipsumvLorem ipsumLorem ipsumLorem ipsumLorem ipsumm ipsumLorem ipsum...........</p>
                                    <div className='d-flex gap-4 mt-3'>
                                        <h4 className='mb-0'>10 likes</h4>
                                        <h4 className='mb-0'>12 comments</h4>
                                    </div>
                                </div>
                                <div className='col-lg-1'>
                                    <h4>3d</h4>
                                    <i className="fa-solid fa-ellipsis" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <i className="fa-solid fa-circle" />
                                        <div className="img-container">
                                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <p><span>Omobola Ilori</span> followed you</p>
                                    <button>Follow back</button>
                                </div>
                                <div className='col-lg-1'>
                                    <h4>3d</h4>
                                    <i className="fa-solid fa-ellipsis" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <i className="fa-solid fa-circle" />
                                        <div className="img-container">
                                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <p><span>Omobola Ilori</span> liked your post</p>
                                </div>
                                <div className='col-lg-1'>
                                    <h4>3d</h4>
                                    <i className="fa-solid fa-ellipsis" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <i className="fa-solid fa-circle" />
                                        <div className="img-container">
                                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <p><span>Omobola Ilori</span> commented on your post</p>
                                </div>
                                <div className='col-lg-1'>
                                    <h4>3d</h4>
                                    <i className="fa-solid fa-ellipsis" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <i className="fa-solid fa-circle" />
                                        <div className="img-container">
                                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <p><span>Omobola Ilori</span> followed you back</p>
                                </div>
                                <div className='col-lg-1'>
                                    <h4>3d</h4>
                                    <i className="fa-solid fa-ellipsis" />
                                </div>
                            </div>
                        </div>
                        {/* footer  */}
                        <Footer />
                    </div>
                    <div className="profile-widget col-lg-3">
                        <div className="aside-sticky">
                            <RecommendedStories />
                            <RecomendedAspirants />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications