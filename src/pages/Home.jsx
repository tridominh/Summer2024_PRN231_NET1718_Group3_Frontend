import { useEffect, useState } from "react";
import { Login } from "../component/Login";
import { Register } from "../component/Register";
import { ContactSupportSharp } from "@mui/icons-material";
import ContactUs from "../component/ContactUs";

export function Home({ token, setToken }) {
  const [signIn, setSignIn] = useState(false);


  return (
    <>
      <div className="intro-section" id="home-section">
        <div className="slide-1" style={{ backgroundImage: "url('images/hero_1.jpg')" }} data-stellar-background-ratio="0.5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12">
                {signIn ? <Login token={token} setSignIn={setSignIn} setToken={setToken} /> : <Register token={token} setSignIn={setSignIn} />}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="site-section courses-title" id="courses-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div
              className="col-lg-7 text-center"
              data-aos="fade-up"
              data-aos-delay=""
            >
              <h2 className="section-title">Courses</h2>
            </div>
          </div>
        </div>
      </div>
      <div
        className="site-section courses-entry-wrap"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="container">
          <div className="row">
            <div className="owl-carousel col-12 nonloop-block-14">
              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_1.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$20</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">Study Law of Physics</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>

              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_2.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$99</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">Logo Design Course</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>

              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_3.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$99</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">JS Programming Language</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>

              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_4.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$20</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">Study Law of Physics</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>

              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_5.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$99</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">Logo Design Course</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>

              <div className="course bg-white h-100 align-self-stretch">
                <figure className="m-0">
                  <a href="course-single.html">
                    <img
                      src="images/img_6.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <div className="course-inner-text py-4 px-4">
                  <span className="course-price">$99</span>
                  <div className="meta">
                    <span class="icon-clock-o"></span>4 Lessons / 12 week
                  </div>
                  <h3>
                    <a href="#">JS Programming Language</a>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.{" "}
                  </p>
                </div>
                <div className="d-flex border-top stats">
                  <div className="py-3 px-4">
                    <span class="icon-users"></span> 2,193 students
                  </div>
                  <div className="py-3 px-4 w-25 ml-auto border-left">
                    <span class="icon-chat"></span> 2
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-7 text-center">
              <button className="customPrevBtn btn btn-primary m-1">
                Prev
              </button>
              <button className="customNextBtn btn btn-primary m-1">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section" id="programs-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div
              className="col-lg-7 text-center"
              data-aos="fade-up"
              data-aos-delay=""
            >
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
                  <span class="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>

              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span class="icon icon-university"></span>
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
                  <span class="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>

              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span class="icon icon-university"></span>
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
                  <span class="icon icon-graduation-cap"></span>
                </span>
                <div>
                  <h3 className="m-0">22,931 Yearly Graduates</h3>
                </div>
              </div>

              <div className="d-flex align-items-center custom-icon-wrap">
                <span className="custom-icon-inner mr-3">
                  <span class="icon icon-university"></span>
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
          <div className="row mb-5 justify-content-center">
            <div
              className="col-lg-7 mb-5 text-center"
              data-aos="fade-up"
              data-aos-delay=""
            >
              <h2 className="section-title">Our Teachers</h2>
              <p className="mb-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
                repellat aut neque! Doloribus sunt non aut reiciendis, vel
                recusandae obcaecati hic dicta repudiandae in quas quibusdam
                ullam, illum sed veniam!
              </p>
            </div>
          </div>

          <div className="row">
            <div
              className="col-md-6 col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="teacher text-center">
                <img
                  src="images/person_1.jpg"
                  alt="Image"
                  className="img-fluid w-50 rounded-circle mx-auto mb-4"
                />
                <div className="py-2">
                  <h3 className="text-black">Benjamin Stone</h3>
                  <p className="position">Physics Teacher</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Porro eius suscipit delectus enim iusto tempora, adipisci at
                    provident.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="teacher text-center">
                <img
                  src="images/person_2.jpg"
                  alt="Image"
                  className="img-fluid w-50 rounded-circle mx-auto mb-4"
                />
                <div className="py-2">
                  <h3 className="text-black">Katleen Stone</h3>
                  <p className="position">Physics Teacher</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Porro eius suscipit delectus enim iusto tempora, adipisci at
                    provident.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="teacher text-center">
                <img
                  src="images/person_3.jpg"
                  alt="Image"
                  className="img-fluid w-50 rounded-circle mx-auto mb-4"
                />
                <div className="py-2">
                  <h3 className="text-black">Sadie White</h3>
                  <p className="position">Physics Teacher</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Porro eius suscipit delectus enim iusto tempora, adipisci at
                    provident.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="site-section bg-image overlay"
        style={{ backgroundImage: "url('images/hero_1.jpg')" }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8 text-center testimony">
              <img
                src="images/person_4.jpg"
                alt="Image"
                className="img-fluid w-25 mb-4 rounded-circle"
              />
              <h3 className="mb-4">Jerome Jensen</h3>
              <blockquote>
                <p>
                  &ldquo; Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Rerum rem soluta sit eius necessitatibus voluptate
                  excepturi beatae ad eveniet sapiente impedit quae modi quo
                  provident odit molestias! Rem reprehenderit assumenda &rdquo;
                </p>
              </blockquote>
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
        <div className="container">
          <div
            className="row mb-5 justify-content-center"
            data-aos="fade-up"
            data-aos-delay=""
          >
            <div className="col-lg-7 text-center">
              <h2 className="section-title">Why Choose Us</h2>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-4 ml-auto align-self-start"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="p-4 rounded bg-white why-choose-us-box">
                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light mb-3">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-graduation-cap"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">22,931 Yearly Graduates</h3>
                  </div>
                </div>

                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light mb-3">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-university"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">150 Universities Worldwide</h3>
                  </div>
                </div>

                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light mb-3">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-graduation-cap"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">Top Professionals in The World</h3>
                  </div>
                </div>

                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light mb-3">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-university"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">Expand Your Knowledge</h3>
                  </div>
                </div>

                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light mb-3">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-graduation-cap"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">
                      Best Online Teaching Assistant Courses
                    </h3>
                  </div>
                </div>

                <div className="d-flex align-items-center custom-icon-wrap custom-icon-light">
                  <div className="mr-3">
                    <span class="custom-icon-inner">
                      <span class="icon icon-university"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="m-0">Best Teachers</h3>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-7 align-self-end"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <img
                src="images/person_transparent.png"
                alt="Image"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>

      <ContactUs />
      </>
  );
}
