import React, { useEffect } from "react";
import { API } from "../components/apiRoot";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const Verify = () => {
    // params 
    const { Id } = useParams()

    // history 
    const navigate = useNavigate()

    // activate user 
    const activateUser = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/users/activate/${Id}`)
        navigate("/")
    }
    useEffect(() => {
        if (Id && Id !== '') activateUser()
    }, [Id])

    return (
        <h6>...</h6>
    );
}
export default Verify;