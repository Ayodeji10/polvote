import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";

function CreateAspirant2() {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history
    const navigate = useNavigate()

    // redirect if user is not logged in 
    useEffect(() => {
        if (localStorage.getItem('ballotbox_token') === null) {
            navigate('/')
        }
    }, [])

    // text editor modules 
    const modules = {
        toolbar: [
            // [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            // [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
                // { 'indent': '-1' }, { 'indent': '+1' }
            ],
            ['link',
                // 'image', 'video'
            ],
            // ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]

    // add history 
    const handleAddHstory = () => {
        const newHistory = { pollTitle: "", pollYear: "", position: "", numberOfVotes: "" }
        setContext({ ...context, newAspirant: { ...context.newAspirant, history: [...context.newAspirant.history, newHistory] } })
    }

    // handle input 
    const handleHistoryInput = (index, e) => {
        e.preventDefault()
        setContext({
            ...context, newAspirant: {
                ...context.newAspirant, history: context.newAspirant.history.map((each, i) => {
                    if (i !== index) {
                        return each
                    }
                    return { ...each, [e.target.name]: e.target.value }
                })
            }
        })
    }

    // remove history 
    const handleRemoveHistory = (index) => {
        console.log(index)
        if (context.newAspirant.history.length > 1) {
            setContext({
                ...context, newAspirant: {
                    ...context.newAspirant, history: context.newAspirant.history.filter((item) => item !== context.newAspirant.history[index])
                }
            })
        }
    }

    const [error, setError] = useState("")

    const handleCreateAspirant = () => {
        setError("")
        if (context.newAspirant.overview === "" || context.newAspirant.education === "" || context.newAspirant.politics === "" || context.newAspirant.business === "" || context.newAspirant.activism === "") {
            setError("Please fill all Input Fields")
        } else {
            navigate('/create-aspirant/submit-profile')
        }
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`}>
            <Nav />
            <div class="home-feed container">
                <div class="row justify-content-lg-between">
                    {/* aside  */}
                    <div class="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        <div className="form2">
                            <div className="d-flex">
                                <Link to={"/create-aspirant"}><i className="fas fa-arrow-left" /></Link>
                                <div>
                                    <h1>Set up Aspirant Profile</h1>
                                    <p>Please fill all input fields</p>
                                </div>
                            </div>
                            <div className="input">
                                <label htmlFor="overview">Overview</label>
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Type Here"
                                    value={context.newAspirant.overview}
                                    onChange={val => setContext({ ...context, newAspirant: { ...context.newAspirant, overview: val } })}
                                    modules={modules}
                                    formats={formats}
                                />
                                {/* <textarea name id="overview" cols={30} rows={10} placeholder="Type Here" value={context.newAspirant.overview} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, overview: e.target.value } })} /> */}
                            </div>
                            <div className="input">
                                <label htmlFor="Education">Educational Background</label>
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Type Here"
                                    value={context.newAspirant.education}
                                    onChange={val => setContext({ ...context, newAspirant: { ...context.newAspirant, education: val } })}
                                    modules={modules}
                                    formats={formats}
                                />
                                {/* <textarea name id="Education" cols={30} rows={10} placeholder="Type Here" value={context.newAspirant.education} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, education: e.target.value } })} /> */}
                            </div>
                            <div className="input">
                                <label htmlFor="Politics">Political Career</label>
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Type Here"
                                    value={context.newAspirant.politics}
                                    onChange={val => setContext({ ...context, newAspirant: { ...context.newAspirant, politics: val } })}
                                    modules={modules}
                                    formats={formats}
                                />
                                {/* <textarea name id="Politics" cols={30} rows={10} placeholder="Type Here" value={context.newAspirant.politics} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, politics: e.target.value } })} /> */}
                            </div>
                            <div className="input">
                                <label htmlFor="interest">Professional Career/Business Interest</label>
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Type Here"
                                    value={context.newAspirant.business}
                                    onChange={val => setContext({ ...context, newAspirant: { ...context.newAspirant, business: val } })}
                                    modules={modules}
                                    formats={formats}
                                />
                                {/* <textarea name id="interest" cols={30} rows={10} placeholder="Type Here" value={context.newAspirant.business} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, business: e.target.value } })} /> */}
                            </div>
                            <div className="input">
                                <label htmlFor="Activism">Awards</label>
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Type Here"
                                    value={context.newAspirant.activism}
                                    onChange={val => setContext({ ...context, newAspirant: { ...context.newAspirant, activism: val } })}
                                    modules={modules}
                                    formats={formats}
                                />
                                {/* <textarea name id="Activism" cols={30} rows={10} placeholder="Type Here" value={context.newAspirant.activism} onChange={(e) => setContext({ ...context, newAspirant: { ...context.newAspirant, activism: e.target.value } })} /> */}
                            </div>
                            {/* history  */}
                            <div className="history mt-5">
                                <h2>Participating Poll History</h2>
                                {context.newAspirant.history.map((each, index) => {
                                    return (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-6">
                                                <div className="input">
                                                    <label htmlFor="title">Poll Tite</label>
                                                    <input
                                                        type="text"
                                                        id="title"
                                                        placeholder="ex. 2022 Lagos Gubernatorial Poll"
                                                        name="pollTitle"
                                                        value={each.pollTitle}
                                                        onChange={(e) => handleHistoryInput(index, e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input d-flex justify-content-between align-items-center">
                                                    <div style={{ width: "90%" }}>
                                                        <label htmlFor="date">Election Year</label>
                                                        <input
                                                            maxLength="4"
                                                            type="number"
                                                            id="date" placeholder="YYYY"
                                                            name="pollYear"
                                                            value={each.pollYear}
                                                            onChange={(e) => handleHistoryInput(index, e)}
                                                        />
                                                    </div>
                                                    {/* <i className="fas fa-calendar-alt" /> */}
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input">
                                                    <label htmlFor="votes">Number of Vote</label>
                                                    <input
                                                        type="number"
                                                        id="date" placeholder="Number of Votes"
                                                        name="numberOfVotes"
                                                        value={each.numberOfVotes}
                                                        onChange={(e) => handleHistoryInput(index, e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input">
                                                    <label htmlFor="position">Position at the end of Poll (4th, 1st)</label>
                                                    <input
                                                        type="text"
                                                        id="date" placeholder="Position Poll"
                                                        name="position"
                                                        value={each.position}
                                                        onChange={(e) => handleHistoryInput(index, e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex justify-content-end">
                                                <i className="fas fa-trash-alt" onClick={() => handleRemoveHistory(index)} />
                                            </div>
                                        </div>
                                    )
                                })}
                                <button className="mb-2 mb-md-3" id="add-history" onClick={handleAddHstory}><i className="fas fa-plus-circle" />Add More Election
                                    History</button>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">2 of 3</h6>
                                    <div>
                                        <p>{error}</p>
                                        <button id="draft">Save as Draft</button>
                                        <button id="proceed" onClick={handleCreateAspirant}>Continue</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAspirant2 
