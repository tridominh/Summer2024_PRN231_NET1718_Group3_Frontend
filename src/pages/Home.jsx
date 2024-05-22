export function Home(){
    return (
        <>
            <div className="intro-section" id="home-section">
                  <div className="slide-1" style={{backgroundImage: "url('images/hero_1.jpg')"}} data-stellar-background-ratio="0.5">
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col-12">
                          <div className="row align-items-center">
                            <div className="col-lg-6 mb-4">
                              <h1  data-aos="fade-up" data-aos-delay="100">SmartHead - Ứng dụng kết nối gia sư</h1>
                              <p className="mb-4"  data-aos="fade-up" data-aos-delay="200">Không những giúp con chủ động tìm kiếm gia sư phù hợp với bản thân mà còn được cá nhân hóa lộ trình học tập dựa trên từng điểm mạnh của con.</p>
                              <p data-aos="fade-up" data-aos-delay="300"><a href="#" className="btn btn-primary py-3 px-5 btn-pill">Admission Now</a></p>

                            </div>

                            <div className="col-lg-5 ml-auto" data-aos="fade-up" data-aos-delay="500">
                              <form action="" method="post" className="form-box">
                                <h3 className="h4 text-black mb-4">Sign Up</h3>
                                <div className="form-group">
                                  <input type="text" className="form-control" placeholder="Email Addresss"/>
                                </div>
                                <div className="form-group">
                                  <input type="password" className="form-control" placeholder="Password"/>
                                </div>
                                <div className="form-group mb-4">
                                  <input type="password" className="form-control" placeholder="Re-type Password"/>
                                </div>
                                <div className="form-group">
                                  <input type="submit" className="btn btn-primary btn-pill" value="Sign up"/>
                                </div>
                              </form>

                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="site-section courses-title" id="courses-section">
                  <div className="container">
                    <div className="row mb-5 justify-content-center">
                      <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                        <h2 className="section-title">Courses</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="site-section courses-entry-wrap"  data-aos="fade-up" data-aos-delay="100">
                  <div className="container">
                    <div className="row">

                      <div className="owl-carousel col-12 nonloop-block-14">
                        <div className="course bg-white h-100 align-self-stretch">
                          <figure className="m-0">
                            <a href="course-single.html"><img src="images/img_2.jpg" alt="Image" className="img-fluid"/></a>
                          </figure>
                          <div className="course-inner-text py-4 px-4">
                            <span className="course-price">$99</span>
                            <div className="meta"><span class="icon-clock-o"></span>4 Lessons / 12 week</div>
                            <h3><a href="#">Logo Design Course</a></h3>
                          </div>
                          <div className="d-flex border-top stats">
                            <div className="py-3 px-4"><span class="icon-users"></span> 2,193 students</div>
                            <div className="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div>
                          </div>
                        </div>

                        <div className="course bg-white h-100 align-self-stretch">
                          <figure className="m-0">
                            <a href="course-single.html"><img src="images/img_3.jpg" alt="Image" className="img-fluid"/></a>
                          </figure>
                          <div className="course-inner-text py-4 px-4">
                            <span className="course-price">$99</span>
                            <div className="meta"><span class="icon-clock-o"></span>4 Lessons / 12 week</div>
                            <h3><a href="#">JS Programming Language</a></h3>
                          </div>
                          <div className="d-flex border-top stats">
                            <div className="py-3 px-4"><span class="icon-users"></span> 2,193 students</div>
                            <div className="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div>
                          </div>
                        </div>



                        <div className="course bg-white h-100 align-self-stretch">
                          <figure className="m-0">
                            <a href="course-single.html"><img src="images/img_4.jpg" alt="Image" className="img-fluid"/></a>
                          </figure>
                          <div className="course-inner-text py-4 px-4">
                            <span className="course-price">$20</span>
                            <div className="meta"><span class="icon-clock-o"></span>4 Lessons / 12 week</div>
                            <h3><a href="#">Study Law of Physics</a></h3>
                          </div>
                          <div className="d-flex border-top stats">
                            <div className="py-3 px-4"><span class="icon-users"></span> 2,193 students</div>
                            <div className="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div>
                          </div>
                        </div>

                        <div className="course bg-white h-100 align-self-stretch">
                          <figure className="m-0">
                            <a href="course-single.html"><img src="images/img_5.jpg" alt="Image" className="img-fluid"/></a>
                          </figure>
                          <div className="course-inner-text py-4 px-4">
                            <span className="course-price">$99</span>
                            <div className="meta"><span class="icon-clock-o"></span>4 Lessons / 12 week</div>
                            <h3><a href="#">Logo Design Course</a></h3>
                          </div>
                          <div className="d-flex border-top stats">
                            <div className="py-3 px-4"><span class="icon-users"></span> 2,193 students</div>
                            <div className="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div>
                          </div>
                        </div>

                        <div className="course bg-white h-100 align-self-stretch">
                          <figure className="m-0">
                            <a href="course-single.html"><img src="images/img_6.jpg" alt="Image" className="img-fluid"/></a>
                          </figure>
                          <div className="course-inner-text py-4 px-4">
                            <span className="course-price">$99</span>
                            <div className="meta"><span class="icon-clock-o"></span>4 Lessons / 12 week</div>
                            <h3><a href="#">JS Programming Language</a></h3>
                          </div>
                          <div className="d-flex border-top stats">
                            <div className="py-3 px-4"><span class="icon-users"></span> 2,193 students</div>
                            <div className="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div>
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
                      <div className="col-lg-7 text-center"  data-aos="fade-up" data-aos-delay="">
                        <h2 className="section-title">Features</h2>
                      </div>
                    </div>
                    <div className="row mb-5 align-items-center">
                      <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
                        <img src="images/undraw_youtube_tutorial.svg" alt="Image" className="img-fluid"/>
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
                        <img src="images/moneytransfer.jpg" alt="Image" className="img-fluid"/>
                      </div>
                      <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-black mb-4 font-weight-bold">Thanh toán an toàn</h2>
                        <p className="mb-4">Bạn có thể thanh toán tiền cho buổi học online thông qua cổng thanh toán một cách an toàn và tiện lợi.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="site-section bg-light" id="contact-section">
                  <div className="container">

                    <div className="row justify-content-center">
                      <div className="col-md-7">


                        
                        <h2 className="section-title mb-3">Message Us</h2>
                        <p className="mb-5 font-weight-bold">Nếu có vấn đề cần thắc mắc, đừng ngần ngại chia sẻ cho chúng tôi.</p>
                    
                        <form method="post" data-aos="fade">
                          <div className="form-group row">
                            <div className="col-md-6 mb-3 mb-lg-0">
                              <input type="text" className="form-control" placeholder="First name"/>
                            </div>
                            <div className="col-md-6">
                              <input type="text" className="form-control" placeholder="Last name"/>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-md-12">
                              <input type="text" className="form-control" placeholder="Subject"/>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-md-12">
                              <input type="email" className="form-control" placeholder="Email"/>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col-md-12">
                              <textarea className="form-control" id="" cols="30" rows="10" placeholder="Write your message here."></textarea>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-md-6">
                              
                              <input type="submit" className="btn btn-primary py-3 px-5 btn-block btn-pill" value="Send Message"/>
                            </div>
                          </div>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                
                 
                <footer className="footer-section bg-white">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-4">
                        <h3>About SmartHead</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro consectetur ut hic ipsum et veritatis corrupti. Itaque eius soluta optio dolorum temporibus in, atque, quos fugit sunt sit quaerat dicta.</p>
                      </div>

                      <div className="col-md-3 ml-auto">
                        <h3>Links</h3>
                        <ul className="list-unstyled footer-links">
                          <li><a href="#">Home</a></li>
                          <li><a href="#">Courses</a></li>
                          <li><a href="#">Programs</a></li>
                          <li><a href="#">Teachers</a></li>
                        </ul>
                      </div>

                      <div className="col-md-4">
                        <h3>Subscribe</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt incidunt iure iusto architecto? Numquam, natus?</p>
                        <form action="#" className="footer-subscribe">
                          <div className="d-flex mb-5">
                            <input type="text" className="form-control rounded-0" placeholder="Email"/>
                            <input type="submit" className="btn btn-primary rounded-0" value="Subscribe"/>
                          </div>
                        </form>
                      </div>

                    </div>

                    <div className="row pt-5 mt-5 text-center">
                      <div className="col-md-12">
                        <div className="border-top pt-5">
                        <p>
                    Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank" >Colorlib</a>
                  </p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </footer>
        </>
    )
}
