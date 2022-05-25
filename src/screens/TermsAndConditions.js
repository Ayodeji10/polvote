import React, { useContext, useState } from 'react'
import { DataContext } from "../dataContext";
import { Link } from "react-router-dom";

function TermsAndConditions() {
    // context 
    const { context } = useContext(DataContext)

    const [currentSection, setCurrentSection] = useState("termsandcondition")

    return (
        <div className={`container-fluid terms ${context.darkMode ? 'dm' : ""}`}>
            <div className="container">
                <Link to={'/'}>
                    {context.darkMode ? <img src="/img/logo-dm.png" id="logo" alt="logo" /> : <img src="/img/logo.png" id="logo" alt="logo" />}
                </Link>
                <div className="row pb-5">
                    <div className="col-lg-9 col-md-9 col-sm-8 order-lg-1 order-md-1 order-sm-1 order-2">
                        <div className='d-flex align-items-center mb-lg-5 mb-md-4 mb-sm-4 mb-2'>
                            <h2 className='active'>Terms and Condition</h2>
                            <Link to={'/privacy-policy'}><h2>Privacy Policy</h2></Link>
                        </div>
                        <div id="termsandcondition">
                            <p>Read our privacy policy, which sets out our terms  for your use of Polvote’s social media Polvote.</p>
                            <p>We have created some terms and conditions (the Rules) which set out the terms for your use of Polvote’s social media Polvote, which currently  spans comments on Polvote.com, Facebooj, Twitter, YouTube, LinkedIn, Pinterest and Google+ (Polvote). <br />
                                Please read the following Rules  carefully, as they provide information about using Polvote in a way that is respectful and lawful. By using, or submitting material to, Polvote you agree that have read, understood, accept, and agree to abide by, these Rules.</p>
                            <p>The terms, conditions and policies that apply to specific social networks, such as Facebook or Twitter, also apply to Polvote profiles that we host. We recommend that you familiarise yourself with those terms and conditions before participating in Polvote and we disclaim any liability associated with your use of those services, or for your failure to view or comply with their terms, conditions and policies. Where there is a conflict between these Rules and the terms and conditions of the relevant social media channels, the social media channels’ terms and conditions will prevail.</p>
                        </div>
                        <div id="ModerationofPolvote">
                            <h3>Moderation of Polvote</h3>
                            <p>We strive to create dialogue with users of our Polvote and encourage you to share content via Polvote in accordance with these Rules (Contribution). To help us do that, we try to monitor Polvote during normal CAT business hours (9am-5pm GMT, Monday to Friday, excluding UK public holidays).  We will try to check that all submissions to Polvote comply with our  acceptable use standards described below (Acceptable Use Stadards) as soon as reasonably practicable after publication.</p>
                            <p>If in our opinion an individual makes use of Polvote in breach of these Rules, we reserve the right to remove, or to disable access to, any Contribution, and to terminate, suspend or change the conditions of their access to Polvote without prior warning. We also reserve the right to bring legal proceedings against any individual for a breach of the Rules, or take such other action as we reasonably deem appropriate.</p>
                            <p>We expressly exclude our liability for any loss or damage arising from the use of Polvote by any person in contravention of these Rules. While we try to moderate Polvote, we are not legally responsible for any material posted by third parties and we may stop, or suspend, moderating Polvote at any time.</p>
                        </div>
                        <div id="Importantpoints">
                            <h3>Important points</h3>
                            <p>The views expressed by any individual within Polvote are those of the individual and do not necessarily reflect the views of Polvote. <br />
                                Any political, leadership, governance  and economic advice or information posted to Polvote should not be regarded as advice on which any reliance should be placed. We therefore disclaim at liability and responsibility arising from any reliance placed on such materials by a user of Polvote, or by anyone who may be informed of any of its contents. You must always seek political, leadership, governance and economic advice from your doctor or a suitably qualified political, leadership, governance and economic professional.</p>
                            <p>Any advice or information posted to Polvote should not be accepted as true or correct. It is up to individual users to check the validity of any advice or information before relying on it, especially where the consequences of following it could be serious. <br />
                                Sometimes Polvote automatically follows back users which follow Polvote profiles within Polvote. A follow-back does not constitute an endorsement; the same applies to re-tweeting or sharing messages posted on accounts that Polvote does not own, or marking them as 'favourites', or otherwise sharing information on a different Polvote</p>
                        </div>
                        <div id="Acceptableusestandards">
                            <h3>Acceptable use standards</h3>
                            <p>
                                We want to create an open, caring and respectful platform. To help us do this, you agree that your use of Polvote and your Contributions must:
                            </p>
                            <ul>
                                <li>Be accurate and genuinely believed</li>
                                <li>Avoid quoting out of context and include a credit for the original author as the source of material</li>
                                <li>Comply with all applicable domestic, foreign and international laws that govern the content which makes up the contribution</li>

                            </ul>
                            <p>You also agree that your use of Polvote and Contributions will not:</p>
                            <ul>
                                <li>Be defamatory, unlawful, obscene, offensive, hateful, abusive, inflammatory, threatening, invasive of anyone’s privacy, or otherwise objectionable</li>
                                <li>Promote discrimination on grounds of race, sex, religion, nationality, disability, religion or belief, sexual orientation, being a transsexual person, or age</li>
                                <li>Infringe any intellectual property rights including copyright, design right, database right, patents, trade mark, moral or performer’s right or any other third party right</li>
                                <li>Be likely to harass, upset, alarm or cause distress to any other person</li>
                                <li>Contain an instruction, advice, or content that could cause harm or injury to individuals or to computers or systems</li>
                                <li>Encourage anyone to commit any unlawful or criminal act or condone any unlawful or criminal act</li>
                                <li>Give the impression that the Contribution emanates from Polvote (or any of its group companies) if this is not the case, or impersonate any person, or misrepresent your identity or affiliation with any person</li>
                            </ul>
                            <p>Whenever you upload material to Polvote, or to make contact with other users of Polvote, you must comply with our Acceptable Use Standards. You warrant that any such contribution does comply with those standards, and you indemnify us for any breach of that warranty.</p>
                            <p>We also have the right to disclose your identity to any third party who is claiming that any material posted or uploaded by you to our site is defamatory of them, a violation of their intellectual property rights, or of their right to privacy. <br />
                                We will not be responsible, or liable to any third party, for the content or accuracy of any materials posted by you or any other user of our site.
                            </p>
                        </div>
                        <div id="Copyright">
                            <h3>Copyright</h3>
                            <p>By submitting a Contribution to Polvote, you agree to grant Polvote a non-exclusive perpetual licence to use that Contribution and to waive your moral rights. Although you will still own the copyright in your Contribution, Polvote will have the right to freely use, edit, alter, reproduce, publish and/or distribute the material contained in your Contribution in any format and media. This licence will be free of charge, perpetual and capable of sub-licence. Polvote may exercise all copyright and publicity rights in the material contained in your Contribution in all jurisdictions, to their full extent and for the full period for which any such rights exist in that material. We reserve the right to display advertisements in connection with your Contribution. <br />
                                Please also note that, in accordance with the Content Standards, you must ensure that your Contribution does not infringe any copyright, database right or trade mark of any other person. By submitting your Contribution to Polvote, you are warranting that you have the right to grant Polvote the non-exclusive copyright licence described above. <br />
                                If you are not in a position to grant such a licence to Polvote, please do not submit the Contribution to Polvote.</p>
                        </div>
                        <div id="DataProtection">
                            <h3>Data protection</h3>
                            <p>If you are required to submit personal data directly to Polvote during the registration process, we will only use such data for administration and monitoring purposes and will not share your data with third parties unless legally required to do so. <br />
                                Complaints <br />
                                If you wish to complain about any Contribution posted to Polvote, please contact us at customerrelations@Polvote.com. When you submit a complaint, please </p>
                            <ol>
                                <li>outline the reason for your complaint, and</li>
                                <li>specify where the Contribution you are complaining about is located.</li>
                            </ol>
                            <p>We may request further information from you about your complaint before we process it. We will then review the Contribution and decide whether it complies with our Acceptable Use Standards. We will deal with any Contribution which, in our opinion, violates our Content Standards as described above (see section "Monitoring"). We will inform you of the outcome of our review within a reasonable time of receiving your complaint.</p>
                        </div>
                        <div id="Changestotheserules">
                            <h3>Changes to these rules</h3>
                            <p>IWe may revise these Rules at any time. You are expected to check this page from time to time to take notice of any changes we make, as they are legally binding on you and will apply to you from the date the change was made. You agree to accept and comply with any changes to the rules if you use Polvote after the change is made.</p>
                        </div>
                        <div id="Governinglawandjurisdiction">
                            <h3>Governing law and jurisdiction</h3>
                            <p>These Rules are governed by and shall be construed in accordance with Nigerian law and you irrevocably submit to the exclusive jurisdiction of the courts of the Federal Republic of Nigeria to settle any dispute or claim that arises out of or in connection with these Rules, their subject matter or formation. If any part of these Rules is deemed unlawful, void, or for any reason unenforceable then that part will be deemed severable and will not affect the validity and enforceability of the remaining parts.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-4 order-lg-2 order-md-2 order-sm-2 order-1">
                        <div className="navigation">
                            <a href="#termsandcondition" className={currentSection === "termsandcondition" && "active"} onClick={() => setCurrentSection("termsandcondition")}>{currentSection === "termsandcondition" && <i className="fa-solid fa-circle" />}Terms and Condition</a>
                            <a href="#ModerationofPolvote" className={currentSection === "ModerationofPolvote" && "active"} onClick={() => setCurrentSection("ModerationofPolvote")}>{currentSection === "ModerationofPolvote" && <i className="fa-solid fa-circle" />}Moderation of Polvote</a>
                            <a href="#Importantpoints" className={currentSection === "Importantpoints" && "active"} onClick={() => setCurrentSection("Importantpoints")}>{currentSection === "Importantpoints" && <i className="fa-solid fa-circle" />}Important points</a>
                            <a href="#Acceptableusestandards" className={currentSection === "Acceptableusestandards" && "active"} onClick={() => setCurrentSection("Acceptableusestandards")}>{currentSection === "Acceptableusestandards" && <i className="fa-solid fa-circle" />}Acceptable use standards</a>
                            <a href="#Copyright" className={currentSection === "Copyright" && "active"} onClick={() => setCurrentSection("Copyright")}>{currentSection === "Copyright" && <i className="fa-solid fa-circle" />}Copyright</a>
                            <a href="#DataProtection" className={currentSection === "DataProtection" && "active"} onClick={() => setCurrentSection("DataProtection")}>{currentSection === "DataProtection" && <i className="fa-solid fa-circle" />}Data Protection</a>
                            <a href="#Changestotheserules" className={currentSection === "Changestotheserules" && "active"} onClick={() => setCurrentSection("Changestotheserules")}>{currentSection === "Changestotheserules" && <i className="fa-solid fa-circle" />}Changes to these rules</a>
                            <a href="#Governinglawandjurisdiction" className={currentSection === "Governinglawandjurisdiction" && "active"} onClick={() => setCurrentSection("Governinglawandjurisdiction")}>{currentSection === "Governinglawandjurisdiction" && <i className="fa-solid fa-circle" />}Governing law and jurisdiction</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions