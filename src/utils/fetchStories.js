import React, { useEffect } from 'react'
import { API } from "../components/apiRoot";

import axios from "axios";

export default function FetchStories({ pageNumber }) {
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story?page=${pageNumber}&limit=10`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        console.log(response)
    }

    useEffect(() => {
        fetchStories()
        // axios({
        //     method: "GET",
        //     url: `${API.API_ROOT}/story?page=${pageNumber}&limit=10`
        // }).then(response => {
        //     console.log(response.data)
        // })
    }, [pageNumber])
    return null
}
