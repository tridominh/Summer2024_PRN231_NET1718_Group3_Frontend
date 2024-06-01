import { Button } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterStudentService, RegisterTutorService, RequestOtpService, VerifyOtpService } from "../services/ApiServices/AuthorizeServices";

export function Register({ token, setSignIn, setSignUpCompleted }) {
    //const navigate = useNavigate();
    const [signUpType, setSignUpType] = useState(null);
    const [showFirst, setShowFirst] = useState(null);
    const [showSecond, setShowSecond] = useState(null);
    const [showThird, setShowThird] = useState(null);
    //const [showFourth, setShowFourth] = useState(null);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [correctOtp, setCorrectOtp] = useState("");

    const [error, setError] = useState("");

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        let data = null;
        if(emailRegex.test(email) == false){
            setError("Invalid email");
            return;
        }
        try{
            data = await RequestOtpService({email});
            setShowSecond(true);
            setShowFirst(null);
            //setCorrectOtp(data.otp);
            setError("");
        }
        catch(err){
            if (err.response.data.message) {
                // If the error response contains a message, set it as the error message
                setError(err.response.data.message);
            }
            else if(err.response.data[0].description){
                setError(err.response.data[0].description);
            }
            else if(err.response.data){
                setError(err.response.data);
            }
            else {
                // If the error is something else, set a generic error message
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        let data = null;
        try{
            data = await VerifyOtpService({email, otp});
            //console.log(data);
            setShowThird(true);
            setShowSecond(null);
            setError("");
        }
        catch(err){
            if (err.response.data.message) {
                // If the error response contains a message, set it as the error message
                setError(err.response.data.message);
            }
            else if(err.response.data[0].description){
                setError(err.response.data[0].description);
            }
            else if(err.response.data){
                setError(err.response.data);
            }
            else {
                // If the error is something else, set a generic error message
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        let data = null;
        if(password != repeatPassword){
            setError("Password does not match");
            return;
        }
        try{
            if(signUpType == "tutor"){
                data = await RegisterTutorService({name, email, gender, address, phoneNumber, phoneNumber, address, password, otp});
            }
            else if(signUpType == "student"){
                data = await RegisterStudentService({name, email, gender, address, phoneNumber, phoneNumber, address, password, otp});
            }
            setSignIn(true);
            setSignUpCompleted(true);
            setError("");
            //console.log(data);
            //setToken(data)
        }
        catch(err){
            //console.log(err)
            //console.log(err.response.data)
            if (err.response.data.message) {
                // If the error response contains a message, set it as the error message
                setError(err.response.data.message);
            }
            else if(err.response.data[0].description){
                setError(err.response.data[0].description);
            }
            else if(err.response.data){
                setError(err.response.data);
            }
            else {
                // If the error is something else, set a generic error message
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    return (
        <div className="row align-items-center">
            {/* <div className="col-lg-6 mb-4">
              <h1  data-aos="fade-up" data-aos-delay="100">SmartHead - Ứng dụng kết nối gia sư</h1>
              <p className="mb-4"  data-aos="fade-up" data-aos-delay="200">Không những giúp con chủ động tìm kiếm gia sư phù hợp với bản thân mà còn được cá nhân hóa lộ trình học tập dựa trên từng điểm mạnh của con.</p>
              <p data-aos="fade-up" data-aos-delay="300"><a href="#" className="btn btn-primary py-3 px-5 btn-pill">Admission Now</a></p>

            </div> */}

            {!token  && <div className="col-lg-5 ml-auto" data-aos="fade-up" data-aos-delay="500">
              <form action="" method="post" className="form-box">
                <h3 className="h4 text-black mb-4">Sign Up</h3>
                {showFirst==null && showSecond==null && showThird==null &&
                    <div className="form-group">
                        <Button className="py-4 w-full block mb-3" variant="outlined" endIcon={<ArrowForward />}
                            onClick={() => { setSignUpType("tutor"); setShowFirst(true)}}>
                          Tutor
                        </Button>
                        <Button className="py-4 w-full block" variant="outlined" endIcon={<ArrowForward />}
                            onClick={() => {setSignUpType("student"); setShowFirst(true)}}>
                          Student
                        </Button>
                    </div>
                }
                {showFirst!=null && 
                (<>
                {/*<div className="form-group">
                  <input type="text" className="form-control" placeholder="Name" 
                    value={name} onChange={(e) => setName(e.target.value)}/>
                </div>*/}
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Email Addresss" 
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                {/*<div className="form-group">
                  <input type="password" className="form-control" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="Repeat Password"
                    value={repeatPassword} onChange={(e) => { 
                        setRepeatPassword(e.target.value)
                        if(e.currentTarget.value != password) 
                            setError("Password does not match");
                        else{
                            setError("");
                        }
                    }}/>
                </div>*/}
                <div className="form-group">
                    <p className="text-xl text-danger">{error}</p>
                </div>
                <div className="form-group">
                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                        onClick={() => { setSignUpType(null); setShowFirst(null)}}>
                        Back
                    </Button>
                    <input type="submit" onClick={(e) => {
                        handleSendOtp(e)}} 
                    className="btn btn-primary btn-pill" value="Continue"/>
                </div></>)}

                {showSecond!=null && (
                  <>
                    <div className="form-group">
                        <p className="text-black">Enter OTP sent to your email</p>
                        <input type="text" className="form-control" placeholder="Enter OTP"
                            value={otp} onChange={(e) => setOtp(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <p className="text-xl text-danger">{error}</p>
                    </div>
                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                        onClick={() => { setOtp(null); setShowSecond(null); setShowFirst(true); }}>
                        Back
                    </Button>
                    <input type="button" onClick={(e) => {
                        handleVerifyOtp(e)}} 
                    className="btn btn-primary btn-pill" value="Submit"/>
                  </>
                )}

                {showThird !=null && 
                (<>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Name" 
                    value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Address" 
                    value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Gender" 
                    value={gender} onChange={(e) => setGender(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Phone Number" 
                    value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="Repeat Password"
                    value={repeatPassword} onChange={(e) => { 
                        setRepeatPassword(e.target.value)
                        if(e.currentTarget.value != password) 
                            setError("Password does not match");
                        else{
                            setError("");
                        }
                    }}/>
                </div>
                <div className="form-group">
                    <p className="text-xl text-danger">{error}</p>
                </div>
                <div className="form-group">
                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                        onClick={() => { setShowThird(null); setShowSecond(true)}}>
                        Back
                    </Button>
                    <input type="submit" onClick={(e) => {
                        handleSignUp(e)}} 
                    className="btn btn-primary btn-pill" value="Sign up"/>
                </div></>)}

                <div className="form-group">
                  <p className="text-black">Already have an account? <Link to="#" onClick={(e) =>{e.stopPropagation(); setSignIn(true)}}>Sign In</Link>
                </p>
                </div>

              </form>

            </div>}
          </div>
    );
}
