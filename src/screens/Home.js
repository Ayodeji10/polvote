import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../dataContext";
import { useNavigate, Link } from "react-router-dom";
import { setUserSession } from "../utils/common";
import axios from "axios";
import { API } from "../components/apiRoot";
import GoogleLogin from "react-google-login";
// import FacebookLogin from "react-facebook-login"
import Nav from '../components/nav'
import Aside from "../components/aside";
import Footer from "../components/footer";
import Modal from 'react-modal'
import HomeStoryCard from "../components/homeStoryCard";
import SingleProfileCard from "../components/singleProfileCard";
import HomePollCard from "../components/homePollCard";
import WriteStoryModal from "../components/writeStoryModal";
import EkitiPolls from "../components/ekitiPolls";
import OsunPolls from "../components/osunPolls"
Modal.setAppElement('#root')


const Home = () => {
    // context 
    const { context, setContext } = useContext(DataContext)

    // history 
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // modals 
    const [signupModal, setSignupModal] = useState(false)
    const [verificationModal, setVerificationModal] = useState(false)
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
    const [verificationView, setVerificationView] = useState('email')

    // otp 
    const [otp, setOtp] = useState(new Array(6).fill(""))

    // handle change for otp 
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false
        setOtp([...otp.map((d, idx) => (idx === index) ? element.value : d)])
        // focus on next input box 
        if (element.nextSibling) {
            element.nextSibling.focus()
        }
    }

    // signup 
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("@")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [password, setPassword] = useState("")

    const handleSignUp = () => {
        setError(null)
        setLoading(true)
        axios.post(`${API.API_ROOT}/users/register`, { firstname: firstName, lastname: lastName, username: username, phonenumber: number, email: email, password: password }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                console.log(response)
                setLoading(false);
                setSignupModal(false)
                setVerificationModal(true)
            }).catch(error => {
                setLoading(false)
                if (error.response.status === 422) {
                    setError('this Email is already registered')
                } else if (error.response.status === 401 || error.response.status === 400) {
                    setError(error.response.data.message)
                }
                else {
                    setError('Something went wrong, please try again')
                }
                console.error(error)
            })
    }

    // login 
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        axios.post(`${API.API_ROOT}/users/signin`, { email: loginEmail, password: loginPassword })
            .then(response => {
                // console.log(response)
                setLoading(false);
                if (response.status === 422) {
                    setError("kindly Check your mail to verify this account")
                    setPassword('')
                }
                else {
                    setUserSession(response.data.token);
                    setContext({ ...context, user: response.data })
                    navigate('/')
                }
            }).catch(error => {
                console.log(error.response.status)
                setLoading(false)
                if (error.response.status === 401) {
                    setError("Invalid email or password")
                    setPassword('')
                }
                if (error.response.status === 422) {
                    setPassword('')
                    setError('Kindly check your mail to verify this account')
                    console.error(error)
                }
                if (error.response.status !== 401 && error.response.status !== 422) {
                    setError("Something went wrong, please try again later")
                    setPassword('')
                }
            })
    }

    // google signup 
    const responseSuccessGoogle = (response) => {
        console.log(response)
        console.log(response.tokenId)
        setLoading(true)
        axios({
            method: "post",
            url: `${API.API_ROOT}/users/googleLogin`,
            data: { tokenId: response.tokenId }
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setLoading(false)
                setUserSession(response.data.token)
                setContext({ ...context, user: { token: response.data.token, ...response.data.user } })
                navigate('/')
            } else {
                setLoading(false)
                setError("Something went wrong... pls try again shrotly")
            }
        }
        )
    }

    const responseErrorGoogle = () => {
    }

    // facebook login 
    const responseFacebook = (response) => {
        // console.log(response)
        setLoading(true)
        axios({
            method: "post",
            url: `${API.API_ROOT}/users/facebookLogin`,
            data: { accessToken: response.accessToken, userID: response.userID }
        }).then((response) => {
            // console.log(response)
            if (response.status === 200) {
                setLoading(false)
                setUserSession(response.data.token)
                setContext({ ...context, user: { token: response.data.token, ...response.data.user } })
                window.location.reload()
            } else {
                setError('SOmething went wrong, pls try again later')
            }
        }
        )
    }

    // forgot password 
    // verify email 
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)
    const [verifyEmailError, setVerifyEmailError] = useState("")
    const [verifyEmailInput, setVerifyEmailInput] = useState("")

    // new password 
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const verifyEmail = () => {
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        axios.post(`${API.API_ROOT}/users/forgotpassword`, { email: verifyEmailInput }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                // console.log(response)
                setVerifyEmailLoading(false)
                if (response.data.status === 'error') {
                    setVerifyEmailError('Invalid Email Address')
                } else {
                    localStorage.setItem('temporaryId', response.data.userid)
                    setVerificationView("otp")
                    setVerifyEmailError('')
                }
            }).catch(error => {
                setVerifyEmailLoading(false)
                setVerifyEmailError('Something went wrong, please try again later')
                // console.error(error)
            })
    }

    // verfify otp 
    const handleOtp = () => {
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        axios.post(`${API.API_ROOT}/users/verifycode`, { code: otp.join("") }, { headers: { 'content-type': 'application/json' } })
            .then(response => {
                setVerifyEmailLoading(false)
                if (response.data.status === "SUCCESS") {
                    setVerificationView('reset')
                    setVerifyEmailError("")
                } else {
                    setVerifyEmailError(response.data.invalid)
                }
            }).catch(error => {
                setVerifyEmailLoading(false)
                setVerifyEmailError('Something went wrong, please try again later')
            })
    }

    // new password 
    const handleNewPassword = () => {
        console.log(localStorage.getItem('temporaryId'))
        setVerifyEmailError(null)
        setVerifyEmailLoading(true)
        if (newPassword !== confirmPassword) {
            setVerifyEmailError("Please ensure both passwords match")
            setVerifyEmailLoading(false)
        } else {
            axios.patch(`${API.API_ROOT}/users/updatepassword/${localStorage.getItem('temporaryId')}`, { password: newPassword }, { headers: { 'content-type': 'application/json' } })
                .then(response => {
                    setVerifyEmailLoading(false)
                    if (response.data.status === "SUCCESS") {
                        localStorage.removeItem('temporaryId')
                        setVerificationView("success")
                    } else {
                        setVerifyEmailError('Something went wrong, please try again later')
                    }
                }).catch(error => {
                    console.log(error)
                    setVerifyEmailLoading(false)
                    setVerifyEmailError('Something went wrong, please try again later')
                })
        }
    }

    // home functions 
    // search 
    const search = () => {
        if (context.homeSearchKey !== "") {
            navigate(`/search=${context.homeSearchKey}`)
        }
    }

    // enter key to search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search()
        }
    }


    // story modal 
    const [writeStoryModal, setWriteStoryModal] = useState(false)

    const handleWriteStoryModal = (variable) => {
        setWriteStoryModal(variable)
    }

    // fetch stories, aspirants, and presidential poll
    const [stories, setStories] = useState([])
    const [storyFetch, setStoryFetch] = useState(true)
    const fetchStories = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/story`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setStories(response.data)
        setStoryFetch(false)
    }

    const [aspirants, setAspirants] = useState([])
    const [aspirantFetch, setAspirantFetch] = useState(true)
    const [profileLength, setProfileLength] = useState(3)
    const fetchAspirants = async () => {
        const response = await axios
            .get(`${API.API_ROOT}/aspirant`)
            .catch((error) => [
                console.log('Err', error)
            ]);
        setAspirants(response.data)
        setAspirantFetch(false)
    }

    useEffect(() => {
        fetchStories()
        fetchAspirants()
    }, [])

    const [termsModal, setTermsModal] = useState(false)
    const [privacyModal, setPrivacyModal] = useState(false)

    if (localStorage.getItem('ballotbox_token') == null) {
        return (
            <>
                <div className={`home ${context.darkMode ? 'dm' : ""}`}>
                    <div className="container">
                        <header className="d-flex align-items-center justify-content-between">
                            {context.darkMode ? <img src="/img/logo-dm.png" id="logo" alt="logo" /> : <img src="/img/logo.png" id="logo" alt="logo" />}
                            <div>
                                {context.darkMode ? <img src="/img/night.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: false })} /> : <img src="/img/theme.png" alt="theme" className="theme" onClick={() => setContext({ ...context, darkMode: true })} />}
                                {/* <img src="img/Group 42.png" alt="country" id="country" /> */}
                            </div>
                        </header>
                        <div className="main">
                            <div className="row justify-content-md-between">
                                <div className="col-lg-5 order-2 order-lg-1 order-md-2 order-sm-2">
                                    <div className="d-flex justify-content-lg-end justify-content-md-center justify-content-sm-start">
                                        <img src="img/secured.png" alt="secured" id="secured" />
                                    </div>
                                    <h1>Explore Politics, Learn and Share Insights Online</h1>
                                    <h4>Polvote provides you with the ability to see profiles of Political Aspirants contesting for leadership, governance and economic positions near your locality with news feed for the internet and voting ability for these aspiring leaders in various category contests.</h4>
                                </div>
                                <div className="col-lg-5 order-1 order-lg-2 order-md-1 order-sm-1">
                                    <div className="login">
                                        <h1>Login to Vote on Polvote</h1>
                                        <h2>Votes made on Polvote are only limited to Polvote and does not count for the
                                            National Election!
                                        </h2>
                                        <div className="d-flex flex-column align-items-center">
                                            <GoogleLogin
                                                clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                                // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                                buttonText="Login with Googe Account"
                                                onSuccess={responseSuccessGoogle}
                                                onFailure={responseErrorGoogle}
                                                cookiePolicy={'single_host_origin'}
                                            />
                                            {/* <FacebookLogin
                                                appId="1162929354518536"
                                                autoLoad={false}
                                                fields="name,email,picture"
                                                // onClick={componentClicked}
                                                callback={responseFacebook}
                                                icon="fa-facebook"
                                                textButton="Login with Facebook Account"
                                            /> */}
                                        </div>
                                        <div className="or d-flex justify-content-between align-items-center">
                                            <span />
                                            <h6 className="mb-0">or</h6>
                                            <span />
                                        </div>
                                        <label htmlFor="username">Email</label>
                                        <input type="text" id="username" placeholder="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                        <label htmlFor="Password">Password</label>
                                        <input type="password" id="Password" placeholder="***************" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                        <div className="d-flex justify-content-between align-items-center remember mb-2">
                                            <div>
                                                <input type="checkbox" id="save" />
                                                <label htmlFor="save">Remember Me</label>
                                            </div>
                                            <a href="#" onClick={() => setForgotPasswordModal(true)}>Forgot Password?</a>
                                        </div>
                                        <p>{error}</p>
                                        <button id="login-btn" onClick={(e) => handleLogin(e)}>{loading ? "loading..." : "Login"}</button>
                                    </div>
                                    <h6>Don’t have an account? <span onClick={() => setSignupModal(true)}>Click Here to Create an Account</span>
                                    </h6></div>
                            </div>
                        </div>
                        <footer>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-10">
                                        <div className="row">
                                            {/* <div className="col-lg-2">
                                                <p>Advertise with us</p>
                                            </div> */}
                                            <div className="col-lg-3 col-md-3">
                                                <p onClick={() => setTermsModal(true)}>Terms and Condition</p>
                                                {/* terms and conditions modal  */}
                                                <Modal isOpen={termsModal} onRequestClose={() => setTermsModal(false)} id="terms">
                                                    {/* <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} /> */}
                                                    <h3 className="mb-3">Terms and Conditions</h3>
                                                    <p>Read our Polvote policy, which sets out our terms for your use of Polvote's social media Polvote.
                                                        We have created some terms and conditions (the Rules) which set out the terms for your use of Polvote’s social media Polvote, which currently spans comments on Polvote.com, Facebook, Twitter, YouTube, LinkedIn, Pinterest and Google+ (Polvote).
                                                        Please read the following Rules carefully, as they provide information about using Polvote in a way that is respectful and lawful. By using, or submitting material to, Polvote you agree that have read, understood, accept, and agree to abide by, these Rules.

                                                        The terms, conditions and policies that apply to specific social networks, such as Facebook or Twitter, also apply to Polvote profiles that we host. We recommend that you familiarise yourself with those terms and conditions before participating in Polvote and we disclaim any liability associated with your use of those services, or for your failure to view or comply with their terms, conditions and policies. Where there is a conflict between these Rules and the terms and conditions of the relevant social media channels, the social media channels’ terms and conditions will prevail.

                                                        Moderation of Polvote
                                                        We strive to create dialogue with users of our Polvote and encourage you to share content via Polvote in accordance with these Rules (Contribution). To help us do that, we try to monitor Polvote during normal CAT business hours (9am-5pm GMT, Monday to Friday, excluding UK public holidays). We will try to check that all submissions to Polvote comply with our acceptable use standards described below (Acceptable Use Standards) as soon as reasonably practicable after publication.

                                                        If in our opinion an individual makes use of Polvote in breach of these Rules, we reserve the right to remove, or to disable access to, any Contribution, and to terminate, suspend or change the conditions of their access to Polvote without prior warning. We also reserve the right to bring legal proceedings against any individual for a breach of the Rules, or take such other action as we reasonably deem appropriate.

                                                        We expressly exclude our liability for any loss or damage arising from the use of Polvote by any person in contravention of these Rules. While we try to moderate Polvote, we are not legally responsible for any material posted by third parties and we may stop, or suspend, moderating Polvote at any time.

                                                        Important points
                                                        The views expressed by any individual within Polvote are those of the individual and do not necessarily reflect the views of Polvote.
                                                        Any policitcal, leadership, governance and economic advice or information posted to Polvote should not be regarded as advice on which any reliance should be placed. We therefore disclaim all liability and responsibility arising from any reliance placed on such materials by a user of Polvote, or by anyone who may be informed of any of its contents. You must always seek policitcal, leadership, governance and economic advice from your doctor or a suitably qualified policitcal, leadership, governance and economic professional.
                                                        Any advice or information posted to Polvote should not be accepted as true or correct. It is up to individual users to check the validity of any advice or information before relying on it, especially where the consequences of following it could be serious.
                                                        Sometimes Polvote automatically follows back users which follow Polvote profiles within Polvote. A follow-back does not constitute an endorsement; the same applies to re-tweeting or sharing messages posted on accounts that Polvote does not own, or marking them as 'favourites', or otherwise sharing information on a different Polvote.
                                                        Minors
                                                        Polvote is intended for use by individuals aged 18 years or more. Minors must get permission from their parent or guardian before using Polvote. We recommend that parents who allow their children to use Polvote discuss online safety with their children first and that parents endeavour to monitor any use of Polvote. Minors should also be given guidance on how to use Polvote safely and in a way that complies with these Rules.
                                                        Acceptable use standards
                                                        We want to create an open, caring and respectful platform. To help us do this, you agree that your use of Polvote and your Contributions must:
                                                        •	be accurate and genuinely believed
                                                        •	avoid quoting out of context and include a credit for the original author as the source of material
                                                        •	comply with all applicable domestic, foreign and international laws that govern the content which makes up the Contribution
                                                        You also agree that your use of Polvote and Contributions will not:
                                                        •	be defamatory, unlawful, obscene, offensive, hateful, abusive, inflammatory, threatening, invasive of anyone’s privacy, or otherwise objectionable
                                                        •	promote discrimination on grounds of race, sex, religion, nationality, disability, religion or belief, sexual orientation, being a transsexual person, or age
                                                        •	infringe any intellectual property rights including copyright, design right, database right, patents, trade mark, moral or performer’s right or any other third party right
                                                        •	be likely to harass, upset, alarm or cause distress to any other person
                                                        •	contain an instruction, advice, or content that could cause harm or injury to individuals or to computers or systems
                                                        •	encourage anyone to commit any unlawful or criminal act or condone any unlawful or criminal act
                                                        •	give the impression that the Contribution emanates from Polvote (or any of its group companies) if this is not the case, or impersonate any person, or misrepresent your identity or affiliation with any person
                                                        Whenever you upload material to Polvote, or to make contact with other users of Polvote, you must comply with our Acceptable Use Standards. You warrant that any such contribution does comply with those standards, and you indemnify us for any breach of that warranty.
                                                        We also have the right to disclose your identity to any third party who is claiming that any material posted or uploaded by you to our site is defamatory of them, a violation of their intellectual property rights, or of their right to privacy.
                                                        We will not be responsible, or liable to any third party, for the content or accuracy of any materials posted by you or any other user of our site.

                                                        Copyright
                                                        By submitting a Contribution to Polvote, you agree to grant Polvote a non-exclusive perpetual licence to use that Contribution and to waive your moral rights. Although you will still own the copyright in your Contribution, Polvote will have the right to freely use, edit, alter, reproduce, publish and/or distribute the material contained in your Contribution in any format and media. This licence will be free of charge, perpetual and capable of sub-licence. Polvote may exercise all copyright and publicity rights in the material contained in your Contribution in all jurisdictions, to their full extent and for the full period for which any such rights exist in that material. We reserve the right to display advertisements in connection with your Contribution.
                                                        Please also note that, in accordance with the Content Standards, you must ensure that your Contribution does not infringe any copyright, database right or trade mark of any other person. By submitting your Contribution to Polvote, you are warranting that you have the right to grant Polvote the non-exclusive copyright licence described above.
                                                        If you are not in a position to grant such a licence to Polvote, please do not submit the Contribution to Polvote.

                                                        Data protection
                                                        If you are required to submit personal data directly to Polvote during the registration process, we will only use such data for administration and monitoring purposes and will not share your data with third parties unless legally required to do so.
                                                        Complaints
                                                        If you wish to complain about any Contribution posted to Polvote, please contact us at customerrelations@Polvote.com. When you submit a complaint, please
                                                        (1) outline the reason for your complaint, and
                                                        (2) specify where the Contribution you are complaining about is located.
                                                        We may request further information from you about your complaint before we process it. We will then review the Contribution and decide whether it complies with our Acceptable Use Standards. We will deal with any Contribution which, in our opinion, violates our Content Standards as described above (see section "Monitoring"). We will inform you of the outcome of our review within a reasonable time of receiving your complaint.

                                                        Changes to these rules
                                                        We may revise these Rules at any time. You are expected to check this page from time to time to take notice of any changes we make, as they are legally binding on you and will apply to you from the date the change was made. You agree to accept and comply with any changes to the rules if you use Polvote after the change is made.

                                                        Governing law and jurisdiction
                                                        These Rules are governed by and shall be construed in accordance with Nigerian law and you irrevocably submit to the exclusive jurisdiction of the courts of the Federal Republic of Nigeria to settle any dispute or claim that arises out of or in connection with these Rules, their subject matter or formation. If any part of these Rules is deemed unlawful, void, or for any reason unenforceable then that part will be deemed severable and will not affect the validity and enforceability of the remaining parts.
                                                    </p>
                                                </Modal>
                                            </div>
                                            <div className="col-lg-3 col-md-3">
                                                <p onClick={() => setPrivacyModal(true)}>Privacy Policy</p>
                                                {/* privacy modal */}
                                                <Modal isOpen={privacyModal} onRequestClose={() => setPrivacyModal(false)} id="terms">
                                                    {/* <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} /> */}
                                                    <h3 className="mb-3">Privacy Policy</h3>
                                                    <p>
                                                        Updated at 2022-04-30
                                                        Polvote is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Polvote.
                                                        This Privacy Policy applies to our website, and its associated subdomains (collectively, our services) alongside our application, Polvote. By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
                                                        Definitions and key terms
                                                        To help explain things as clearly as possible in this Privacy Policy, every time any of these terms are referenced, are strictly defined as:
                                                        Cookie: Â small amount of data generated by a website and saved by your web browser. It is used to identify your browser, provide analytics, remember information about you such as your language preference or login information.

                                                        Company: when this policy mentions ‘company’ it refers to Fresh Streams Works, (22 Orelope Street, Egbeda, Lagos) that is responsible for your information under this Privacy Policy.

                                                        Country: where Polvote or the owners/founders of Polvote are based, in this case is Nigeria

                                                        Customer: Customer refers to the company, organization or person that signs up to use the Polvote Service to manage the relationships with your consumers or service users.
                                                        Device: Device means any internet connected device such as a phone, tablet, computer or any other device that can be used to visit Polvote and use the services.
                                                        IP address: Every device connected to the Internet is assigned a number known as an Internet protocol (IP) address. These numbers are usually assigned in geographic blocks. An IP address can often be used to identify the location from which a device is connecting to the Internet.
                                                        Personnel: This refers to those individuals who are employed by Polvote or are under contract to perform a service on behalf of one of the parties.

                                                        Personal Data: any information that directly, indirectly, or in connection with other information including a personal identification number which allows for the identification or identifiability of a natural person.
                                                        Service: refers to the service provided by Polvote as described in the relative terms (if available) and on this platform.
                                                        Third-party service: this refers to advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products or services we think may interest you.
                                                        -Website: Polvote’s site, which can be accessed via this URL: www.polvote.com
                                                        -You: a person or entity that is registered with Polvote to use the Services.

                                                        What Information Do We Collect?
                                                        We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form.
                                                        -Name / Username
                                                        -Phone Numbers
                                                        -Email Addresses
                                                        -Password

                                                        We also collect information from mobile devices for a better user experience, although these features are completely optional:
                                                        -Photo Gallery (Pictures): Granting photo gallery access allows the user to upload any picture from their photo gallery, you can safely deny photo gallery access for this website.

                                                        How Do We Use The Information We Collect?
                                                        Any of the information we collect from you may be used in one of the following ways:
                                                        -To personalize your experience (your information helps us to better respond to your individual needs)
                                                        -To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)
                                                        -To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)
                                                        -To process transactions
                                                        -To administer a contest, promotion, survey or other site feature
                                                        -To send periodic emails
                                                        When does Polvote use end user information from third parties?
                                                        Polvote will collect End User Data necessary to provide the Polvote services to our customers.
                                                        End users may voluntarily provide us with information they have made available on social media websites. If you provide us with any such information, we may collect publicly available information from the social media websites you have indicated. You can control how much of your information social media websites make public by visiting these websites and changing your privacy settings.
                                                        When does Polvote use customer information from third parties?
                                                        We receive some information from the third parties when you contact us. For example, when you submit your email address to us to show interest in becoming a Polvote customer, we receive information from a third party that provides automated fraud detection services to Polvote. We also occasionally collect information that is made publicly available on social media websites. You can control how much of your information social media websites make public by visiting these websites and changing your privacy settings.
                                                        Do we share the information we collect with third parties?
                                                        We may share the information that we collect, both personal and non-personal, with third parties such as advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products or services we think may interest you. We may also share it with our current and future affiliated companies and business partners, and if we are involved in a merger, asset sale or other business reorganization, we may also share or transfer your personal and non-personal information to our successors-in-interest.
                                                        We may engage trusted third-party service providers to perform functions and provide services to us, such as hosting and maintaining our servers and the website, database storage and management, e-mail management, storage marketing, credit card processing, customer service and fulfilling orders for products and services you may purchase through the website. We will likely share your personal information, and possibly some non-personal information, with these third parties to enable them to perform these services for us and for you.
                                                        We may share portions of our log file data, including IP addresses, for analytics purposes with third parties such as web analytics partners, application developers, and ad networks. If your IP address is shared, it may be used to estimate general location and other technographics such as connection speed, whether you have visited the website in a shared location, and type of the device used to visit the website. They may aggregate information about our advertising and what you see on the website and then provide auditing, research and reporting for us and our advertisers.
                                                        We may also disclose personal and non-personal information about you to government or law enforcement officials or private parties as we, in our sole discretion, believe necessary or appropriate in order to respond to claims, legal process (including subpoenas), to protect our rights and interests or those of a third party, the safety of the public or any person, to prevent or stop any illegal, unethical, or legally actionable activity, or to otherwise comply with applicable court orders, laws, rules and regulations.
                                                        Where and when is information collected from customers and end users?
                                                        Polvote will collect personal information that you submit to us. We may also receive personal information about you from third parties as described above.
                                                        How Do We Use Your Email Address?
                                                        By submitting your email address on this website, you agree to receive emails from us. You can cancel your participation in any of these email lists at any time by clicking on the opt-out link or other unsubscribe option that is included in the respective email. We only send emails to people who have authorized us to contact them, either directly, or through a third party. We do not send unsolicited commercial emails, because we hate spam as much as you do. By submitting your email address, you also agree to allow us to use your email address for customer audience targeting on sites like Facebook, where we display custom advertising to specific people who have opted-in to receive communications from us. Email addresses submitted only through the order processing page will be used for the sole purpose of sending you information and updates pertaining to your order. If, however, you have provided the same email to us through another method, we may use it for any of the purposes stated in this Policy. Note: If at any time you would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.
                                                        How Long Do We Keep Your Information?
                                                        We keep your information only so long as we need it to provide Polvote to you and fulfill the purposes described in this policy. This is also the case for anyone that we share your information with and who carries out services on our behalf. When we no longer need to use your information and there is no need for us to keep it to comply with our legal or regulatory obligations, we either remove it from our systems or depersonalize it so that we can't identify you.
                                                        How Do We Protect Your Information?
                                                        We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential. After a transaction, your private information (credit cards, social security numbers, financials, etc.) is never kept on file. We cannot, however, ensure or warrant the absolute security of any information you transmit to Polvote or guarantee that your information on the Service may not be accessed, disclosed, altered, or destroyed by a breach of any of our physical, technical, or managerial safeguards.
                                                        Could my information be transferred to other countries?
                                                        Polvote is incorporated in Nigeria. Information collected via our website, through direct interactions with you, or from use of our help services may be transferred from time to time to our offices or personnel, or to third parties, located throughout the world, and may be viewed and hosted anywhere in the world, including countries that may not have laws of general applicability regulating the use and transfer of such data. To the fullest extent allowed by applicable law, by using any of the above, you voluntarily consent to the trans-border transfer and hosting of such information.
                                                        Is the information collected through the Polvote Service secure?
                                                        We take precautions to protect the security of your information. We have physical, electronic, and managerial procedures to help safeguard, prevent unauthorized access, maintain data security, and correctly use your information. However, neither people nor security systems are foolproof, including encryption systems. In addition, people can commit intentional crimes, make mistakes or fail to follow policies. Therefore, while we use reasonable efforts to protect your personal information, we cannot guarantee its absolute security. If applicable law imposes any non-disclaimable duty to protect your personal information, you agree that intentional misconduct will be the standards used to measure our compliance with that duty.
                                                        Can I update or correct my information?
                                                        The rights you have to request updates or corrections to the information Polvote collects depend on your relationship with Polvote. Personnel may update or correct their information as detailed in our internal company employment policies.
                                                        Customers have the right to request the restriction of certain uses and disclosures of personally identifiable information as follows. You canÂ contact us in order to (1) update or correct your personally identifiable information, (2) change your preferences with respect to communications and other information you receive from us, or (3) delete the personally identifiable information maintained about you on our systems (subject to the following paragraph), byÂ cancelling your account. Such updates, corrections, changes and deletions will have no effect on other information that we maintain, or information that we have provided to third parties in accordance with this Privacy Policy prior to such update, correction, change or deletion. To protect your privacy and security, we may take reasonable steps (such as requesting a unique password) to verify your identity before granting you profile access or making corrections. You are responsible for maintaining the secrecy of your unique password and account information at all times.
                                                        You should be aware that it is not technologically possible to remove each and every record of the information you have provided to us from our system. The need to back up our systems to protect information from inadvertent loss means that a copy of your information may exist in a non-erasable form that will be difficult or impossible for us to locate. Promptly after receiving your request, all personal information stored in databases we actively use, and other readily searchable media will be updated, corrected, changed or deleted, as appropriate, as soon as and to the extent reasonably and technically practicable.
                                                        If you are an end user and wish to update, delete, or receive any information we have about you, you may do so by contacting the organization of which you are a customer.
                                                        Personnel
                                                        If you are a Polvote worker or applicant, we collect information you voluntarily provide to us. We use the information collected for Human Resources purposes in order to administer benefits to workers and screen applicants.
                                                        You may contact us in order to (1) update or correct your information, (2) change your preferences with respect to communications and other information you receive from us, or (3) receive a record of the information we have relating to you. Such updates, corrections, changes and deletions will have no effect on other information that we maintain, or information that we have provided to third parties in accordance with this Privacy Policy prior to such update, correction, change or deletion.
                                                        Sale of Business
                                                        We reserve the right to transfer information to a third party in the event of a sale, merger or other transfer of all or substantially all of the assets of Polvote or any of its Corporate Affiliates (as defined herein), or that portion of Polvote or any of its Corporate Affiliates to which the Service relates, or in the event that we discontinue our business or file a petition or have filed against us a petition in bankruptcy, reorganization or similar proceeding, provided that the third party agrees to adhere to the terms of this Privacy Policy.
                                                        Affiliates
                                                        We may disclose information (including personal information) about you to our Corporate Affiliates. For purposes of this Privacy Policy, "Corporate Affiliate" means any person or entity which directly or indirectly controls, is controlled by or is under common control with Polvote, whether by ownership or otherwise. Any information relating to you that we provide to our Corporate Affiliates will be treated by those Corporate Affiliates in accordance with the terms of this Privacy Policy.
                                                        Governing Law
                                                        This Privacy Policy is governed by the laws of Nigeria without regard to its conflict of laws provision. You consent to the exclusive jurisdiction of the courts in connection with any action or dispute arising between the parties under or in connection with this Privacy Policy except for those individuals who may have rights to make claims under Privacy Shield, or the Swiss-US framework.
                                                        The laws of Nigeria, excluding its conflicts of law rules, shall govern this Agreement and your use of the website. Your use of the website may also be subject to other local, state, national, or international laws.
                                                        By using Polvote or contacting us directly, you signify your acceptance of this Privacy Policy. If you do not agree to this Privacy Policy, you should not engage with our website, or use our services. Continued use of the website, direct engagement with us, or following the posting of changes to this Privacy Policy that do not significantly affect the use or disclosure of your personal information will mean that you accept those changes.
                                                        Your Consent
                                                        We've updated ourÂ Privacy PolicyÂ to provide you with complete transparency into what is being set when you visit our site and how it's being used. By using our website, registering an account, or making a purchase, you hereby consent to our Privacy Policy and agree to its terms.
                                                        Links to Other Websites
                                                        This Privacy Policy applies only to the Services. The Services may contain links to other websites not operated or controlled by Polvote. We are not responsible for the content, accuracy or opinions expressed in such websites, and such websites are not investigated, monitored or checked for accuracy or completeness by us. Please remember that when you use a link to go from the Services to another website, our Privacy Policy is no longer in effect. Your browsing and interaction on any other website, including those that have a link on our platform, is subject to that websiteâ€™s own rules and policies. Such third parties may use their own cookies or other methods to collect information about you.
                                                        Advertising
                                                        This website may contain third party advertisements and links to third party sites. Polvote does not make any representation as to the accuracy or suitability of any of the information contained in those advertisements or sites and does not accept any responsibility or liability for the conduct or content of those advertisements and sites and the offerings made by the third parties.
                                                        Advertising keeps Polvote and many of the websites and services you use free of charge. We work hard to make sure that ads are safe, unobtrusive, and as relevant as possible.
                                                        Third party advertisements and links to other sites where goods or services are advertised are not endorsements or recommendations by Polvote of the third party sites, goods or services. Polvote takes no responsibility for the content of any of the ads, promises made, or the quality/reliability of the products or services offered in all advertisements.
                                                        Cookies for Advertising
                                                        These cookies collect information over time about your online activity on the website and other online services to make online advertisements more relevant and effective to you. This is known as interest-based advertising. They also perform functions like preventing the same ad from continuously reappearing and ensuring that ads are properly displayed for advertisers. Without cookies, itâ€™s really hard for an advertiser to reach its audience, or to know how many ads were shown and how many clicks they received.
                                                        Cookies
                                                        Polvote uses "Cookies" to identify the areas of our website that you have visited. A Cookie is a small piece of data stored on your computer or mobile device by your web browser. We use Cookies to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality like videos may become unavailable or you would be required to enter your login details every time you visit the website as we would not be able to remember that you had logged in previously. Most web browsers can be set to disable the use of Cookies. However, if you disable Cookies, you may not be able to access functionality on our website correctly or at all. We never place Personally Identifiable Information in Cookies.
                                                        Blocking and disabling cookies and similar technologies
                                                        Wherever you're located you may also set your browser to block cookies and similar technologies, but this action may block our essential cookies and prevent our website from functioning properly, and you may not be able to fully utilize all of its features and services. You should also be aware that you may also lose some saved information (e.g. saved login details, site preferences) if you block cookies on your browser. Different browsers make different controls available to you. Disabling a cookie or category of cookie does not delete the cookie from your browser, you will need to do this yourself from within your browser, you should visit your browser's help menu for more information.
                                                        Remarketing Services
                                                        We use remarketing services. What Is Remarketing? In digital marketing, remarketing (or retargeting) is the practice of serving ads across the internet to people who have already visited your website. It allows your company to seem like they're â€œfollowingâ€ people around the internet by serving ads on the websites and platforms they use most.
                                                        Payment Details
                                                        In respect to any credit card or other payment processing details you have provided us, we commit that this confidential information will be stored in the most secure manner possible.
                                                        Kids' Privacy
                                                        We do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                                                        Changes To Our Privacy Policy
                                                        We may change our Service and policies, and we may need to make changes to this Privacy Policy so that they accurately reflect our Service and policies. Unless otherwise required by law, we will notify you (for example, through our Service) before we make changes to this Privacy Policy and give you an opportunity to review them before they go into effect. Then, if you continue to use the Service, you will be bound by the updated Privacy Policy. If you do not want to agree to this or any updated Privacy Policy, you can delete your account.
                                                        Third-Party Services
                                                        We may display, include or make available third-party content (including data, information, applications and other products services) or provide links to third-party websites or services ("Third- Party Services").
                                                        You acknowledge and agree that Polvote shall not be responsible for any Third-Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any other aspect thereof. Polvote does not assume and shall not have any liability or responsibility to you or any other person or entity for any Third-Party Services.
                                                        Third-Party Services and links thereto are provided solely as a convenience to you and you access and use them entirely at your own risk and subject to such third parties' terms and conditions.
                                                        Facebook Pixel
                                                        Facebook pixelÂ is an analytics tool that allows you to measure the effectiveness of your advertising by understanding the actions people take on your website. You can use theÂ pixelÂ to: Make sure your ads are shown to the right people. Facebook pixel may collect information from your device when you use the service. Facebook pixel collects information that is held in accordance with its Privacy Policy
                                                        Tracking Technologies
                                                        -Google Maps API
                                                        Google Maps APIÂ is a robust tool that can be used to create a customÂ map, a searchableÂ map, check-in functions, display live data synching with location, plan routes, or create a mashup just to name a few.
                                                        Google Maps API may collect information from You and from Your Device for security purposes.
                                                        Google Maps API collects information that is held in accordance with its Privacy Policy
                                                        -Cookies
                                                        We use Cookies to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality like videos may become unavailable or you would be required to enter your login details every time you visit the website as we would not be able to remember that you had logged in previously.
                                                        -Local Storage
                                                        Local Storage sometimes known as DOM storage, provides web apps with methods and protocols for storing client-side data. Web storage supports persistent data storage, similar to cookies but with a greatly enhanced capacity and no information stored in the HTTP request header.
                                                        -Sessions
                                                        Polvote uses "Sessions" to identify the areas of our website that you have visited. A Session is a small piece of data stored on your computer or mobile device by your web browser.
                                                        Information about General Data Protection Regulation (GDPR)
                                                        We may be collecting and using information from you if you are from the European Economic Area (EEA), and in this section of our Privacy Policy we are going to explain exactly how and why is this data collected, and how we maintain this data under protection from being replicated or used in the wrong way.
                                                        What is GDPR?
                                                        GDPR is an EU-wide privacy and data protection law that regulates how EU residents' data is protected by companies and enhances the controlÂ the EU residents have, over their personal data.
                                                        The GDPR is relevant to any globally operating company and not just the EU-based businesses and EU residents. Our customersâ€™ data is important irrespective of where they are located, which is why we have implemented GDPR controls as our baseline standard for all our operations worldwide.
                                                        What is personal data?
                                                        Any data that relates to an identifiable or identified individual. GDPR covers a broad spectrum of information that could be used on its own, or in combination with other pieces of information, to identify a person. Personal data extends beyond a personâ€™s name or email address. Some examples include financial information, political opinions, genetic data, biometric data, IP addresses, physical address, sexual orientation, and ethnicity.
                                                        The Data Protection Principles include requirements such as:
                                                        -Personal data collected must be processed in a fair, legal, and transparent way and should only be used in a way that a person would reasonably expect.
                                                        -Personal data should only be collected to fulfil a specific purpose and it should only be used for that purpose. Organizations must specify why they need the personal data when they collect it.
                                                        -Personal data should be held no longer than necessary to fulfil its purpose.
                                                        -People covered by the GDPR have the right to access their own personal data. They can also request a copy of their data, and that their data be updated, deleted, restricted, or moved to another organization.
                                                        Why is GDPR important?
                                                        GDPR adds some new requirements regarding how companies should protect individuals' personal data that they collect and process. It also raises the stakes for compliance by increasing enforcement and imposing greater fines for breach. Beyond these facts it's simply the right thing to do. At Polvote we strongly believe that your data privacy is very important and we already have solid security and privacy practices in place that go beyond the requirements of this new regulation.
                                                        Individual Data Subject's Rights - Data Access, Portability and Deletion
                                                        We are committed to helping our customers meet theÂ data subject rights requirements of GDPR. Polvote processes or stores all personal data in fully vetted, DPA compliant vendors. We do store all conversation and personal data for up to 6 years unless your account is deleted. In which case, we dispose of all data in accordance with our Terms of Service and Privacy Policy, but we will not hold it longer than 60 days.
                                                        We are aware that if you are working with EU customers, you need to be able to provide them with the ability to access, update, retrieve and remove personal data. We got you! We've been set up as self service from the start and have always given you access to your data and your customers data. Our customerÂ support team is here for you to answer any questions you might have about working with the API.
                                                        California Residents
                                                        The California Consumer Privacy Act (CCPA) requires us to disclose categories of Personal Information we collect and how we use it, the categories of sources from whom we collect Personal Information, and the third parties with whom we share it, which we have explained above.
                                                        We are also required to communicate information about rights California residents have under California law. You may exercise the following rights:
                                                        -Right to Know and Access. You may submit a verifiable request for information regarding the: (1) categories of Personal Information we collect, use, or share; (2) purposes for which categories of Personal Information are collected or used by us; (3) categories of sources from which we collect Personal Information; and (4) specific pieces of Personal Information we have collected about you.
                                                        -Right to Equal Service. We will not discriminate against you if you exercise your privacy rights.
                                                        -Right to Delete. You may submit a verifiable request to close your account and we will delete Personal Information about you that we have collected.
                                                        -Request that a business that sells a consumer's personal data, not sell the consumer's personal data.
                                                        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                                                        We do not sell the Personal Information of our users.
                                                        For more information about these rights, please contact us.
                                                        Contact Us
                                                        Don't hesitate to contact us if you have any questions.
                                                        -Via Email:  contact@polvote.com
                                                        -Via Phone Number:  +2348084468097
                                                        -Via this Link:  www.polvote.com
                                                    </p>
                                                </Modal>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 d-flex justify-content-end">
                                        <a href="https://youtube.com/channel/UCkcn0Kv_w_Qe0MfZ7Hhe6lg" target="_blank"><img src="/img/youtube.png" alt="youtube" /></a>
                                        <a href="https://www.facebook.com/Polvoteofficial-115809974445682/" target="_blank"><img src="/img/fb.png" alt="facebook" /></a>
                                        <a href="https://www.instagram.com/polvoteofficial/" target="_blank"><img src="/img/insta.png" alt="instagram" /></a>
                                        <a href="https://twitter.com/pol_vote?t=iVqZBrU9MA793b4K1-YLwQ" target="_blank"><img src="/img/twitter.png" alt="twitter" /></a>
                                        {/* <img src="img/linkedin.png" alt="linkedIn" />
                                        <img src="img/fb.png" alt="facebook" />
                                        <img src="img/insta.png" alt="instagram" />
                                        <img src="img/twitter.png" alt="twitter" />
                                        <img src="img/tiktok.png" alt="tiktok" /> */}
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>

                {/* signup modal  */}
                <Modal isOpen={signupModal} onRequestClose={() => setSignupModal(false)} id="signup" className={`${context.darkMode ? 'dm' : ""}`}>
                    <i className="fa-solid fa-circle-xmark" onClick={() => setSignupModal(false)} />
                    <h1>Signup on Polvote</h1>
                    <h4>Votes made on Polvote are only limited to Polvote and does not count for the National Election!</h4>
                    <div className="form">
                        <div className="row mb-3">
                            <div className="col-lg-3 col-md-3 col-sm-2" />
                            <div className="col-lg-6 col-md-6 col-sm-8 col-12">
                                <GoogleLogin
                                    clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                                    // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                                    buttonText="Signup with your Googe Account"
                                    onSuccess={responseSuccessGoogle}
                                    onFailure={responseErrorGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-2" />
                            {/* <div className="col-lg-6">
                                <FacebookLogin
                                    appId="1162929354518536"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    // onClick={componentClicked}
                                    callback={responseFacebook}
                                    icon="fa-facebook"
                                    textButton="Signup with your Facebook Account"
                                />
                            </div> */}
                            {/* <div className="col-lg-3"></div> */}
                        </div>
                        <div className="or d-flex justify-content-between align-items-center mb-3">
                            <span />
                            <h5 className="mb-0">or</h5>
                            <span />
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="fname">First Name</label>
                                <input id="fname" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="lname">Last Name</label>
                                <input id="lname" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="Username">Username</label>
                                <input id="Username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="Email">Email</label>
                                <input id="Email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="number">Phone Number</label>
                                <input id="number" type="tel" placeholder="+234  |   700234567891" value={number} onChange={(e) => setNumber(e.target.value)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <label htmlFor="pass">Create Password</label>
                                <input id="pass" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <p>{error}</p>
                        <button id="create" className="mb-3" onClick={handleSignUp}>{loading ? "loading..." : "Create Account"}</button>
                        <h6>Already have an account? <span onClick={() => setSignupModal(false)}>Login</span></h6>
                    </div>
                </Modal>

                {/* verification modal */}
                <Modal isOpen={verificationModal} onRequestClose={() => setVerificationModal(false)} id="verification" className={`${context.darkMode ? 'dm' : ""}`}>
                    <i className="fa-solid fa-circle-xmark" onClick={() => setVerificationModal(false)} />
                    <img src="img/verify.png" alt="email" />
                    <h1>One More Step!</h1>
                    <p>A Verification link has been sent to <span>{email}</span>. Please click on the link to verify
                        your account. <span id="spam-text">Also check your SPAM folder in case it didn't drop in your Inbox</span>
                    </p>
                </Modal>

                {/* forgot password modal */}
                <Modal isOpen={forgotPasswordModal} onRequestClose={() => setForgotPasswordModal(false)} id="forgot-password" className={`${context.darkMode ? 'dm' : ""}`}>
                    <i className="fa-solid fa-circle-xmark" onClick={() => setForgotPasswordModal(false)} />
                    <div className="content">
                        {/* enter email */}
                        {verificationView === 'email' &&
                            <>
                                <h1>Forgot Password</h1>
                                <label htmlFor="v-email">Input Email Address</label>
                                <input type="text" id="v-email" placeholder="xyz@email.com" value={verifyEmailInput} onChange={(e) => setVerifyEmailInput(e.target.value)} />
                                <p>{verifyEmailError}</p>
                                <button onClick={verifyEmail} >{verifyEmailLoading ? "loading..." : "Send"}</button>
                            </>
                        }

                        {/* otp */}
                        {verificationView === 'otp' &&
                            <>
                                <i className="fa-solid fa-arrow-left-long otp-back" onClick={() => setVerificationView("email")} />
                                <h2>Enter (OTP) One Time Password</h2>
                                <p>Kindly check your email {verifyEmailInput}. Enter the OTP sent from Polvote, <span>Also check your SPAM folder in case it didn't drop in your Inbox</span></p>
                                <div className="otp-input d-flex justify-content-between">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                type="text"
                                                placeholder={index + 1}
                                                maxLength="1"
                                                key={index}
                                                value={data}
                                                onChange={e => handleChange(e.target, index)}
                                                onFocus={e => e.target.select()}
                                            />
                                        )
                                    })}
                                </div>
                                <p>{verifyEmailError}</p>
                                <button onClick={handleOtp} >{verifyEmailLoading ? "loading..." : "Send"}</button>
                            </>
                        }

                        {/* reset */}
                        {verificationView === 'reset' &&
                            <>
                                <h1>Reset your Password</h1>
                                <label htmlFor="">New Password</label>
                                <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <label htmlFor="">Confirm New Password</label>
                                <input type="password" placeholder="Enter New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <p>{verifyEmailError}</p>
                                <button onClick={handleNewPassword}>{verifyEmailLoading ? "loading..." : "Reset Password"}</button>
                            </>
                        }

                        {/* success */}
                        {verificationView === 'success' &&
                            <>
                                <h1>Password Successfully Reset</h1>
                                <h3>Password Successfully Reset</h3>
                                <button onClick={() => {
                                    setForgotPasswordModal(false)
                                    setVerificationView('email')
                                }}>Login</button>
                            </>
                        }
                    </div>
                </Modal>
            </>
        )
    }

    return (
        <div className={`container-fluid ${context.darkMode ? 'dm' : ""}`} >
            <Nav />
            {/* feed  */}
            <div className="home-feed container">
                <div className="row justify-content-lg-between">
                    {/* aside  */}
                    <div className="col-lg-3 col-md-3 aside">
                        <Aside />
                    </div>
                    {/* gutter  */}
                    {/* <div className="col-lg-1 col-md-0" /> */}
                    {/* main  */}
                    <div className="col-lg-8 col-md-9 main">
                        {/* header  */}
                        <div className="header">
                            <h1>Explore Politics, Learn and Share Insights Online</h1>
                            <div className="searchbar d-flex align-items-center justify-content-between">
                                <input type="text" placeholder="Search for Polls, Stories, and Profiles" value={context.homeSearchKey} onChange={(e) => setContext({ ...context, homeSearchKey: e.target.value })} onKeyPress={handleKeyPress} />
                                <img src="img/search-normal.png" alt="search" onClick={search} />
                            </div>
                        </div>
                        {/* advert  */}
                        {/* <img src="img/newBanner.png" alt="advert" className="banner-add" /> */}
                        <div>
                            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                crossorigin="anonymous"></script>
                            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                            <script>
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </script>
                        </div>
                        {/* poll  */}
                        <HomePollCard />
                        {/* stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>Recent Stories</h3>
                                <div className="d-flex align-items-center">
                                    <h4 onClick={() => setWriteStoryModal(true)}><i className="fas fa-edit" />Write New Story</h4>
                                    {/* write story modal  */}
                                    {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />}
                                    <h4 onClick={() => navigate('/stories')}>See all Stories</h4>
                                </div>
                            </div>
                            <div className="carousel">
                                {!storyFetch &&
                                    <>
                                        {stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0).slice(Math.max(stories.filter(story => story.image.length !== 0).length - 7, 1)).map((story, index) => {
                                            return (
                                                <HomeStoryCard story={story} key={index} />
                                            )
                                        }).reverse()}
                                    </>
                                }
                            </div>
                        </div>
                        {/* adds  */}
                        <div className="adds">
                            <div className="row">
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">Recently added profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(Math.max(aspirants.filter(aspirant => aspirant.status === "1").length - profileLength, 1)).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    }).reverse()}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="go-to-profile">Go to Profiles</button>
                                <button onClick={() => setProfileLength(prev => prev + 1)} id="load-more">Load More Profiles</button>
                            </div>
                        </div>
                        {/* Ekiti polls  */}
                        <EkitiPolls />
                        {/* more stories  */}
                        <div className="stories">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h3>More Stories</h3>
                                <div className="d-flex align-items-center">
                                    {/* <h4 onClick={() => setWriteStoryModal(true)}><i className="fas fa-edit" />Write New Story</h4> */}
                                    {/* write story modal  */}
                                    {/* {writeStoryModal && <WriteStoryModal openModal={writeStoryModal} handleWriteStoryModal={handleWriteStoryModal} />} */}
                                    <h4 onClick={() => navigate('/stories')}>See all Stories</h4>
                                </div>
                            </div>
                            <div className="carousel">
                                {!storyFetch &&
                                    <>
                                        {stories.filter(story => story.image.length !== 0 && story.storyinfo.length === 0).map((story, index) => {
                                            return (
                                                <HomeStoryCard story={story} key={index} />
                                            )
                                        })}
                                    </>
                                }
                            </div>
                        </div>
                        {/* more profiles  */}
                        <div className="profiles">
                            <div className="header d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">More profiles</h3>
                                <Link to={'/create-aspirant'}><p className="mb-0"><i className="fas fa-edit" />Write Aspirant Profile</p></Link>
                            </div>
                            {!aspirantFetch &&
                                <div className="profile">
                                    {aspirants.filter(aspirant => aspirant.status === "1").slice(0, 4).map((aspirant, index) => {
                                        return (
                                            <SingleProfileCard aspirant={aspirant} key={index} />
                                        )
                                    })}
                                </div>
                            }
                            <div className="d-flex justify-content-end align-items-center mt-4">
                                <button onClick={() => navigate('/profiles')} id="go-to-profile">Go to Profiles</button>
                                {/* <button onClick={() => setProfileLength(prev => prev + 1)} id="load-more">Load More Profiles</button> */}
                            </div>
                        </div>
                        {/* osun polls  */}
                        <OsunPolls />
                        {/* adds  */}
                        <div className="adds mt-5">
                            <div className="row">
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    {/* <p>Close Ad <i className="fas fa-times-circle" /></p>
                                    <img src="img/bill-300-x-250 1.png" alt="adds" className="img-fluid" /> */}
                                    <div>
                                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                            crossorigin="anonymous"></script>
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                                        <script>
                                            (adsbygoogle = window.adsbygoogle || []).push({ });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* courses  */}
                        {/* <div className="courses">
                            <div className="header d-flex justify-content-between align-items-center mb-2">
                                <h3>Courses (Hot Picks for you)</h3>
                                <a href>See All Courses<i className="fas fa-angle-right" /></a>
                            </div>
                            <div className="carousel">
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="course">
                                    <img src="img/unsplash_Co1Y7NxclgY.png" alt="course-img" />
                                    <div className="body">
                                        <h3>The Politics of Skepticism</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="rating d-flex align-items-center">
                                                <i className="fas fa-star" />
                                                <span id="r1" className="mb-0">4.9</span>
                                                <span id="r2" className="mb-0">4,709 Ratings</span>
                                            </div>
                                            <a href>Preview<i className="fas fa-angle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* add  */}
                        {/* <img src="img/newBanner.png" alt="advert" /> */}
                        <div>
                            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8526972460998976"
                                crossorigin="anonymous"></script>
                            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8526972460998976" data-ad-slot={4741582797} data-ad-format="auto" data-full-width-responsive="true" />
                            <script>
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </script>
                        </div>
                        {/* footer  */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;