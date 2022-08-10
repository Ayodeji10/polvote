import React, { useEffect, useContext } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../dataContext";
import { API } from "../components/apiRoot";

function Withdrawal() {
    // context 
    const { context } = useContext(DataContext)

    // params 
    const { id } = useParams()

    // history 
    const navigate = useNavigate()

    // confirm withdrawal 
    const confirmWithdrawal = async () => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        } else {
            axios.get(`${API.API_ROOT}/wallet/activate/${id}`,
                { headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("ballotbox_token")}` } })
                .then(response => {
                    console.log(response)
                    navigate('/user-profile')
                }).catch(error => {
                    console.error(error)
                })
            // const response = await axios
            //     .get(`${API.API_ROOT}/users/register`)
            // console.log(response)
            // // navigate('/user-profile')
        }
    }

    useEffect(() => {
        if (id && id !== '') confirmWithdrawal()
    }, [id])

    return (
        <h6>...</h6>
    )
}

export default Withdrawal 