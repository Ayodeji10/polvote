import React from 'react'
import PulseLoader from "react-spinners/PulseLoader";

function Loader({ pageLoading }) {
    return (
        <div className="loaderContainer">
            <PulseLoader
                color={"#FFF"}
                // css={override}
                loading={pageLoading}
                size={12}
            />
        </div>
    )
}

export default Loader 