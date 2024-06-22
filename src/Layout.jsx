import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import Heading from "./component/Heading";
import parseJwt from "./services/parseJwt";

export function Layout({ token, setToken, removeToken }) {
  const role = token ? parseJwt(token).role : "";
  return (
    <>
      <Heading
        token={token}
        setToken={setToken}
        removeToken={removeToken}
        userRole={role}
      />
      <Outlet />
      <Footer />
    </>
  );
}
