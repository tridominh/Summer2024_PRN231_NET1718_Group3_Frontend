import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterStudentService, RegisterTutorService, RequestOtpService, VerifyOtpService } from "../services/ApiServices/AuthorizeServices";
import { GetAllSubjects } from "../services/ApiServices/SubjectService";

export function Register({ token, setOTPSend, setSignIn, setSignUpCompleted, setSignUpCompletedMessage }) {
    //const navigate = useNavigate();
    const [signUpType, setSignUpType] = useState(null);
    const [showFirst, setShowFirst] = useState(null);
    const [showSecond, setShowSecond] = useState(null);
    const [showThird, setShowThird] = useState(null);
    const [showFourth, setShowFourth] = useState(null);
    //const [showFourth, setShowFourth] = useState(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [correctOtp, setCorrectOtp] = useState("");


    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    const [credentialImage, setCredentialImage] = useState(null);
    const [credentialFileName, setCredentialFileName] = useState("");

    const [credentialName, setCredentialName] = useState("");
    const [credentialType, setCredentialType] = useState("");

    const [error, setError] = useState("");

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fetchSubjects = async () => {
        const subjectsData = await GetAllSubjects();
        setSubjects(subjectsData);
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        let data = null;
        if (emailRegex.test(email) == false) {
            setError("Invalid email");
            return;
        }
        try {
            data = await RequestOtpService({ email });
            setShowSecond(true);
            setShowFirst(null);
            setOTPSend(true); 
            setError("");
        } catch (err) {
            if (err.response.data.message) {
                setError(err.response.data.message);
            }
            else if (err.response.data[0].description) {
                setError(err.response.data[0].description);
            }
            else if (err.response.data) {
                setError(err.response.data);
            }
            else {
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        let data = null;
        try {
            data = await VerifyOtpService({ email, otp });
            setShowThird(true);
            setShowSecond(null);
            setError("");
        }
        catch (err) {
            if (err.response.data.message) {
                setError(err.response.data.message);
            }
            else if (err.response.data[0].description) {
                setError(err.response.data[0].description);
            }
            else if (err.response.data) {
                setError(err.response.data);
            }
            else {
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    const validateUserInfo = () => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /^\d{10}$/;
    
        if (!name || !email || !address || !phoneNumber || !gender) {
            setErrorMessage("Please fill in all required fields.");
            return false;
        }
    
        if (!nameRegex.test(name)) {
            setErrorMessage("Receiver Name must contain only letters and cannot contain special characters or numbers.");
            return false;
        }
    
        if (address.length > 100) {
            setErrorMessage("Address cannot exceed 100 characters.");
            return false;
        }
    
        if (!phoneRegex.test(phoneNumber)) {
            setErrorMessage("Invalid Phone Number.");
            return false;
        }
    
        return true;
    };
    
    const validateCredential = (credential) => {
        const nameRegex = /^[0-9a-zA-Z\sÀ-ỹ!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\`~]+$/;
        const typeRegex = /^[0-9a-zA-Z\sÀ-ỹ!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\`~]+$/;

        if (!credential.name || !credential.type || !selectedSubject || !credential.image) {
            setErrorMessage("Name, Type, Image and Subject are required.");
            return false;
        }

        if (credential.name.length > 100 || !nameRegex.test(credential.name)) {
            setErrorMessage("Name must be uppercase, without numbers and special characters, and less than 100 characters.");
            return false;
        }

        if (credential.type.length > 100 || !typeRegex.test(credential.type)) {
            setErrorMessage("Type must be uppercase, without numbers and special characters, and less than 100 characters.");
            return false;
        }

        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        let data = null;
        if (!validateUserInfo()) {
            return;
        }
        if (password != repeatPassword) {
            setError("Password does not match");
            return;
        }
        try{
            if(signUpType == "tutor"){
                setShowFourth(true);
                setShowThird(null);
            }
            else if(signUpType == "student"){
                data = await RegisterStudentService({name, email, gender, address, phoneNumber, phoneNumber, address, password, otp});
                setSignIn(true);
                setSignUpCompleted(true);
                setSignUpCompletedMessage("Account created successfully. Please sign in!");
            }
            setError("");
            setErrorMessage("");
        }
        catch (err) {

            if (err.response.data.message) {
                setError(err.response.data.message);
            }
            else if (err.response.data[0].description) {
                setError(err.response.data[0].description);
            }
            else if (err.response.data) {
                setError(err.response.data);
            }
            else {
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    const handleAddCredential = async (e) => {
        e.preventDefault();
        let data = null;
        if (!validateCredential({name: credentialName, type: credentialType,image: credentialImage})) {
            return;
        }
        try{
            data = await RegisterTutorService({
                name, email, gender, address, phoneNumber, phoneNumber, address, password, otp,
                credentialName, credentialType, credentialImage,
                subjectId: selectedSubject
            });
            setSignIn(true);
            setSignUpCompleted(true);
            setSignUpCompletedMessage(data);
            setError("");
        }
        catch(err){
            if (err.response.data.message) {
                setError(err.response.data.message);
            }
            else if(err.response.data[0].description){
                setError(err.response.data[0].description);
            }
            else if(err.response.data){
                setError(err.response.data);
            }
            else {
                setError('An error occurred. Please try again later.');
            }
            return;
        }
    }

    useEffect(() => {
        fetchSubjects();
    }, [])

    return (
        <div className="row align-items-center">

            {!token  && <div className="col-lg-5 ml-auto" data-aos="fade-up" data-aos-delay="500">
              <form action="" method="post" className="form-box">
                <h3 className="h4 text-black mb-4">Sign Up</h3>
                {showFirst==null && showSecond==null && showThird==null && showFourth==null &&
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
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email Addresss"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        
                            <div className="form-group">
                                <p className="text-xl text-danger">{error}</p>
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                    onClick={() => { setSignUpType(null); setShowFirst(null) }}>
                                    Back
                                </Button>
                                <input type="submit" onClick={(e) => { handleSendOtp(e) }}
                                    className="btn btn-primary btn-pill" value="Continue" />
                            </div>
                            </>
                        )}

                    {showSecond != null && (
                        <>
                            <div className="form-group">
                                <p className="text-black">Enter OTP sent to your email</p>
                                <input type="text" className="form-control" placeholder="Enter OTP"
                                    value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <p className="text-xl text-danger">{error}</p>
                            </div>
                            <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                onClick={() => { setOtp(null); setShowSecond(null); setShowFirst(true); }}>
                                Back
                            </Button>
                            <input type="button" onClick={(e) => {
                                handleVerifyOtp(e)
                            }}
                                className="btn btn-primary btn-pill" value="Submit" />
                        </>
                    )}

                    {showThird != null &&
                        (<>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Name"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Address"
                                    value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Phone Number"
                                    value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Repeat Password"
                                    value={repeatPassword} onChange={(e) => {
                                        setRepeatPassword(e.target.value)
                                        if (e.currentTarget.value != password)
                                            setError("Password does not match");
                                        else {
                                            setError("");
                                        }
                                    }} />
                            </div>
                            <div className="form-group">
                                <p className="text-xl text-danger">{error}</p>
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                    onClick={() => { setShowThird(null); setShowSecond(true) }}>
                                    Back
                                </Button>
                                <input type="submit" onClick={(e) => {
                                    handleSignUp(e)
                                }}
                                    className="btn btn-primary btn-pill" value="Sign up" />
                            </div></>)}
                            <div className="text-red-500">{errorMessage}</div>

                {showFourth && (<>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                            labelId="subject-label"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={credentialName}
                        onChange={(e) =>
                            setCredentialName(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        margin="dense"
                        label="Type"
                        fullWidth
                        value={credentialType}
                        onChange={(e) =>
                            setCredentialType(
                                e.target.value
                            )
                        }
                    />
                    <div style={{ marginTop: 16 }}>
                        <Button variant="contained" component="label">
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    setCredentialImage(e.target.files[0]);
                                    setCredentialFileName(e.target.files[0].name);
                                }}
                            />
                        </Button>
                        <span style={{ marginLeft: 8 }}>{credentialFileName}</span>
                    </div>
                    <div className="form-group">
                        <p className="text-xl text-danger">{error}</p>
                    </div>
                    <div className="form-group">
                        <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                            onClick={() => { setShowFourth(null); setShowThird(true)}}>
                            Back
                        </Button>
                        <input type="submit" onClick={(e) => {
                            handleAddCredential(e)}} 
                        className="btn btn-primary btn-pill" value="Sign up"/>
                    </div>
                </>)}

                <div className="form-group">
                  <p className="text-black">Already have an account? <Link to="#" onClick={(e) =>{e.stopPropagation(); setSignIn(true)}}>Sign In</Link>
                </p>
                </div>

              </form>

            </div>}
        </div>
    );
}
