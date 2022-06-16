import React, { useState, useContext } from 'react'
import { API } from "../components/apiRoot";
import axios from "axios";
import { DataContext } from "../dataContext";

function Comments({ comment, id }) {
    // context 
    const { context } = useContext(DataContext)

    const [showReplyInput, setShowReplyInput] = useState(false)
    const [replyText, setReplyText] = useState(`${comment.username} `)

    // like comment 
    const likeComment = (commentId) => {
        axios({
            url: `${API.API_ROOT}/story/commentlikers/${id}`,
            method: "patch",
            headers: { "Content-Type": "Application/JSON", 'Authorization': `Bearer ${context.user.token}` },
            data: { commentid: commentId }
        }).then((response) => {
            // console.log(response)
            window.location.reload()
        }, (error) => {
            console.log(error)
            // setError('Something went wrong, please try again')
        })
    }

    // reply comment 
    const [replyImg, setReplyImg] = useState(null)
    const [replyLoading, setReplyLoading] = useState(false)
    const reply = (commentId) => {
        setReplyLoading(true)
        const fd = new FormData()
        fd.append('commentid', commentId)
        fd.append('comment', replyText)
        if (replyImg !== null & replyImg !== undefined) {
            fd.append('image', replyImg)
        }

        axios({
            url: `${API.API_ROOT}/story/commentreplies/${id}`,
            method: "patch",
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${context.user.token}` },
            data: fd
        }).then((response) => {
            // console.log(response)
            setReplyLoading(false)
            window.location.reload()
        }, (error) => {
            console.log(error)
            // setError('Something went wrong, please try again')
        })
    }

    return (
        <div className="comment mb-3">
            <div className="row">
                <div className="col-1">
                    <div className="img-container">
                        {comment.userimage === null || comment.userimage === undefined ?
                            <img src="/img/place.jpg" alt="profile-img" className='profile-img' /> :
                            <img src={comment.userimage} alt="profile-img" className='profile-img' />
                        }
                    </div>
                </div>
                <div className="col-11">
                    <div className="comment-body">
                        <div className="d-flex align-items-center mb-2">
                            <h3 className="mb-0">{comment.fullname}</h3>
                            <h4 className="mb-0">{comment.username}</h4>
                        </div>
                        <p className="mb-0">{comment.comment}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0" onClick={() => likeComment(comment._id)}>Like ({comment.likes.length})</h5>
                        <h5 className="mb-0" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</h5>
                        {/* <h6 className="mb-0">2 Mins</h6> */}
                    </div>
                </div>
            </div>
            {/* replies  */}
            <div className="replies">
                {showReplyInput &&
                    <div className="row align-items-center mb-3">
                        <div className="col-1">
                            <div className="img-container">
                                {context.user.image !== null && context.user.image !== undefined ?
                                    <img src={context.user.image} alt="profile-img" id='profile-img' /> :
                                    <img src="/img/place.jpg" alt="profile-img" id='profile-img' />
                                }
                            </div>
                        </div>
                        <div className="col-7">
                            <input type="text" placeholder="@LarryJ " value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus={showReplyInput} />
                        </div>
                        <div className="col-2 ">
                            <button onClick={() => reply(comment._id)}><img src="/img/send.png" alt="send" />{replyLoading ? "loading..." : "Send"}</button>
                        </div>
                    </div>
                }
                {comment.replies.map((reply, index) => {
                    return (
                        <div className="row" key={index}>
                            <div className="col-1">
                                <div className="img-container">
                                    {reply.userimage === null || reply.userimage === undefined ?
                                        <img src="/img/place.jpg" alt="profile-img" id='profile-img' /> :
                                        <img src={reply.userimage} alt="profile-img" id='profile-img' />
                                    }
                                </div>
                            </div>
                            <div className="col-11">
                                <div className="comment-body">
                                    <div className="d-flex align-items-center mb-2">
                                        <h3 className="mb-0">{reply.fullname}</h3>
                                        <h4 className="mb-0">{reply.username}</h4>
                                    </div>
                                    <p className="mb-0">{reply.comment}</p>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    {/* <h5 className="mb-0">Like</h5> */}
                                    {/* <h5 className="mb-0">Reply</h5> */}
                                    {/* <h6 className="mb-0">2 Mins</h6> */}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Comments 