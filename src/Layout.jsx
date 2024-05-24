import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import Heading from "./component/Heading";

export function Layout({ token, setToken, removeToken }) {
  return (
    <>
      <Heading token={token} setToken={setToken} removeToken={removeToken}/>
        <Outlet />
      <Footer />
    </>
  );
}
