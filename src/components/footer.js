import React from 'react'

function Footer() {

    return (
        <footer id="footer">
            <div className="row justify-content-between top">
                <div className="col-lg-8 d-flex align-items-start">
                    <img src="/img/fingerprint 1.png" alt="logo" id="logo" />
                    <div>
                        <h1>Ballot<span>Box</span></h1>
                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                            vitae
                            dignissim
                            leo dis viverra scelerisque volutpat quam. Ornare tellus, egestas amet
                            posuere
                            at est tellus, auctor. Lobortis ante cursus enim, neque ipsum. Donec lorem
                            sed
                            nisl amet varius tellus lorem vitae. At non massa nunc, donec amet turpis.
                            Velit eget enim, ante lectus lobortis eget amet faucibus justo. Leo volutpat
                        </p>
                    </div>
                </div>
                <div className="col-lg-2 d-flex flex-column justify-content-end">
                    <h5>FOLLOW US</h5>
                    <div className="d-flex justify-content-between">
                        <img src="/img/_2545301958192.png" alt="facebook" />
                        <img src="/img/insta.png" alt="insta" />
                        <img src="/img/twitter.png" alt="twitter" />
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