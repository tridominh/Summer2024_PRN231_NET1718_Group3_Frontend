import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import Heading from "./component/Heading";
import ResponsiveAppBar from "./component/Heading2";

export function Layout({ token, setToken, removeToken }) {
  return (
    <>
      {/* <Heading token={token} setToken={setToken} removeToken={removeToken} /> */}
      <ResponsiveAppBar />
      <Outlet />
      <Footer />
    </>
  );
}
