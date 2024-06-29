import {
    Button, FormControl, InputLabel, MenuItem, Select, TextField, LinearProgress, Stepper, Step, StepLabel
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    RegisterStudentService, RegisterTutorService, RequestOtpService, VerifyOtpService
} from "../services/ApiServices/AuthorizeServices";
import { GetAllSubjects } from "../services/ApiServices/SubjectService";

export function Register({ token, setOTPSend, setSignIn, setSignUpCompleted, setSignUpCompletedMessage }) {
    const [signUpType, setSignUpType] = useState(null);
    const [showFirst, setShowFirst] = useState(null);
    const [showSecond, setShowSecond] = useState(null);
    const [showThird, setShowThird] = useState(null);
    const [showFourth, setShowFourth] = useState(null);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [credentialImage, setCredentialImage] = useState(null);
    const [credentialFileName, setCredentialFileName] = useState("");
    const [credentialName, setCredentialName] = useState("");
    const [credentialType, setCredentialType] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const steps = ["Enter Email", "Enter OTP", "Enter Personal Info", "Enter Credential Info"];

    const fetchSubjects = async () => {
        const subjectsData = await GetAllSubjects();
        setSubjects(subjectsData);
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }
        try {
            await RequestOtpService({ email });
            setShowSecond(true);
            setShowFirst(null);
            setOTPSend(true); 
            setError("");
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await VerifyOtpService({ email, otp });
            setShowThird(true);
            setShowSecond(null);
            setError("");
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateUserInfo()) {
            return;
        }
        try {
            if (signUpType === "tutor") {
                setShowFourth(true);
                setShowThird(null);
            } else if (signUpType === "student") {
                await RegisterStudentService({
                    name, email, gender, address, phoneNumber, password, otp
                });
                setSignIn(true);
                setSignUpCompleted(true);
                setSignUpCompletedMessage("Account created successfully. Please sign in!");
            }
            setError("");
            setErrorMessage("");
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleAddCredential = async (e) => {
        e.preventDefault();
        if (!validateCredential({ name: credentialName, type: credentialType, image: credentialImage })) {
            return;
        }
        try {
            const data = await RegisterTutorService({
                name, email, gender, address, phoneNumber, password, otp,
                credentialName, credentialType, credentialImage,
                subjectId: selectedSubject
            });
            setSignIn(true);
            setSignUpCompleted(true);
            setSignUpCompletedMessage(data);
            setError("");
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleApiError = (err) => {
        if (err.response.data.message) {
            setError(err.response.data.message);
        } else if (err.response.data[0]?.description) {
            setError(err.response.data[0].description);
        } else if (err.response.data) {
            setError(err.response.data);
        } else {
            setError('An error occurred. Please try again later.');
        }
    };

    const validateUserInfo = () => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /^\d{10}$/;

        if (!name || !email || !address || !phoneNumber || !gender || !password || !repeatPassword) {
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

        if (password !== repeatPassword) {
            setErrorMessage("Passwords do not match.");
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

    useEffect(() => {
        fetchSubjects();
    }, []);

    const getCurrentStep = () => {
        if (showFirst) return 0;
        if (showSecond) return 1;
        if (showThird) return 2;
        if (showFourth) return 3;
        return -1;
    };

    return (
        <div className="row align-items-center">
            {!token && (
                <div className="col-lg-5 ml-auto" data-aos="fade-up" data-aos-delay="500">
                    <form action="" method="post" className="form-box">
                        <h3 className="h4 text-black mb-4">Sign Up</h3>
                        {(showFirst !== null || showSecond !== null || showThird !== null || showFourth !== null) && (
                            <Stepper activeStep={getCurrentStep()} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                        {showFirst == null && showSecond == null && showThird == null && showFourth == null && (
                            <div className="form-group">
                                <Button className="py-4 w-full block mb-3" variant="outlined" endIcon={<ArrowForward />}
                                    onClick={() => { setSignUpType("tutor"); setShowFirst(true) }}>
                                    Tutor
                                </Button>
                                <Button className="py-4 w-full block" variant="outlined" endIcon={<ArrowForward />}
                                    onClick={() => { setSignUpType("student"); setShowFirst(true) }}>
                                    Student
                                </Button>
                            </div>
                        )}
                        {showFirst != null && (
                            <>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email Address"
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
                                    <input type="text" className="form-control" placeholder="OTP"
                                        value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <p className="text-xl text-danger">{error}</p>
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                        onClick={() => { setShowFirst(true); setShowSecond(null) }}>
                                        Back
                                    </Button>
                                    <input type="submit" onClick={(e) => { handleVerifyOtp(e) }}
                                        className="btn btn-primary btn-pill" value="Continue" />
                                </div>
                            </>
                        )}
                        {showThird != null && (
                            <>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Name"
                                        value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <FormControl fullWidth>
                                        <InputLabel id="gender-select-label">Gender</InputLabel>
                                        <Select
                                            labelId="gender-select-label"
                                            id="gender-select"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <MenuItem value={"male"}>Male</MenuItem>
                                            <MenuItem value={"female"}>Female</MenuItem>
                                            <MenuItem value={"other"}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Phone Number"
                                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Address"
                                        value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password"
                                        value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Repeat Password"
                                        value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <p className="text-xl text-danger">{errorMessage}</p>
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                        onClick={() => { setShowSecond(true); setShowThird(null) }}>
                                        Back
                                    </Button>
                                    <input type="submit" onClick={(e) => { handleSignUp(e) }}
                                        className="btn btn-primary btn-pill" value="Continue" />
                                </div>
                            </>
                        )}
                        {showFourth != null && (
                            <>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Credential Name"
                                        value={credentialName} onChange={(e) => setCredentialName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Credential Type"
                                        value={credentialType} onChange={(e) => setCredentialType(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <FormControl fullWidth>
                                        <InputLabel id="subject-select-label">Subject</InputLabel>
                                        <Select
                                            labelId="subject-select-label"
                                            id="subject-select"
                                            value={selectedSubject}
                                            onChange={handleSubjectChange}
                                        >
                                            {subjects.map(subject => (
                                                <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="form-group">
                                    <input type="file" className="form-control" onChange={(e) => setCredentialImage(e.target.files[0])} />
                                </div>
                                <div className="form-group">
                                    <p className="text-xl text-danger">{errorMessage}</p>
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-pill mr-3" variant="outlined" startIcon={<ArrowBack />}
                                        onClick={() => { setShowThird(true); setShowFourth(null) }}>
                                        Back
                                    </Button>
                                    <input type="submit" onClick={(e) => { handleAddCredential(e) }}
                                        className="btn btn-primary btn-pill" value="Continue" />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                  <p className="text-black">Already have an account? <Link to="#" onClick={(e) =>{e.stopPropagation(); setSignIn(true)}}>Sign In</Link>
                </p>
                </div>
                    </form>
                </div>
            )}
        </div>
    );
}
