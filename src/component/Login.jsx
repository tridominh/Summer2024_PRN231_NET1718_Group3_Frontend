import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import { useState } from "react";
import { LoginService } from "../services/ApiServices/AuthorizeServices";

export function Login({ token, setSignIn, setToken }) {
  //const [tutorSignIn, setTutorSignIn] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    let data = null;
    try {
      data = await LoginService({ email, password });
      //console.log(data);
      setToken(data);
    } catch (err) {
      if (err.response.data.message) {
        // If the error response contains a message, set it as the error message
        setError(err.response.data.message);
      } else if (err.response.data[0].description) {
        setError(err.response.data[0].description);
      } else if (err.response.data) {
        setError(err.response.data);
      } else {
        // If the error is something else, set a generic error message
        setError("An error occurred. Please try again later.");
      }
      return;
    }
  };

  return (
    <div className="row align-items-center">
      {!token && (
        <div className="col-lg-5 ml-auto">
          <form className="form-box">
            <h3 className="h4 text-black mb-4">Sign In</h3>
            {/*tutorSignIn==null &&
                    <div className="form-group">
                        <Button className="py-4 w-full block mb-3" variant="outlined" endIcon={<ArrowForward />}
                            onClick={() => setTutorSignIn("tutor")}>
                          Tutor
                        </Button>
                        <Button className="py-4 w-full block" variant="outlined" endIcon={<ArrowForward />}
                            onClick={() => setTutorSignIn("student")}>
                          Student
                        </Button>
                    </div>
                */}
            {/*tutorSignIn &&*/}{" "}
            {
              <>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email Addresss"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <p className="text-xl text-danger">{error}</p>
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    onClick={(e) => handleLogin(e)}
                    className="btn btn-primary btn-pill"
                    value="Sign in"
                  />
                </div>
              </>
            }
            <div className="form-group">
              <p className="text-black">
                Don't have an account?{" "}
                <Link to="#" onClick={() => setSignIn(false)}>
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
