import React from 'react'
import Animation from './animation'

function StorySkeleton() {
    return (
        <div className='story-skeleton mb-4'>
            <div className="body">
                <div className="row mb-3">
                    <div className="col-11 d-flex gap-3 align-items-start">
                        <div className="profile-img"></div>
                        <div>
                            <div className="name"></div>
                            <div className="username"></div>
                            <div className="time"></div>
                        </div>
                    </div>
                    <div className="col-1">
                        <i className="fas fa-ellipsis-h" />
                    </div>
                </div>
                <div className="text mb-2"></div>
                <div className="text mb-2"></div>
                <div className="img"></div>
            </div>
            <div className="widget">
                <div className="row mt-2">
                    <div className="col-4">
                        <div className="widget-sm"></div>
                    </div>
                    <div className="col-4">
                        <div className="widget-sm"></div>
                    </div>
                    <div className="col-4">
                        <div className="widget-sm"></div>
                    </div>
                </div>
            </div>
            <div className="comment">
                <div className="row align-items-center">
                    <div className="col-10 d-flex gap-3 align-items-center">
                        <div className="profile-img"></div>
                        <div className="input"></div>
                    </div>
                    <div className="col-2">
                        <div className="button"></div>
                    </div>
                </div>
            </div>
            <Animation />
        </div>
    )
}

export default StorySkeleton