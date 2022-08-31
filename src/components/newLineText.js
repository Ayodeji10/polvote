import React, { useState } from 'react';

function NewlineText({ text }) {
    const [readMore, setReadMore] = useState(false)
    return (
        <>
            {!readMore ?
                <h4 className='mb-2'>{text.substring(0, 300)}<span onClick={() => setReadMore(true)}>...see more</span></h4>
                :
                <>
                    {text.split("\r\n").map((fragment, index) => {
                        return (
                            <h4 key={index} className='mb-0'>
                                {fragment}{index === text.split("\r\n").length - 1 && text.split("\r\n").length > 1 && <span onClick={() => setReadMore(false)}>...see less</span>}
                                < br />
                            </h4>
                        )
                    })}
                    {/* <h4 onClick={() => setReadMore(true)}><span>...see less</span></h4> */}
                </>
            }
        </>
    )
}

export default NewlineText

// former return statement using paragraph to determine initiaal text
// return (
//     <>
//         {text.split("\r\n").length > 1 && readMore === false ?
//             <>
//                 {
//                     text.split("\r\n").filter((each, index) => index === 0).map((text, index) => {
//                         return (
//                             <h4 key={index} className='mb-0'>
//                                 {text}<span onClick={() => setReadMore(true)}>...see more</span>
//                             </h4>
//                         )
//                     })
//                 }
//             </>
//             :
//             <>
//                 {text.split("\r\n").map((fragment, index) => {
//                     return (
//                         <h4 key={index} className='mb-0'>
//                             {fragment}{index === text.split("\r\n").length - 1 && text.split("\r\n").length > 1 && <span onClick={() => setReadMore(false)}>...see less</span>}
//                             < br />
//                         </h4>
//                     )
//                 })}
//                 {/* <h4 onClick={() => setReadMore(true)}><span>...see less</span></h4> */}
//             </>
//         }
//     </>
// )