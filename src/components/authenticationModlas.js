import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataContext";
import { setUserSession } from "../utils/common";
import axios from "axios";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
Modal.setAppElement("#root");

function AuthModals({
  loginModal,
  setLoginModal,
  signupModal,
  setSignupModal,
  verificationModal,
  setVerificationModal,
}) {
  // context
  const { context, setContext } = useContext(DataContext);

  // history
  const navigate = useNavigate();

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    axios
      .post(`${API.API_ROOT}/users/signin`, {
        email: loginEmail.toLowerCase(),
        password: loginPassword,
      })
      .then((response) => {
        // console.log(response)
        setLoading(false);
        if (response.status === 422) {
          setError("kindly Check your mail to verify this account");
          setLoginPassword("");
        } else {
          setUserSession(response.data.token);
          setContext({ ...context, user: response.data });
          setLoginModal(false);
        }
      })
      .catch((error) => {
        // console.log(error.response);
        // console.log(error.response.status);
        setLoading(false);
        if (error.response.status === 401) {
          setError("Invalid email or password");
          setLoginPassword("");
        }
        if (error.response.status === 422) {
          localStorage.setItem(
            "polvoteActivationId",
            error.response.data.userid
          );
          setLoginModal(false);
          setVerificationModal(true);
        }
        if (error.response.status !== 401 && error.response.status !== 422) {
          setError("Something went wrong, please try again later");
          setLoginPassword("");
        }
        if (error.response.status === 403) {
          setError("Your account has been blocked, please call +2348184468097");
        }
      });
  };

  // google signup
  const responseSuccessGoogle = (response) => {
    // console.log(response)
    // console.log(response.tokenId)
    setLoading(true);
    axios({
      method: "post",
      url: `${API.API_ROOT}/users/googleLogin`,
      data: { tokenId: response.tokenId },
    }).then((response) => {
      // console.log(response)
      if (response.status === 200) {
        setLoading(false);
        setUserSession(response.data.token);
        setContext({
          ...context,
          user: { token: response.data.token, ...response.data.user },
        });
        setLoginModal(false);
        setSignupModal(false);
      } else {
        setLoading(false);
        setError("Something went wrong... pls try again shrotly");
      }
    });
  };

  const responseErrorGoogle = () => {};

  // facebook login
  const responseFacebook = (response) => {
    // console.log(response)
    setLoading(true);
    if (response) {
      axios({
        method: "post",
        url: `${API.API_ROOT}/users/facebookLogin`,
        data: { accessToken: response.accessToken, userID: response.userID },
      }).then((response) => {
        console.log(response);
        if (response.status === 200) {
          setLoading(false);
          setUserSession(response.data.token);
          setContext({
            ...context,
            user: { token: response.data.token, ...response.data.user },
          });
          window.location.reload();
        } else {
          setError("SOmething went wrong, pls try again later");
        }
      });
    }
  };

  // signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("@");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      email === "" ||
      number === undefined ||
      password === ""
    ) {
      setError("Please fill all Input Spaces");
      setLoading(false);
    } else if (username.charAt(0) !== "@") {
      setError("Username must start with '@'");
      setLoading(false);
    } else {
      axios
        .post(
          `${API.API_ROOT}/users/register`,
          {
            firstname: firstName,
            lastname: lastName,
            username: username,
            phonenumber: number,
            email: email.toLowerCase(),
            password: password,
          },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => {
          // console.log(response);
          localStorage.setItem("polvoteActivationId", response.data.userid);
          setLoading(false);
          setSignupModal(false);
          setVerificationModal(true);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 422) {
            setError("This User is already registered");
          }
        });
    }
  };

  // resend otp
  const [resendOptLoader, setResendotpLoader] = useState(false);
  const resendOtp = (e) => {
    setResendotpLoader(true);
    axios
      .post(
        `${API.API_ROOT}/users/resend/${localStorage.getItem(
          "polvoteActivationId"
        )}`,
        {
          headers: { "content-type": "application/json" },
        }
      )
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        // console.error(error);
      });
  };

  // activate user
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const activateUser = (e) => {
    // console.log(otp.join(""));
    setOtpLoading(true);
    setOtpError("");
    // axios
    //   .get(
    //     `${API.API_ROOT}/users/activate/${localStorage.getItem(
    //       "polvoteActivationId"
    //     )}`,
    //     {
    //       code: otp.join(""),
    //     },
    //     { headers: { "content-type": "application/json" } }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // axios({
    // url: `${API.API_ROOT}/users/activate/${localStorage.getItem(
    //   "polvoteActivationId"
    // )}`,
    //   method: "get",
    //   headers: { "content-type": "application/json" },
    //   data: { code: otp.join("") },
    // }).then(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    // axios
    //   .get(
    //     `${API.API_ROOT}/users/activate/${localStorage.getItem(
    //       "polvoteActivationId"
    //     )}`,
    //     {
    //       code: "313662", // otp.join(""),
    //     },
    //     { headers: { "content-type": "application/json" } }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // axios
    //   .get(
    // `${API.API_ROOT}/users/activate/${localStorage.getItem(
    //   "polvoteActivationId"
    // )}`,
    //     { headers: { "content-type": "application/json" } },
    //     { code: "313662" }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    axios({
      method: "post",
      url: `${API.API_ROOT}/users/activate/${localStorage.getItem(
        "polvoteActivationId"
      )}`,
      data: {
        code: otp.join(""),
      },
    }).then(
      (response) => {
        setOtp(false);
        // console.log(response);
        setUserSession(response.data.token);
        setContext({ ...context, user: response.data });
        setVerificationModal(false);
      },
      (error) => {
        setOtpError(
          "Invalid OTP, kindly reconfirm the OTP from your phone number or email address or press 'Resend OTP' below"
        );
        setOtpLoading(false);
        console.log(error);
      }
    );
  };

  // otp
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // handle change for otp
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // focus on next input box
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <>
      {/* login modal  */}
      <Modal
        isOpen={loginModal}
        onRequestClose={() => setLoginModal(false)}
        id="loginModal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setLoginModal(false)}
        />
        <form onSubmit={(e) => handleLogin(e)}>
          <h1>Login to Vote on Polvote</h1>
          <h4>
            Votes made on Polvote are only limited to Polvote and does not count
            for the National Election!
          </h4>
          <div id="google-btn">
            <GoogleLogin
              clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
              // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseErrorGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
          {/* <div id="google-btn">
                                        <FacebookLogin
                                            appId="1162929354518536"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            // onClick={componentClicked}
                                            callback={responseFacebook}
                                            icon="fa-facebook"
                                            textButton="Login with Facebook "
                                        />
                                    </div> */}
          <div className="or d-flex justify-content-between align-items-center">
            <span></span>
            <h6>or</h6>
            <span></span>
          </div>
          <label htmlFor="login-email">Email Address</label>
          <input
            type="text"
            id="login-email"
            placeholder="Email Address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            placeholder="***************"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" id="remember-label">
                Remember me
              </label>
            </div>
            <h5 onClick={() => navigate("/login")}>Forgot Password?</h5>
          </div>
          <p className="error-msg">{error}</p>
          <button id="proceed" onClick={(e) => handleLogin(e)}>
            {loading ? (
              <>
                Loading... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Login"
            )}
          </button>
          <h6>
            Don’t have an account?{" "}
            <span
              onClick={() => {
                setLoginModal(false);
                setSignupModal(true);
              }}
            >
              Signup
            </span>
          </h6>
        </form>
      </Modal>

      {/* signup modal  */}
      <Modal
        isOpen={signupModal}
        onRequestClose={() => setSignupModal(false)}
        id="signupModal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setSignupModal(false)}
        />
        <form className="signup" onSubmit={(e) => handleSignUp(e)}>
          <h1>Signup on Polvote</h1>
          <h4>
            Votes made on Polvote are only limited to Polvote and does not count
            for the National Election!
          </h4>
          <div className="row justify-content-center mb-4">
            <div className="col-lg-7 col-12">
              <div id="google-btn">
                <GoogleLogin
                  clientId="819346895976-gcbt1b49ig3svd6rosf4mu4a42misfcg.apps.googleusercontent.com"
                  // clientId="854389897420-1big4hbsc4b05kop2femba3df4msdjh2.apps.googleusercontent.com"
                  buttonText="Signup with Google"
                  onSuccess={responseSuccessGoogle}
                  onFailure={responseErrorGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
            </div>
            {/* <div className="col-lg-6">
                                            <div id="google-btn">
                                                <FacebookLogin
                                                    appId="1162929354518536"
                                                    autoLoad={false}
                                                    fields="name,email,picture"
                                                    // onClick={componentClicked}
                                                    callback={responseFacebook}
                                                    icon="fa-facebook"
                                                    textButton="Login with Facebook "
                                                />
                                            </div>
                                        </div> */}
          </div>
          <div className="or d-flex justify-content-between align-items-center">
            <span></span>
            <h6>or</h6>
            <span></span>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="fname">First Name</label>
              <input
                id="fname"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="lname">Last Name</label>
              <input
                id="lname"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="Username">Username</label>
              <input
                id="Username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="Email">Email</label>
              <input
                id="Email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="number">Phone Number</label>
              <div className="phoneInputCover">
                <PhoneInput
                  placeholder="+2348012345678"
                  value={number}
                  onChange={setNumber}
                />
              </div>
              {/* <input
                id="number"
                type="tel"
                placeholder="+234  |   700234567891"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              /> */}
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <label htmlFor="pass">Create Password</label>
              <input
                id="pass"
                type="password"
                placeholder="***************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <p className="error-msg">{error}</p>
          <button id="create" className="mb-3" onClick={handleSignUp}>
            {loading ? (
              <>
                Loading... <i className="fa-solid fa-spinner fa-spin" />
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <h6>
            Already have an account?{" "}
            <span
              onClick={() => {
                setSignupModal(false);
                setLoginModal(true);
              }}
            >
              Login
            </span>
          </h6>
        </form>
      </Modal>

      {/* verification modal  */}
      <Modal
        isOpen={verificationModal}
        onRequestClose={() => setVerificationModal(false)}
        id="verification"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setVerificationModal(false)}
        />
        {/* <img src="img/verify.png" alt="email" />
                <h1>One More Step!</h1>
                <p>A Verification link has been sent to <span>{email}</span>. Please click on the link to verify
                    your account. <span id="spam-text">Also check your SPAM folder in case it didn't drop in your Inbox</span>
                </p> */}
        <h1 className="mt-2">Enter (OTP) One Time Password</h1>
        <p>
          An OTP has been sent to your phone number <span>{number}</span> and
          email address <span>{email}</span>
        </p>
        <div className="otp-input d-flex justify-content-between">
          {otp.map((data, index) => {
            return (
              <input
                type="text"
                placeholder={index + 1}
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            );
          })}
        </div>
        <h6 className="error mb-3">{otpError}</h6>
        <button onClick={activateUser}>
          {otpLoading ? (
            <>
              Loading... <i className="fa-solid fa-spinner fa-spin" />
            </>
          ) : (
            "Proceed"
          )}
        </button>
        <p id="resend">
          Didn’t receive any OTP?{" "}
          <span onClick={resendOtp}>
            {resendOptLoader ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              "Resend OTP"
            )}
          </span>
        </p>
      </Modal>
    </>
  );
}

export default AuthModals;
