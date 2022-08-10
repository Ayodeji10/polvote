import React, { useState } from 'react';

function NewlineText({ text }) {
    const [readMore, setReadMore] = useState(false)
    return (
        <>
            {text.split("\r\n").length > 1 && readMore === false ?
                <>
                    {
                        text.split("\r\n").filter((each, index) => index === 0).map((text, index) => {
                            return (
                                <>
                                    <h4 key={index}>
                                        {text}
                                    </h4>
                                    <h6 onClick={() => setReadMore(true)}>....see more</h6>
                                </>
                            )
                        })
                    }
                </>
                :
                <>
                    {text.split("\r\n").map((text, index) => {
                        return (
                            <h4 key={index}>
                                {text}
                                < br />
                            </h4>
                        )
                    })}
                </>
            }
        </>
    )
}

export default NewlineText