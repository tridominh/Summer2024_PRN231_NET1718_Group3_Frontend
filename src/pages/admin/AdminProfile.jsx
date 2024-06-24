import { useEffect, useState } from "react";
import { GetUserInfo, UpdateUserInfo, UploadAvatar } from "../../services/ApiServices/UserService";
import { Dialog, DialogContent, DialogTitle, Select, MenuItem, InputLabel, TextField, Typography, Box, Avatar } from "@mui/material";
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import parseJwt from "../../services/parseJwt";
import { formatPrice } from "../../services/formatPrice";
import { AddCreditDialog } from "../../component/AddCreditDialog";

export function AdminProfile({ token, setToken }) {
    const id = token ? parseJwt(token).nameid : "";

    const [userInfo, setUserInfo] = useState({
        id: "",
        userName: "",
        email: "",
        phone: "",
        status: "",
        address: "",
        avatar: "",
        gender: "",
        hashPassword: ""
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState(userInfo.email);
    const [status, setStatus] = useState(userInfo.phoneNumber);
    const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
    const [address, setAddress] = useState(userInfo.address);
    const [avatar, setAvatar] = useState(userInfo.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [gender, setGender] = useState(userInfo.gender);

    //credit dialog state
    const [openCredit, setOpenCredit] = useState(false);

    const handleOpenCredit = () => {
        setOpenCredit((openCredit) => !openCredit);
    };

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const fetchUserInfo = async () => {
        try {
            const userId = id;
            const userInfo = await GetUserInfo(id);
            setUserInfo(userInfo);
            setUserName(userInfo.userName);
            setEmail(userInfo.email);
            setAddress(userInfo.address);
            setPhoneNumber(userInfo.phoneNumber);
            setStatus(userInfo.status);
            setAvatar(userInfo.avatar);
            setGender(userInfo.gender);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    }

    const updateUserInfo = async () => {
        try {
            let updatedUserInfo = {
                id: userInfo.id,
                receiverName: userName,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                avatar: userInfo.avatar,
                gender: gender,
                status: userInfo.status,
                hashPassword: userInfo.hashPassword
            };

            const handleUploadAvatar = async (userId) => {
                console.log(avatarFile);
                if (avatarFile) {
                    const formData = new FormData();
                    formData.append("file", avatarFile);
                    formData.append("userId", userId);

                    try {
                        const uploadResponse = await UploadAvatar(formData);
                        console.log("Upload successful:", uploadResponse);
                        console.log(uploadResponse);
                        return uploadResponse;
                    } catch (error) {
                        console.error("Upload failed:", error);
                    }
                } else {
                    console.error("No avatar file selected.");
                }
            };

            const user = await UpdateUserInfo(updatedUserInfo);
            const avatar1 = await handleUploadAvatar(user.id);
            user.avatar = avatar1?.avatar;
            setUserInfo(user);
            handleClose();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (!token) {
        return (
            <div>
                <h1>Please login</h1>
            </div>
        )
    }

    return (
        <>
            <Box sx={{ padding: 3 }}>
                <Box className="user-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', display: 'flex', gap: 4 }}>
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
                        <TextField
                            disabled
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
                            type="file"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                            fullWidth
                            margin="normal"
                        />
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Box className="credit-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                    CREDITS
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h6">Your credit balance:</Typography>
                    <Typography sx={{ ml: 1 }}>{formatPrice(userInfo.credit)}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button disabled variant="contained" color="primary" onClick={handleOpenCredit}>
                        Add Credit
                    </Button>
                </Box>
            </Box>


            <AddCreditDialog open={openCredit} handleClose={handleOpenCredit} userId={userInfo.id} />

        </>
    );
}