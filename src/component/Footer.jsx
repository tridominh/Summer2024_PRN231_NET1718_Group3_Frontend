import React from "react";

export default function Footer() {
  return (
    <footer className="footer-section bg-white border-t-3 mt-3">
      <div className="container">
        <div className="row border-top my-5 py-5">
          <div className="col-md-6">
            <h3>About SmartHead</h3>
            <p>
              SmartHead is a platform where people can come and find appropriate
              tutors based on their needs
            </p>
          </div>

          <div className="col-md-5">
            <h3>Subscribe</h3>
            <p className="mb-3">
              Subscribe so that you can receive newest updates from our platform
            </p>
            <form action="#" className="footer-subscribe">
              <div className="mb-5">
                <input
                  type="text"
                  className="block my-3 form-control rounded-0"
                  placeholder="Email"
                />
                <input
                  type="submit"
                  className="block my-3 btn btn-primary rounded-0"
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
                {new Date().getFullYear()} All rights reserved | This web is
                developed by SmartHead
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
