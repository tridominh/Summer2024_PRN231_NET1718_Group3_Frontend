import { useState } from "react";
import { Login } from "../component/Login";
import { Register } from "../component/Register";
import ContactUs from "../component/ContactUs";

export function Home({ token, setToken }) {
  const [signIn, setSignIn] = useState(false);

  return (
    <>
      <div className="intro-section" id="home-section">
        <div
          className="slide-1"
          style={{ backgroundImage: "url('images/hero_1.jpg')" }}
          data-stellar-background-ratio="0.5"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12">
                {signIn ? (
                  <Login token={token} setSignIn={setSignIn} setToken={setToken} />
                ) : (
                  <Register token={token} setSignIn={setSignIn} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section courses-title" id="courses-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-lg-7 text-center" data-aos="fade-up">
              <h2 className="section-title">Courses</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section courses-entry-wrap" data-aos="fade-up" data-aos-delay="100">
        <div className="container">
          <div className="row">
            <div className="owl-carousel col-12 nonloop-block-14">
              {[
                { img: "img_1.jpg", price: "$20", title: "Study Law of Physics" },
                { img: "img_2.jpg", price: "$99", title: "Logo Design Course" },
                { img: "img_3.jpg", price: "$99", title: "JS Programming Language" },
                { img: "img_4.jpg", price: "$20", title: "Study Law of Physics" },
                { img: "img_5.jpg", price: "$99", title: "Logo Design Course" },
                { img: "img_6.jpg", price: "$99", title: "JS Programming Language" },
              ].map((course, index) => (
                <div key={index} className="course bg-white h-100 align-self-stretch">
                  <figure className="m-0">
                    <a href="#home-section">
                      <img src={`images/${course.img}`} alt="Image" className="img-fluid" />
                    </a>
                  </figure>
                  <div className="course-inner-text py-4 px-4">
                    <span className="course-price">{course.price}</span>
                    <div className="meta">
                      <span className="icon-clock-o"></span>4 Lessons / 12 week
                    </div>
                    <h3>
                      <a href="#">{course.title}</a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet ipsa nulla adipisicing elit.</p>
                  </div>
                  <div className="d-flex border-top stats">
                    <div className="py-3 px-4">
                      <span className="icon-users"></span> 2,193 students
                    </div>
                    <div className="py-3 px-4 w-25 ml-auto border-left">
                      <span className="icon-chat"></span> 2
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-7 text-center">
              <button className="customPrevBtn btn btn-primary m-1">Prev</button>
              <button className="customNextBtn btn btn-primary m-1">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section" id="programs-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-lg-7 text-center" data-aos="fade-up">
              <h2 className="section-title">Our Programs</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam repellat aut neque! Doloribus sunt non aut reiciendis, vel recusandae obcaecati hic dicta repudiandae in quas quibusdam ullam, illum sed veniam!</p>
            </div>
          </div>
          <div className="row mb-5 align-items-center">
            <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
              <img src="images/undraw_youtube_tutorial.svg" alt="Image" className="img-fluid" />
            </div>
            <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-black mb-4">We Are Excellent In Education</h2>
              <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</p>
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
            <div className="col-lg-7 mb-5 order-1 order-lg-2" data-aos="fade-up" data-aos-delay="100">
              <img src="images/undraw_teaching.svg" alt="Image" className="img-fluid" />
            </div>
            <div className="col-lg-4 mr-auto order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-black mb-4">Strive for Excellent</h2>
              <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</p>
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
            <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
              <img src="images/undraw_teacher.svg" alt="Image" className="img-fluid" />
            </div>
            <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-black mb-4">Education is life</h2>
              <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</p>
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
                        <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
                            <img src="images/moneytransfer.jpg" alt="Image" className="img-fluid" />
                        </div>
                        <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                            <h2 className="text-black mb-4 font-weight-bold">Chuyển khoản trực tuyến dễ dàng</h2>
                            <p className="mb-4">Chuyển khoản nhanh chóng và thuận tiện, hệ thống sẽ tự động ghi nhận và thông báo ngay đến bạn khi gia sư đã nhận được tiền học phí.</p>
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
    </>
  );
}
