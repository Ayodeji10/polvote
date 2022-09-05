import React, { useState, useEffect } from 'react'
import axios from "axios";
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import RecStoriesSkeleton from '../skeletons/recStoriesSkeleton';

function RecomendedAspirants() {
    // history 
    const navigate = useNavigate()

    const [aspirants, setAspirants] = useState([])
    const [fetching, setFetching] = useState(true)
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
        setFetching(false)
    }

    useEffect(() => {
        fetchAspirants()
    }, [])

    return (
        <div className="profile-recomentdations">
            <h2>Recommended Aspirants</h2>
            {fetching &&
                <>
                    {
                        [1, 2, 3, 4, 5].map(n => {
                            return <RecStoriesSkeleton key={n} />
                        })
                    }
                </>
            }
            {aspirants.slice(0).sort(function () { return .5 - Math.random() }).slice(0, 5).map((each, index) => {
                return (
                    <div className="profile row" key={index}>
                        <div className="col-lg-2 col-md-1">
                            <div className="img-container">
                                <img src={each.image === null || each.image === undefined ? `img/user (1) 1.png` : `${each.image}`} id="profile-img" alt="profile-img" className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-11 details">
                            <h2>{each.firstname} {each.lastname}</h2>
                            <h3>{each.overview.substring(0, 160)}...</h3>
                            <button onClick={() => navigate(`/profiles/${each.firstname}-${each.lastname}/${each._id}`)}>Read more</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecomendedAspirants