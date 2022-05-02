import React from 'react';

function NewlineText({ text }) {
    return (
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
    )
}

export default NewlineText