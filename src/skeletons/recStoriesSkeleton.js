import React from 'react'
import Animation from './animation'

function RecStoriesSkeleton() {
    return (
        <div className="rec-story row mb-3">
            <div className="col-2">
                <div className="img"></div>
            </div>
            <div className="col-10 details">
                <div className="name"></div>
                <div className="username"></div>
                <div className="story"></div>
                <div className="button"></div>
            </div>
            <Animation />
        </div>
    )
}

export default RecStoriesSkeleton