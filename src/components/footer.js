import React, { useState, useContext } from 'react'
import { DataContext } from "../dataContext";
import { Link } from "react-router-dom";
import AdvertiseWithUs from './advertiseWithUs.js';

function Footer() {
    // context 
    const { context } = useContext(DataContext)

    const [advertiseWithUsModal, setAdvertiseWitUsModal] = useState(false)

    const handleModal = (variable) => {
        setAdvertiseWitUsModal(variable)
    }

    return (
        <footer id="footer" className={`${context.darkMode ? 'dm' : ""}`}>
            <div className="row justify-content-lg-between top">
                <div className="col-lg-8 d-flex align-items-start">
                    {context.darkMode ? <img src="/img/pl.png" alt="logo" id="logo" /> : <img src="/img/p.png" alt="logo" id="logo" />}

                    <div>
                        <h1>Pol<span>vote</span></h1>
                        <p className="mb-0">Polvote provides you with the ability to see profiles of Political Aspirants contesting for leadership, governance and economic positions near your locality. It also offers you a news feed which takes contributions from Political enthusiasts discussing simple to complex topics on social media including you. It also gives you the ability to vote for these aspiring leaders in contests created for the internet via Polvote.</p>
                    </div>
                </div>
                <div className="col-lg-3 d-flex flex-column justify-content-end mt-md-3 mt-sm-3 mt-4">
                    <h5>FOLLOW US</h5>
                    <div className="d-flex justify-content-between">
                        <a href="https://youtube.com/channel/UCkcn0Kv_w_Qe0MfZ7Hhe6lg" target="_blank"><img src="/img/youtube.png" alt="youtube" className='social' /></a>
                        <a href="https://www.facebook.com/Polvoteofficial-115809974445682/" target="_blank"><img src="/img/fb.png" alt="facebook" className='social' /></a>
                        <a href="https://www.instagram.com/polvoteofficial/" target="_blank"><img src="/img/insta.png" alt="instagram" className='social' /></a>
                        <a href="https://twitter.com/pol_vote?t=iVqZBrU9MA793b4K1-YLwQ" target="_blank"><img src="/img/twitter.png" alt="twitter" className='social' /></a>
                        {/* <img src="/img/linkedin.png" alt="linkedIn" className='social' />
                        <img src="/img/fb.png" alt="facebook" className='social' />
                        <img src="/img/insta.png" alt="instagram" className='social' />
                        <img src="/img/twitter.png" alt="twitter" className='social' />
                        <img src="/img/tiktok.png" alt="tiktok" className='social' /> */}
                    </div>
                </div>
            </div>
            <div className="bottom d-flex">
                {/* <Link onClick={() => setAdvertiseWitUsModal(true)}>Advertise with us</Link> */}
                {advertiseWithUsModal && <AdvertiseWithUs isOpen={advertiseWithUsModal} handleModal={handleModal} />}
                <Link to={'/terms-and-conditions'}>Terms and Condition</Link>
                <Link to={'/privacy-policy'}>Privacy Policy</Link>
            </div>
        </footer>
    )
}

export default Footer