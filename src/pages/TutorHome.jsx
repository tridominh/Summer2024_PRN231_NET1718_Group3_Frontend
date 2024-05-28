import { useEffect, useState } from "react";
import { Login } from "../component/Login";
import { Register } from "../component/Register";

export function TutorHome({ token, setToken }) {
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
                        <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                            <h2 className="section-title">Finding Student's request</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-section courses-entry-wrap" data-aos="fade-up" data-aos-delay="100">
                <div className="container">
                    <div className="row">
                        <div className="owl-carousel col-12 nonloop-block-14">
                            <div className="course bg-white h-100 align-self-stretch">
                                <figure className="m-0">
                                    <a href="course-single.html"><img src="images/img_2.jpg" alt="Image" className="img-fluid" /></a>
                                </figure>
                                <div className="course-inner-text py-4 px-4">
                                    <span className="course-price">$99</span>
                                    <div className="meta"><span className="icon-clock-o"></span>4 Lessons / 12 week</div>
                                    <h3><a href="#">Logo Design Course</a></h3>
                                </div>
                                <div className="d-flex border-top stats">
                                    <div className="py-3 px-4"><span className="icon-users"></span> 2,193 students</div>
                                    <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> 2</div>
                                </div>
                            </div>

                            <div className="course bg-white h-100 align-self-stretch">
                                <figure className="m-0">
                                    <a href="course-single.html"><img src="images/img_3.jpg" alt="Image" className="img-fluid" /></a>
                                </figure>
                                <div className="course-inner-text py-4 px-4">
                                    <span className="course-price">$99</span>
                                    <div className="meta"><span className="icon-clock-o"></span>4 Lessons / 12 week</div>
                                    <h3><a href="#">JS Programming Language</a></h3>
                                </div>
                                <div className="d-flex border-top stats">
                                    <div className="py-3 px-4"><span className="icon-users"></span> 2,193 students</div>
                                    <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> 2</div>
                                </div>
                            </div>

                            <div className="course bg-white h-100 align-self-stretch">
                                <figure className="m-0">
                                    <a href="course-single.html"><img src="images/img_4.jpg" alt="Image" className="img-fluid" /></a>
                                </figure>
                                <div className="course-inner-text py-4 px-4">
                                    <span className="course-price">$20</span>
                                    <div className="meta"><span className="icon-clock-o"></span>4 Lessons / 12 week</div>
                                    <h3><a href="#">Study Law of Physics</a></h3>
                                </div>
                                <div className="d-flex border-top stats">
                                    <div className="py-3 px-4"><span className="icon-users"></span> 2,193 students</div>
                                    <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> 2</div>
                                </div>
                            </div>

                            <div className="course bg-white h-100 align-self-stretch">
                                <figure className="m-0">
                                    <a href="course-single.html"><img src="images/img_5.jpg" alt="Image" className="img-fluid" /></a>
                                </figure>
                                <div className="course-inner-text py-4 px-4">
                                    <span className="course-price">$99</span>
                                    <div className="meta"><span className="icon-clock-o"></span>4 Lessons / 12 week</div>
                                    <h3><a href="#">Logo Design Course</a></h3>
                                </div>
                                <div className="d-flex border-top stats">
                                    <div className="py-3 px-4"><span className="icon-users"></span> 2,193 students</div>
                                    <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> 2</div>
                                </div>
                            </div>

                            <div className="course bg-white h-100 align-self-stretch">
                                <figure className="m-0">
                                    <a href="course-single.html"><img src="images/img_6.jpg" alt="Image" className="img-fluid" /></a>
                                </figure>
                                <div className="course-inner-text py-4 px-4">
                                    <span className="course-price">$99</span>
                                    <div className="meta"><span className="icon-clock-o"></span>4 Lessons / 12 week</div>
                                    <h3><a href="#">JS Programming Language</a></h3>
                                </div>
                                <div className="d-flex border-top stats">
                                    <div className="py-3 px-4"><span className="icon-users"></span> 2,193 students</div>
                                    <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> 2</div>
                                </div>
                            </div>
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
                        <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                            <h2 className="section-title">Features</h2>
                        </div>
                    </div>
                    <div className="row mb-5 align-items-center">
                        <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
                            <img src="images/undraw_youtube_tutorial.svg" alt="Image" className="img-fluid" />
                        </div>
                        <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                            <h2 className="text-black mb-4 font-weight-bold">Đăng yêu cầu linh hoạt</h2>
                            <p className="mb-4">Bạn có thể mở các yêu cầu rất nhanh chóng, dễ dàng, với các tùy chỉnh linh hoạt giúp bạn tìm Gia sư phù hợp với tiêu chí của mình.</p>
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

            <div className="site-section bg-image overlay" id="contact-section" style={{ backgroundImage: "url('images/hero_1.jpg')" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                            <h2 className="section-title">Finding Tutor</h2>
                            <p className="mb-5">Chúng tôi sẽ giới thiệu những gia sư tốt nhất phù hợp với yêu cầu của bạn</p>
                            <p><a href="#" className="btn btn-primary py-3 px-5 btn-pill">Finding Tutor</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
