import { Button } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RegisterStudentService,
  RegisterTutorService,
} from "../services/ApiServices/AuthorizeServices";

export function Register({ token, setSignIn }) {
  //const navigate = useNavigate();
  const [tutorSignUp, setTutorSignUp] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    let data = null;
    if (password != repeatPassword) {
      setError("Password does not match");
      return;
    }
    try {
      if (tutorSignUp == "tutor") {
        data = await RegisterTutorService({ name, email, password });
      } else if (tutorSignUp == "student") {
        data = await RegisterStudentService({ name, email, password });
      }
      setSignIn(true);
      setError("");
      //console.log(data);
      //setToken(data)
    } catch (err) {
      //console.log(err)
      //console.log(err.response.data)
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
      {/* <div className="col-lg-6 mb-4"> */}
      {/*   <h1  data-aos="fade-up" data-aos-delay="100">SmartHead - Ứng dụng kết nối gia sư</h1> */}
      {/*   <p className="mb-4"  data-aos="fade-up" data-aos-delay="200">Không những giúp con chủ động tìm kiếm gia sư phù hợp với bản thân mà còn được cá nhân hóa lộ trình học tập dựa trên từng điểm mạnh của con.</p> */}
      {/*   <p data-aos="fade-up" data-aos-delay="300"><a href="#" className="btn btn-primary py-3 px-5 btn-pill">Admission Now</a></p> */}
      {/**/}
      {/* </div> */}

      {!token && (
        <div
          className="col-lg-5 ml-auto"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <form action="" method="post" className="form-box">
            <h3 className="h4 text-black mb-4">Sign Up</h3>
            {tutorSignUp == null && (
              <div className="form-group">
                <Button
                  className="py-4 w-full block mb-3"
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => setTutorSignUp("tutor")}
                >
                  Tutor
                </Button>
                <Button
                  className="py-4 w-full block"
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => setTutorSignUp("student")}
                >
                  Student
                </Button>
              </div>
            )}
            {tutorSignUp && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => {
                      setRepeatPassword(e.target.value);
                      if (e.currentTarget.value != password)
                        setError("Password does not match");
                      else {
                        setError("");
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <p className="text-xl text-danger">{error}</p>
                </div>
                <div className="form-group">
                  <Button
                    className="btn btn-pill mr-3"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setTutorSignUp(null)}
                  >
                    Back
                  </Button>
                  <input
                    type="submit"
                    onClick={(e) => handleSignUp(e)}
                    className="btn btn-primary btn-pill"
                    value="Sign up"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <p className="text-black">
                Already have an account?{" "}
                <Link to="#" onClick={() => setSignIn(true)}>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
