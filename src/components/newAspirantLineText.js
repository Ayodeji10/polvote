import React from 'react'

function NewAspirantLineText({ text }) {
    return (
        <>
            {text.split("\r\n").map((text, index) => {
                return (
                    <p key={index}>
                        {text}
                        < br />
                    </p>
                )
            })}
        </>
    )
}

export default NewAspirantLineText 