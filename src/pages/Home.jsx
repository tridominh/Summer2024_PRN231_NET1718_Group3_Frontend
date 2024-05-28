import { useEffect, useState } from "react";
import { Login } from "../component/Login";
import { Register } from "../component/Register";
import { ContactSupportSharp } from "@mui/icons-material";
import ContactUs from "../component/ContactUs";

export function Home({ token, setToken }) {
  const [signIn, setSignIn] = useState(false);

  return (
    <>
      <div className="login-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              {signIn ? (
                <Login
                  token={token}
                  setSignIn={setSignIn}
                  setToken={setToken}
                />
              ) : (
                <Register token={token} setSignIn={setSignIn} />
              )}
            </div>
          </div>
        </div>
      </div>

      <ContactUs />
    </>
  );
}
