import React, { useContext } from 'react'
import { DataContext } from "../dataContext";
import Modal from 'react-modal'
Modal.setAppElement('#root')

function AdvertiseWithUs({ isOpen, handleModal }) {
    // context 
    const { context } = useContext(DataContext)

    return (
        <Modal isOpen={isOpen} onRequestClose={() => handleModal(false)} id="advertiseWithUs" className={`${context.darkMode ? 'dm' : ""}`}>
            <i className="fas fa-times" onClick={() => handleModal(false)} />
            <h2>Advertise With Us</h2>
            <h3>Advert Model</h3>
            <div className='checkbox'>
                <input type="checkbox" id='PPC' />
                <label htmlFor="PPC">Drop Down (PPC)</label>
            </div>
            <div className='checkbox mb-lg-3'>
                <input type="checkbox" id='PPM' />
                <label htmlFor="PPM">(PPM)</label>
            </div>
            <div className="input">
                <label htmlFor="Industry">Industry</label>
                <select name="cars" id="Industry">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
            <div className="input">
                <label htmlFor="date">Campaign Date (Projected)</label>
                <input type="date" id='date' placeholder='MM/DD/YYYY' />
            </div>
            <div className="input">
                <label htmlFor="period">Period of Coverage (No of Days)</label>
                <input type="number" id='period' placeholder="32" />
            </div>
            <div className="input">
                <label htmlFor="">Target Audience (Age)</label>
                <select name="cars" id="">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
            <div className="input">
                <label htmlFor="">Target Audience (Location)</label>
                <select name="cars" id="">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
            <div className="input">
                <label htmlFor="">Campaign Budget (Per Week)</label>
                <select name="cars" id="">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
            <button>Submit</button>
        </Modal>
    )
}

export default AdvertiseWithUs 