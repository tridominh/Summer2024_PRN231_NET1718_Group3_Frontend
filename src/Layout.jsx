import { Button, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { Outlet } from "react-router-dom";

export function Layout() {
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


      <header className="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">

        <div className="container-fluid" style={{ paddingRight: "0px" }}>
          <div className="d-flex align-items-center">
            <div className="site-logo mr-auto w-25"><a href="index.html">SmartHead</a></div>

            <div className="mx-auto text-center">
              <nav className="site-navigation position-relative text-right" role="navigation">
                <ul className="site-menu main-menu js-clone-nav mx-auto d-none d-lg-block  m-0 p-0">
                  <li><a href="#home-section" className="nav-link">Home</a></li>
                  <li><a href="#courses-section" className="nav-link">Courses</a></li>
                  <li><a href="#programs-section" className="nav-link">Features</a></li>
                  <li><a href="#teachers-section" className="nav-link">Cost</a></li>
                </ul>
              </nav>
            </div>

            <div className="ml-auto w-25">
              <nav className="site-navigation position-relative text-right" role="navigation">
                <ul className="site-menu main-menu site-menu-dark js-clone-nav mr-auto d-none d-lg-block m-0 p-0">
                  <li className="cta"><a href="#contact-section" class="nav-link"><span>Contact Us</span></a></li>
                  <li className="cta"><Menu>
                    <MenuHandler>
                      <Button>Tư cách:</Button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem>Học viên</MenuItem>
                      <MenuItem>Gia sư</MenuItem>
                    </MenuList>
                  </Menu></li>
                </ul>
              </nav>
              <a href="#" className="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black float-right"><span class="icon-menu h3"></span></a>
            </div>
          </div>
        </div>

      </header>
      <Outlet />
    </>
  );
}
