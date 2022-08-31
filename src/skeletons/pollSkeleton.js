import React from 'react'
import Animation from './animation'
import './skeleton.css'

function PollSkeleton() {
    return (
        <div className='poll-skeleton mb-3'>
            <div className="row align-items-start mb-4">
                <div className="col-6">
                    <div className="title mb-2"></div>
                    <div className="votes"></div>
                </div>
                <div className="col-6 d-flex justify-content-end align-items-center">
                    <button className="btn-1"><div></div></button>
                    <button className='btn-2' ><div></div></button>
                </div>
            </div>
            <div className="row align-items-center aspirant mb-3">
                <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                    <div className="profile-img"></div>
                </div>
                <div className="col-lg-7 col-md-6 col-sm-6 col-6">
                    <div className="name"></div>
                    <div className="name"></div>
                    <div className="name"></div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                    <div className="votes"></div>
                    <div className="percent"></div>
                </div>
                <div className="col-lg-1 col-md-2 col-sm-2 col-2">
                    <div className="vote-btn"></div>
                </div>
            </div>
            <div className="row align-items-center aspirant mb-3">
                <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                    <div className="profile-img"></div>
                </div>
                <div className="col-lg-7 col-md-6 col-sm-6 col-6">
                    <div className="name"></div>
                    <div className="name"></div>
                    <div className="name"></div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                    <div className="votes"></div>
                    <div className="percent"></div>
                </div>
                <div className="col-lg-1 col-md-2 col-sm-2 col-2">
                    <div className="vote-btn"></div>
                </div>
            </div>
            <div className="row align-items-center aspirant">
                <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                    <div className="profile-img"></div>
                </div>
                <div className="col-lg-7 col-md-6 col-sm-6 col-6">
                    <div className="name"></div>
                    <div className="name"></div>
                    <div className="name"></div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 d-flex flex-column justify-content-between align-items-end">
                    <div className="votes"></div>
                    <div className="percent"></div>
                </div>
                <div className="col-lg-1 col-md-2 col-sm-2 col-2">
                    <div className="vote-btn"></div>
                </div>
            </div>
            <Animation />
        </div>
    )
}

export default PollSkeleton