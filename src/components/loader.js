import React, { useContext } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import { DataContext } from "../dataContext";

function Loader({ pageLoading }) {
    // context 
    const { context } = useContext(DataContext)

    return (
        <div className="loaderContainer">
            <PulseLoader
                color={context.darkMode ? "#000000" : "#FFF"}
                // css={override}
                loading={pageLoading}
                size={12}
            />
        </div>
    )
}

export default Loader 