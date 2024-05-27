import React from "react";

export default function Footer() {
  return (
      <footer className="footer-section bg-white">
          <div className="container">
              <div className="row">
                  <div className="col-md-6">
                      <h3>About SmartHead</h3>
                      <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
                          consectetur ut hic ipsum et veritatis corrupti. Itaque eius soluta
                          optio dolorum temporibus in, atque, quos fugit sunt sit quaerat
                          dicta.
                      </p>
                  </div>

                  <div className="col-md-5">
                      <h3>Subscribe</h3>
                      <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
                          incidunt iure iusto architecto? Numquam, natus?
                      </p>
                      <form action="#" className="footer-subscribe">
                          <div className="d-flex mb-5">
                              <input
                                  type="text"
                                  className="form-control rounded-0"
                                  placeholder="Email"
                              />
                              <input
                                  type="submit"
                                  className="btn btn-primary rounded-0"
                                  value="Subscribe"
                              />
                          </div>
                      </form>
                  </div>
              </div>

              <div className="row pt-5 mt-5 text-center">
                  <div className="col-md-12">
                      <div className="border-top pt-5">
                          <p>
                              Copyright &copy;
                              {new Date().getFullYear()} All
                              rights reserved | This template is made with{" "}
                              <i className="icon-heart" aria-hidden="true"></i> by{" "}
                              <a href="https://colorlib.com" target="_blank" rel="noreferrer">
                                  Colorlib
                              </a>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </footer>
  );
}
