import React from 'react'

function Footer() {

    return (
        <footer id="footer">
            <div className="row justify-content-between top">
                <div className="col-lg-8 d-flex align-items-start">
                    <img src="/img/p.png" alt="logo" id="logo" />
                    <div>
                        <h1>Pol<span>Vote</span></h1>
                        <p className="mb-0">Polvote provides you with the ability to see profiles of Political Aspirants contesting for leadership, governance and economic positions near your locality. It also offers you a news feed which takes contributions from Political enthusiasts discussing simple to complex topics on social media including you. It also gives you the ability to vote for these aspiring leaders in contests created for the internet via Polvote.</p>
                    </div>
                </div>
                <div className="col-lg-2 d-flex flex-column justify-content-end">
                    <h5>FOLLOW US</h5>
                    <div className="d-flex justify-content-between">
                        <img src="/img/linkedin.png" alt="linkedIn" className='social' />
                        <img src="/img/fb.png" alt="facebook" className='social' />
                        <img src="/img/insta.png" alt="instagram" className='social' />
                        <img src="/img/twitter.png" alt="twitter" className='social' />
                        <img src="/img/tiktok.png" alt="tiktok" className='social' />
                    </div>
                </div>
            </div>
            <div className="bottom d-flex">
                <h4 className="mb-0">Advertise with us</h4>
                <h4 className="mb-0">Terms and Condition</h4>
                <h4 className="mb-0">Privacy Policy</h4>
            </div>
        </footer>
    )
}

export default Footer