import React, { useEffect, useState } from "react";
import {
  GetUserInfo,
  UpdateUserInfo,
  UploadAvatar,
} from "../services/ApiServices/UserService";
import {
  GetCredentialsByUserId,
  AddCredential,
  UpdateCredential,
  UploadCredentialImage,
  DeleteCredential,
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
  DialogContentText,
} from "@mui/material";
import parseJwt from "../services/parseJwt";
import { GetAllSubjects } from "../services/ApiServices/SubjectService";
import { GetBookingUsersByUserId } from "../services/ApiServices/BookingUserService";
import { formatPrice } from "../services/formatPrice";
import { AddCreditDialog } from "../component/AddCreditDialog";

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
    status: "",
    hashPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [openCredential, setOpenCredential] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedCredentialDetails, setSelectedCredentialDetails] =
    useState(null);
  //credit dialog state
  const [openCredit, setOpenCredit] = useState(false);
  const [openTakeCredit, setOpenTakeCredit] = useState(false);
  const [amount, setAmount] = useState('');

  const handleOpenCredit = () => {
    setOpenCredit((openCredit) => !openCredit);
  };

  const handleOpenTakeCredit = () => {
    setOpenTakeCredit(!openTakeCredit);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenTakeCredit(false);
  };

  const handleConfirm = () => {
    setOpenTakeCredit(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarCloseCredit = () => {
    setSnackbarOpen(false);
  };

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState(userInfo.email);
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
  const [address, setAddress] = useState(userInfo.address);
  const [status, setStatus] = useState(userInfo.status);
  const [bookingStatus, setBookingStatus] = useState("");
  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [gender, setGender] = useState(userInfo.gender);
  const [selectedSubject, setSelectedSubject] = useState("");
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

  const handleOpenView = (credential) => {
    setSelectedCredentialDetails(credential);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedCredentialDetails(null);
  };

  const handleViewCredentialDetails = (credential) => {
    handleOpenView(credential);
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await GetUserInfo(id);
      setUserInfo(userInfo);
      setUserName(userInfo.userName);
      setEmail(userInfo.email);
      setAddress(userInfo.address);
      setPhoneNumber(userInfo.phoneNumber);
      setAvatar(userInfo.avatar);
      setStatus(userInfo.status);
      setGender(userInfo.gender);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later.",
      );
    }
  };

  const fetchCredentials = async () => {
    try {
      const credentials = await GetCredentialsByUserId(id);
      setCredentials(credentials);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later.",
      );
    }
  };

  const validateUserInfo = () => {
    const nameRegex = /^[^\d\W_]+$/;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d+$/;

    if (!userName || !email || !address || !phoneNumber || !gender || !status) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }

    if (!nameRegex.test(userName)) {
      setErrorMessage(
        "Receiver Name must contain only letters and cannot contain special characters or numbers.",
      );
      return false;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid Email Address.");
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

  const updateUserInfo = async () => {
    try {
      if (!validateUserInfo()) {
        return;
      }
      let updatedUser = {
        id: userInfo.id,
        receiverName: userName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        avatar: userInfo.avatar,
        gender: gender,
        status: userInfo.status,
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
        "An error occurred. Please try again later.",
      );
      console.error(error);
    }
  };

  const validateCredential = (credential) => {
    const nameRegex = /^[0-9a-zA-Z\sÀ-ỹ!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\`~]+$/;
    const typeRegex = /^[0-9a-zA-Z\sÀ-ỹ!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\`~]+$/;
    console.log(credential.name)
    console.log(credential.type)
    console.log(selectedSubject)
    console.log(credential.image)
    credential.image = credentialImageFile
    if (
      !credential.name ||
      !credential.type ||
      !selectedSubject ||
      !credential.image
    ) {
      setErrorMessage("Name, Type, Image and Subject are required.");
      return false;
    }


    if (credential.name.length > 100 || !nameRegex.test(credential.name)) {
      setErrorMessage(
        "Name must be uppercase, without numbers and special characters, and less than 100 characters.",
      );
      return false;
    }

    if (credential.type.length > 100 || !typeRegex.test(credential.type)) {
      setErrorMessage(
        "Type must be uppercase, without numbers and special characters, and less than 100 characters.",
      );
      return false;
    }

    return true;
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
        subjectId: selectedSubject,
      };

      let addCredential = {
        tutorId: id,
        name: selectedCredential.name,
        type: selectedCredential.type,
        image: "",
        status: "Pending",
        subjectId: selectedSubject,
      };

      if (!validateCredential(selectedCredential)) {
        return;
      }
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
      setErrorMessage("");
      fetchCredentials();
      handleCloseCredential();
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred. Please try again later.",
      );
      console.error(error);
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    try {
      await DeleteCredential(credentialId);
      setCredentialSnackbarOpen(true);
      fetchCredentials();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later.",
      );
      console.error(error);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const fetchBookingStatus = async () => {
    try {
      const bookingUsers = await GetBookingUsersByUserId(id);
      if (bookingUsers.length > 0) {
        setBookingStatus("In booking");
      } else {
        setBookingStatus("Not in booking");
      }
    } catch (error) {
      console.error("Error fetching booking status:", error);
    }
  };

  useEffect(() => {
    fetchBookingStatus();
    fetchUserInfo();
    fetchCredentials();
    const fetchSubjects = async () => {
      const subjectsData = await GetAllSubjects();
      setSubjects(subjectsData);
    };

    fetchSubjects();
  }, []);

  const columns = [
    { label: "Subject Name", dataKey: "subjectName" },
    { label: "Name", dataKey: "name" },
    { label: "Type", dataKey: "type" },
    { label: "Status", dataKey: "status" },
    { label: "Actions", dataKey: "actions" },
  ];

  const rowContent = (_index, row) => (
    <>
      {columns.map((column) =>
        column.dataKey === "subjectName" ? (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? "right" : "left"}
          >
            {row["subject"] && row["subject"]["name"]}
          </TableCell>
        ) : column.dataKey !== "actions" ? (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? "right" : "left"}
          >
            {row[column.dataKey]}
          </TableCell>
        ) : (
          <TableCell style={{ minWidth: "300px" }}
            key={column.dataKey} text-align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenCredential(row)}
              disabled={bookingStatus === "In booking"}
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
            <Button
              style={{ marginLeft: "7px" }}
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteCredential(row.id)}
              disabled={bookingStatus === "In booking"}
            >
              Delete
            </Button>
          </TableCell>
        ),
      )}
    </>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Box className="user-info-wrapper mb-5" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            <strong>USER INFORMATION</strong>
          </Typography>
          <Typography variant="body1"><strong>Name:</strong> {userInfo.userName}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
          <Typography variant="body1"><strong>Phone number:</strong> {userInfo.phoneNumber}</Typography>
          <Typography variant="body1"><strong>Address:</strong> {userInfo.address}</Typography>
          <Typography variant="body1"><strong>Gender:</strong> {userInfo.gender}</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
            Edit
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            src={userInfo.avatar}
            alt="User Avatar"
            sx={{ width: 150, height: 150, mb: 2 }}
          />
          <Typography variant="body1"><strong>Avatar</strong></Typography>
        </Box>
      </Box>
      {/*<Box className="credit-info-wrapper mb-5" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
          CREDITS
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6">Your credit balance:</Typography>
          <Typography sx={{ ml: 1 }}>{formatPrice(userInfo.credit)}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpenCredit}>
            Add Credit
          </Button>
          <Button className="ml-2" variant="contained" color="secondary" onClick={handleOpenTakeCredit}>
            Withdraw money
          </Button>
          <Dialog open={openTakeCredit} onClose={handleCloseDialog}>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogContent>
              <DialogContentText>
                How much money would you like to take? (VND)
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Money"
                type="number"
                fullWidth
                value={amount}
                onChange={handleAmountChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>*/}

      <Box className="credentials-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
          CREDENTIALS
        </Typography>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpenCredential}>
            Add Credential
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.dataKey} style={{ minWidth: 200, flex: 1 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {credentials.map((credential) => (
                <TableRow key={credential.id}>
                  {rowContent(credential.id, credential)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              className="mt-1"
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Status"
              disabled
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            />
            <TextField
              label="Booking status"
              disabled
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              fullWidth
            />
            <input
              type="file"
              onChange={(e) => {
                setAvatarFile(e.target.files[0]);
                setAvatarFileName(e.target.files[0].name);
              }}
            />
            <div className="text-red-500">{errorMessage}</div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateUserInfo} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCredential} onClose={handleCloseCredential}>
        <DialogTitle>
          {selectedCredential.id ? "Edit Credential" : "Add Credential"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              className="mt-1"
              label="Name"
              value={selectedCredential.name}
              onChange={(e) =>
                setSelectedCredential({
                  ...selectedCredential,
                  name: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Type"
              value={selectedCredential.type}
              onChange={(e) =>
                setSelectedCredential({
                  ...selectedCredential,
                  type: e.target.value,
                })
              }
              fullWidth
            />
            <FormControl fullWidth>
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
            <input
              type="file"
              onChange={(e) => {
                setCredentialImageFile(e.target.files[0]);
                setCredentialFileName(e.target.files[0].name);
              }}
            />
            <div className="text-red-500">{errorMessage}</div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCredential}>Cancel</Button>
          <Button onClick={handleSaveCredential} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to view credential details */}
      <Dialog open={openView} onClose={handleCloseView}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Credential Details
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">
              Subject: {selectedCredentialDetails?.subject?.name}
            </Typography>
            <Typography variant="h6">
              Name: {selectedCredentialDetails?.name}
            </Typography>
            <Typography variant="h6">
              Type: {selectedCredentialDetails?.type}
            </Typography>
            <Typography variant="h6">
              Status: {selectedCredentialDetails?.status}
            </Typography>
            {selectedCredentialDetails?.image && (
              <Box display="flex" justifyContent="center">
                <img
                  src={selectedCredentialDetails?.image}
                  alt="Credential"
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>
      {/*<AddCreditDialog open={openCredit} handleClose={handleOpenCredit} userId={userInfo.id} />
        */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Credential added successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={userInfoSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={credentialSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Credential updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarCloseCredit}
      >
        <Alert onClose={handleSnackbarCloseCredit} severity="success" sx={{ width: '100%' }}>
          Thanks for choosing our service
        </Alert>
      </Snackbar>
    </Box>
  );
}

