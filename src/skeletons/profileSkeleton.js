import React from 'react'
import Animation from './animation'

function ProfileSkeleton() {
    return (
        <div className='profile-skeleton mb-3'>
            <div className="row align-items-center mb-3">
                <div className="col-11 d-flex align-items-center gap-3">
                    <div className="profile-img"></div>
                    <div className="name"></div>
                </div>
                <div className="col-1">
                    <i className="fas fa-ellipsis-h" />
                </div>
            </div>
            <div className="overview mb-2"></div>
            <div className="text mb-2"></div>
            <div className="text mb-2"></div>
            <div className="text mb-2"></div>
            <div className="text mb-2"></div>
            <div className="image"></div>
            <Animation />
        </div>
    )
}

export default ProfileSkeleton