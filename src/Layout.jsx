import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import Heading from "./component/Heading";
import ResponsiveAppBar from "./component/Heading2";
import parseJwt from "./services/parseJwt";

export function Layout({ token, setToken, removeToken }) {
  const role = parseJwt(token).role;
  return (
    <>
      {/* <Heading token={token} setToken={setToken} removeToken={removeToken} /> */}
      <ResponsiveAppBar userRole={role}/>
      <Outlet />
      <Footer />
    </>
  );
}
