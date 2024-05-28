import React, { useEffect, useState } from "react";
import { GetUserInfo, UpdateUserInfo, UploadAvatar } from "../services/ApiServices/UserService";
import {
    GetAllCredentials,
    AddCredential,
    UpdateCredential,
    UploadCredentialImage
} from "../services/ApiServices/CredentialService";
import {
    Dialog, DialogContent, DialogTitle, Select, MenuItem, InputLabel,
    TextField, Typography, Box, Avatar, Button, DialogActions, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import parseJwt from "../services/parseJwt";
import { TableVirtuoso } from 'react-virtuoso';

export function ProfileTutor({ token, setToken }) {
    const id = parseJwt(token).nameid || "";
    const [userInfo, setUserInfo] = useState({
        id: "", userName: "", email: "", phone: "", address: "",
        avatar: "", gender: "", hashPassword: ""
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [openCredential, setOpenCredential] = useState(false);
    const [selectedCredentialDetails, setSelectedCredentialDetails] = useState(null);

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState(userInfo.email);
    const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
    const [address, setAddress] = useState(userInfo.address);
    const [avatar, setAvatar] = useState(userInfo.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [gender, setGender] = useState(userInfo.gender);

    const [credentials, setCredentials] = useState([]);
    const [selectedCredential, setSelectedCredential] = useState({
        id: "", tutorId: id, name: "", type: "", image: "", status: true
    });
    const [credentialImageFile, setCredentialImageFile] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleViewCredentialDetails = (credential) => {
        setSelectedCredentialDetails(credential);
      }

    const handleOpenCredential = (credential = null) => {
        if (credential) setSelectedCredential(credential);
        else setSelectedCredential({ id: "", tutorId: id, name: "", type: "", image: "", status: true });
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
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    }

    const fetchCredentials = async () => {
        try {
            const credentials = await GetAllCredentials();
            setCredentials(credentials);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    }

    const updateUserInfo = async () => {
        try {
            let updatedUser = {
                id: userInfo.id, receiverName: userName, email: email, phoneNumber: phoneNumber,
                address: address, avatar: userInfo.avatar, gender: gender, hashPassword: userInfo.hashPassword  
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
            // console.log(updatedUser);
            const user = await UpdateUserInfo(updatedUser);
             console.log(userInfo);
            const avatarResponse = await handleUploadAvatar(user.id);
            console.log(avatarResponse);
            user.avatar = avatarResponse?.avatar;
            setUserInfo(user);
            handleClose();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
            console.error(error);
        }
    }

    const handleSaveCredential = async () => {
        try {
            let updatedCredential = {
                id: selectedCredential.id, tutorId: selectedCredential.tutorId, name: selectedCredential.name,
                type: selectedCredential.type, image: selectedCredential.image, status: selectedCredential.status
            };

            if (credentialImageFile) {
                const formData = new FormData();
                formData.append("file", credentialImageFile);
                formData.append("credentialId", selectedCredential.id);
                try {
                    const uploadResponse = await UploadCredentialImage(formData);
                    updatedCredential.image = uploadResponse?.imageUrl;
                } catch (error) {
                    console.error("Image upload failed:", error);
                }
            }

            if (selectedCredential.id) await UpdateCredential(updatedCredential);
            else await AddCredential(updatedCredential);

            fetchCredentials();
            handleCloseCredential();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchCredentials();
    }, []);

    const columns = [
        { width: 150, label: 'Name', dataKey: 'name' },
        { width: 100, label: 'Type', dataKey: 'type' },
        { width: 100, label: 'Status', dataKey: 'status' },
        { width: 100, label: 'Actions', dataKey: 'actions' }
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) => (
                column.dataKey !== 'actions' ? (
                    <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
                        {column.dataKey === 'status' ? (row[column.dataKey] ? 'Active' : 'Inactive') : row[column.dataKey]}
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
                            style={{marginLeft:"7px"}}
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewCredentialDetails(row)}
                        >
                            View
                        </Button>
                    </TableCell>
                )
            ))}
        </>
    );
    

    return (
        <>
            <div className="flex content-center items-center" style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Box className="user-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, width: '90%', mx: 'auto', display: 'flex', gap: 4 }}>
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
                        <Avatar src={userInfo.avatar} alt="User Avatar" sx={{ width: 150, height: 150, mb: 2 }} />
                        <Typography variant="body1"><strong>Avatar</strong></Typography>
                    </Box>
                </Box>

<br></br>
                <Box sx={{ width: '50%' }}>
                    <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                        <strong>CREDENTIALS</strong>
                    </Typography>
                    <Paper sx={{ height: 200, width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 200 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.dataKey}
                                                align={column.numeric || false ? 'right' : 'left'}
                                                style={{ minWidth: column.width }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {credentials.map((row, index) => (
                                        <TableRow hover tabIndex={-1} key={row.id}>
                                            {rowContent(index, row)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Button variant="contained" style={{float: "right"}} color="primary" onClick={() => handleOpenCredential()} sx={{ mt: 2 }}>
                        Add New Credential
                    </Button>
                </Box>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit User Information</DialogTitle>
                    <DialogContent>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            await updateUserInfo();
                            handleClose();
                        }}>
                            <TextField
                                label="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                            <TextField
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                            </Select>
                            <TextField
                                label="Avatar"
                                type="file"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                                fullWidth
                                margin="normal"
                            />
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">Cancel</Button>
                                <Button type="submit" color="primary">Save</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={selectedCredentialDetails !== null} onClose={() => setSelectedCredentialDetails(null)}>
  <DialogTitle>Credential Details</DialogTitle>
  <DialogContent>
    {selectedCredentialDetails && (
      <>
        <Typography variant="body1"><strong>Name:</strong> {selectedCredentialDetails.name}</Typography>
        <Typography variant="body1"><strong>Type:</strong> {selectedCredentialDetails.type}</Typography>
        <Typography variant="body1"><strong>Status:</strong> {selectedCredentialDetails.status ? 'Active' : 'Inactive'}</Typography>
        {selectedCredentialDetails.image && (
          <Box>
            <Typography variant="body1"><strong>Image:</strong></Typography>
            <Avatar src={selectedCredentialDetails.image} alt="Credential Image" sx={{ width: 150, height: 150 }} />
          </Box>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedCredentialDetails(null)} color="primary">Close</Button>
  </DialogActions>
</Dialog>
                <Dialog open={openCredential} onClose={handleCloseCredential}>
                    <DialogTitle>{selectedCredential.id ? "Edit Credential" : "Add New Credential"}</DialogTitle>
                    <DialogContent>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            await handleSaveCredential();
                            handleCloseCredential();
                        }}>
                            <TextField
                                label="Name"
                                value={selectedCredential.name}
                                onChange={(e) => setSelectedCredential({ ...selectedCredential, name: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Type"
                                value={selectedCredential.type}
                                onChange={(e) => setSelectedCredential({ ...selectedCredential, type: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Image"
                                type="file"
                                onChange={(e) => setCredentialImageFile(e.target.files[0])}
                                fullWidth
                                margin="normal"
                            />
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={selectedCredential.status}
                                onChange={(e) => setSelectedCredential({ ...selectedCredential, status: e.target.value })}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </Select>
                            <DialogActions>
                                <Button onClick={handleCloseCredential} color="secondary">Cancel</Button>
                                <Button type="submit" color="primary">Save</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
