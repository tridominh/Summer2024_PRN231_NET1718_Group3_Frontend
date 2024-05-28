import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import parseJwt from "../services/parseJwt";

export default function Heading({ token, setToken, removeToken }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const parsedToken = token ? parseJwt(token) : null;
  const name = parsedToken ? parsedToken.given_name : null;
  const role = parsedToken ? parsedToken.role : null;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    removeToken();
  };

  const getProfileLink = () => {
    switch(role) {
      case 'Tutor':
        return 'ProfileTutor';
      case 'Student':
      case 'Admin':
      case 'Moderator':
      default:
        return 'Profile';
    }
  };

  return (
    <>
      <div className="site-mobile-menu site-navbar-target">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle"></span>
          </div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>

      <header
        className="site-navbar bg-stone-900 py-4 js-sticky-header site-navbar-target"
        role="banner"
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="site-logo mr-auto w-25">
              <a href="index.html">SmartHead</a>
            </div>

            <div className="mx-auto text-center">
              <nav
                className="site-navigation position-relative text-right"
                role="navigation"
              >
                <ul className="site-menu main-menu js-clone-nav mx-auto d-none d-lg-block  m-0 p-0">
                  <li>
                    <a href="/" className="nav-link">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/" className="nav-link">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="/" className="nav-link">
                      Programs
                    </a>
                  </li>
                  <li>
                    <a href="/" className="nav-link">
                      Teachers
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="ml-auto w-25">
              <nav
                className="site-navigation position-relative text-right"
                role="navigation"
              >
                <ul className="site-menu main-menu site-menu-dark js-clone-nav mr-auto d-none d-lg-block m-0 p-0">
                  <li className="cta">
                    <a href="/" class="nav-link">
                      <span>Contact Us</span>
                    </a>
                  </li>
                  <li className="cta">
                    <Button
                        className={`nav-link ${name ? "" : "d-none"}`}
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        {name && "Welcome " + name}
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem onClick={handleClose}> <Link to={getProfileLink()}>Profile</Link></MenuItem>
                        <MenuItem onClick={(e) => { handleClose(); logout(); }}>Logout</MenuItem>
                      </Menu>
                    </li>
                </ul>
              </nav>
              <a
                href="#"
                className="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black float-right"
              >
                <span className="icon-menu h3"></span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
