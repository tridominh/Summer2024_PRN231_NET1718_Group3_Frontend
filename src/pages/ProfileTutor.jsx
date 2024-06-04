import React, { useEffect, useState } from "react";
import {
    GetUserInfo,
    UpdateUserInfo,
    UploadAvatar,
} from "../services/ApiServices/UserService";
import {
    GetAllCredentials,
    AddCredential,
    UpdateCredential,
    UploadCredentialImage,
} from "../services/ApiServices/CredentialService";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Typography,
    Box,
    Avatar,
    Button,
    DialogActions,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert,
    FormControl,
} from "@mui/material";
import parseJwt from "../services/parseJwt";
import { TableVirtuoso } from "react-virtuoso";
import { GetAllSubjects } from "../services/ApiServices/SubjectService";

export function ProfileTutor({ token, setToken }) {
    const id = parseJwt(token).nameid || "";
    const [userInfo, setUserInfo] = useState({
        id: "",
        userName: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
        gender: "",
        hashPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [openCredential, setOpenCredential] = useState(false);
    const [selectedCredentialDetails, setSelectedCredentialDetails] = useState(null);

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState(userInfo.email);
    const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
    const [address, setAddress] = useState(userInfo.address);
    const [avatar, setAvatar] = useState(userInfo.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarFileName, setAvatarFileName] = useState("");
    const [gender, setGender] = useState(userInfo.gender);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState([]);

    const [credentials, setCredentials] = useState([]);
    const [selectedCredential, setSelectedCredential] = useState({
        id: "",
        tutorId: id,
        name: "",
        type: "",
        image: "",
        status: true,
    });
    const [credentialImageFile, setCredentialImageFile] = useState(null);
    const [credentialFileName, setCredentialFileName] = useState("");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [userInfoSnackbarOpen, setUserInfoSnackbarOpen] = useState(false);
    const [credentialSnackbarOpen, setCredentialSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
        setUserInfoSnackbarOpen(false);
        setCredentialSnackbarOpen(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleViewCredentialDetails = (credential) => {
        setSelectedCredentialDetails(credential);
    };

    const handleOpenCredential = (credential = null) => {
        if (credential) setSelectedCredential(credential);
        else
            setSelectedCredential({
                id: "",
                tutorId: id,
                name: "",
                type: "",
                image: "",
                status: true,
            });
        setOpenCredential(true);
    };
    const handleCloseCredential = () => setOpenCredential(false);

    const fetchUserInfo = async () => {
        try {
            const userInfo = await GetUserInfo(id);
            setUserInfo(userInfo);
            setUserName(userInfo.userName);
            setEmail(userInfo.email);
            setAddress(userInfo.address);
            setPhoneNumber(userInfo.phoneNumber);
            setAvatar(userInfo.avatar);
            setGender(userInfo.gender);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const fetchCredentials = async () => {
        try {
            const credentials = await GetAllCredentials();
            setCredentials(credentials);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const updateUserInfo = async () => {
        try {
            let updatedUser = {
                id: userInfo.id,
                receiverName: userName,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                avatar: userInfo.avatar,
                gender: gender,
                hashPassword: userInfo.hashPassword,
            };

            const handleUploadAvatar = async (userId) => {
                if (avatarFile) {
                    const formData = new FormData();
                    formData.append("file", avatarFile);
                    formData.append("userId", userId);
                    try {
                        const uploadResponse = await UploadAvatar(formData);
                        return uploadResponse;
                    } catch (error) {
                        console.error("Upload failed:", error);
                    }
                } else {
                    console.error("No avatar file selected.");
                }
            };

            const user = await UpdateUserInfo(updatedUser);
            const avatarResponse = await handleUploadAvatar(user.id);
            user.avatar = avatarResponse?.avatar;
            setUserInfo(user);
            setUserInfoSnackbarOpen(true);
            handleClose();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
            console.error(error);
        }
    };

    const handleSaveCredential = async () => {
        try {
            let updatedCredential = {
                id: selectedCredential.id,
                tutorId: selectedCredential.tutorId,
                name: selectedCredential.name,
                type: selectedCredential.type,
                image: selectedCredential.image,
                status: selectedCredential.status,
                subjectId: selectedSubject.id,
            };

            let addCredential = {
                tutorId: selectedCredential.tutorId,
                name: selectedCredential.name,
                type: selectedCredential.type,
                image: selectedCredential.image,
                status: "Pending",
                subjectId: selectedSubject.id,
            };

            if (credentialImageFile) {
                const formData = new FormData();
                formData.append("file", credentialImageFile);
                formData.append("credentialId", selectedCredential.id);
                try {
                    const uploadResponse = await UploadCredentialImage(formData);
                    updatedCredential.image = uploadResponse?.image;
                } catch (error) {
                    console.error("Image upload failed:", error);
                }
            }

            if (selectedCredential.id) {
                await UpdateCredential(updatedCredential);
                setCredentialSnackbarOpen(true);
            } else {
                const credentials = await AddCredential(addCredential);
                if (credentialImageFile) {
                    const formData = new FormData();
                    formData.append("file", credentialImageFile);
                    formData.append("credentialId", credentials.id);
                    try {
                        const uploadResponse = await UploadCredentialImage(formData);
                        addCredential.image = uploadResponse?.imageUrl;
                    } catch (error) {
                        console.error("Image upload failed:", error);
                    }
                }
                setSnackbarOpen(true);
            }

            fetchCredentials();
            handleCloseCredential();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
            console.error(error);
        }
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        // setSelectedCredential({
        //     ...selectedCredential,
        //     subjectName: event.target.value,
        // });
    };

    useEffect(() => {
        fetchUserInfo();
        fetchCredentials();
        const fetchSubjects = async () => {
            const subjectsData = await GetAllSubjects();
            setSubjects(subjectsData);
        };

        fetchSubjects();
    }, []);

    const columns = [
        { width: 150, label: "Subject Name", dataKey: "subjectName" },
        { width: 100, label: "Name", dataKey: "name" },
        { width: 100, label: "Type", dataKey: "type" },
        { width: 100, label: "Status", dataKey: "status" },
        { width: 100, label: "Actions", dataKey: "actions" },
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) =>
                (
                    column.dataKey === "subjectName") ? (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric || false ? "right" : "left"}
                    >
                        {row["subject"] && row["subject"]["name"]}
                    </TableCell>

                ) :

                    column.dataKey !== "actions" ? (
                        <TableCell
                            key={column.dataKey}
                            align={column.numeric || false ? "right" : "left"}
                        >
                            {row[column.dataKey]}
                        </TableCell>
                    ) : (
                        <TableCell key={column.dataKey} text-align="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOpenCredential(row)}
                            >
                                Edit
                            </Button>
                            <Button
                                style={{ marginLeft: "7px" }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleViewCredentialDetails(row)}
                            >
                                View
                            </Button>
                        </TableCell>
                    )
            )}
        </>
    );

    return (
        <>
            <Box
                className="user-info-wrapper"
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 1200,
                    width: "100%",
                    mt: 4,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5c6bc0",
                    }}
                >
                    User Information
                </Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        alt="User Avatar"
                        src={avatar}
                        sx={{ width: 100, height: 100 }}
                    />
                </div>
                <div style={{ textAlign: "center", marginTop: 15 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                    >
                        Update Information
                    </Button>
                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Update User Information</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Username"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            disabled
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Phone Number"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <InputLabel>Gender</InputLabel>
                        <Select
                            fullWidth
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        <div style={{ marginTop: 16 }}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Avatar
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        setAvatarFile(e.target.files[0]);
                                        setAvatarFileName(e.target.files[0].name);
                                    }}
                                />
                            </Button>
                            <span style={{ marginLeft: 8 }}>
                                {avatarFileName}
                            </span>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={updateUserInfo}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 1200,
                    width: "100%",
                    mt: 4,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5c6bc0",
                    }}
                >
                    Credentials
                </Typography>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenCredential()}
                    >
                        Add Credential
                    </Button>
                </div>
                <Paper style={{ height: 400, width: "100%" }}>
                    <TableVirtuoso
                        data={credentials}
                        components={{
                            Scroller: TableContainer,
                            Table: (props) => (
                                <Table {...props} sx={{ borderCollapse: "separate" }} />
                            ),
                            TableHead,
                            TableRow: ({ item: _item, ...props }) => (
                                <TableRow {...props} />
                            ),
                            TableBody: React.forwardRef((props, ref) => (
                                <TableBody {...props} ref={ref} />
                            )),
                        }}
                        fixedHeaderContent={() => (
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.dataKey}
                                        align={column.numeric || false ? "right" : "left"}
                                        style={{ width: column.width }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                        itemContent={rowContent}
                    />
                </Paper>
            </Box>
            <br></br>
            <Dialog
                open={openCredential}
                onClose={handleCloseCredential}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {selectedCredential.id ? "Update Credential" : "Add Credential"}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                            labelId="subject-label"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject}>
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
                        value={selectedCredential.name}
                        onChange={(e) =>
                            setSelectedCredential({
                                ...selectedCredential,
                                name: e.target.value,
                            })
                        }
                    />

                    <TextField
                        margin="dense"
                        label="Type"
                        fullWidth
                        value={selectedCredential.type}
                        onChange={(e) =>
                            setSelectedCredential({
                                ...selectedCredential,
                                type: e.target.value,
                            })
                        }
                    />
                    <div style={{ marginTop: 16 }}>
                        <Button variant="contained" component="label">
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    setCredentialImageFile(e.target.files[0]);
                                    setCredentialFileName(e.target.files[0].name);
                                }}
                            />
                        </Button>
                        <span style={{ marginLeft: 8 }}>{credentialFileName}</span>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCredential} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveCredential} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={selectedCredentialDetails !== null}
                onClose={() => setSelectedCredentialDetails(null)}
                aria-labelledby="credential-details-title"
            >
                <DialogTitle id="credential-details-title">
                    Credential Details
                </DialogTitle>
                <DialogContent>
                    {selectedCredentialDetails && (
                        <>
                            <Typography variant="body1">
                                <strong>Subject Name:</strong> {selectedCredentialDetails.subject && selectedCredentialDetails.subject.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Name:</strong> {selectedCredentialDetails.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Type:</strong> {selectedCredentialDetails.type}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong>{" "}
                                {selectedCredentialDetails.status}
                            </Typography>
                            {selectedCredentialDetails.image && (
                                <img
                                    src={selectedCredentialDetails.image}
                                    alt="Credential"
                                    style={{ width: "100%", marginTop: 16 }}
                                />
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedCredentialDetails(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen || userInfoSnackbarOpen || credentialSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarOpen && (selectedCredential.id ? "Credential updated successfully" : "Credential added successfully")}
                    {userInfoSnackbarOpen && "User information updated successfully. Please refresh!"}
                    {credentialSnackbarOpen && "Credential updated successfully. Please refresh!"}
                </Alert>
            </Snackbar>
        </>
    );
}
