import { useState } from "react";
import { Login } from "../component/Login";
import { Register } from "../component/Register";
import ContactUs from "../component/ContactUs";
import {
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { Button } from "bootstrap";
import StudentBookingRequest from "./student/StudentBookingRequest";

export function Home({ token, setToken }) {
  const [signIn, setSignIn] = useState(false);
  const [OTPSend, setOTPSend] = useState(false);
  const [signUpCompleted, setSignUpCompleted] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOTPSend(false);
    setSignUpCompleted(false);
  };

  return (
    <>
      <br></br>
      <div
        className="login-section"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#5c6bc0",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              {signIn ? (
                <Login
                  token={token}
                  setSignIn={setSignIn}
                  setToken={setToken}
                />
              ) : (
                <Register
                  token={token}
                  setSignIn={setSignIn}
                  setSignUpCompleted={setSignUpCompleted}
                  setOTPSend={setOTPSend}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="site-section" id="finding-tutor-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div
              className="col-lg-7 text-center"
              data-aos="fade-up"
              data-aos-delay=""
            >
              <StudentBookingRequest />
            </div>
          </div>
        </div>
      </div>

      <div className="site-section" id="programs-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-lg-7 text-center" data-aos="fade-up">
              <h2 className="section-title">Our Programs</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
                repellat aut neque! Doloribus sunt non aut reiciendis, vel
                recusandae obcaecati hic dicta repudiandae in quas quibusdam
                ullam, illum sed veniam!
              </p>
            </div>
          </div>
          <div className="row mb-5 align-items-center">
            <div
              className="col-lg-7 mb-5"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="images/undraw_youtube_tutorial.svg"
                alt="Image"
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-4 ml-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h2 className="text-black mb-4">We Are Excellent In Education</h2>
              <p className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                maxime nam porro possimus fugiat quo molestiae illo.
              </p>
              <div className="d-flex align-items-center custom-icon-wrap mb-3">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>
              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-university"></span>
                </span>
                <div>
                  <h3 className="m-0">150 Universities Worldwide</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-5 align-items-center">
            <div
              className="col-lg-7 mb-5 order-1 order-lg-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="images/undraw_teaching.svg"
                alt="Image"
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-4 mr-auto order-2 order-lg-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h2 className="text-black mb-4">Strive for Excellent</h2>
              <p className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                maxime nam porro possimus fugiat quo molestiae illo.
              </p>
              <div className="d-flex align-items-center custom-icon-wrap mb-3">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>
              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-university"></span>
                </span>
                <div>
                  <h3 className="m-0">150 Universities Worldwide</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-5 align-items-center">
            <div
              className="col-lg-7 mb-5"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="images/undraw_teacher.svg"
                alt="Image"
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-4 ml-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h2 className="text-black mb-4">Education is life</h2>
              <p className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                maxime nam porro possimus fugiat quo molestiae illo.
              </p>
              <div className="d-flex align-items-center custom-icon-wrap mb-3">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>
              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span className="icon icon-university"></span>
                </span>
                <div>
                  <h3 className="m-0">150 Universities Worldwide</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section" id="teachers-section">
        <div className="container">
          <div className="row mb-5 align-items-center">
            <div
              className="col-lg-7 mb-5"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src="images/moneytransfer.jpg"
                alt="Image"
                className="img-fluid"
              />
            </div>
            <div
              className="col-lg-4 ml-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h2 className="text-black mb-4 font-weight-bold">
                Easy Online Transaction
              </h2>
              <p className="mb-4">
                Fast and easy transaction, system will automatically record and
                notify as soon as tutor has recieved the learning fee.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section pb-0">
        <div className="future-blobs">
          <div className="blob_2">
            <img src="images/blob_2.svg" alt="Image" />
          </div>
          <div className="blob_1">
            <img src="images/blob_1.svg" alt="Image" />
          </div>
        </div>
      </div>

      <div className="site-section" id="contact-section">
        <ContactUs />
      </div>
      <Snackbar
        open={signUpCompleted}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          {signUpCompleted && "Account created successfully. Please sign in!"}
        </Alert>
      </Snackbar>
      <Snackbar
        open={OTPSend}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          {OTPSend && "OTP send. Please check your mail!"}
        </Alert>
      </Snackbar>
    </>
  );
}
