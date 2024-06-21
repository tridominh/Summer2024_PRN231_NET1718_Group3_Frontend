import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { GetAllBookingsByStatus } from "../../services/ApiServices/BookingService";
import parseJwt from "../../services/parseJwt";
import { Link } from "react-router-dom";
import { GetAllTutorsByBooking } from "../../services/ApiServices/BookingService";
import { GetUserInfo } from "../../services/ApiServices/UserService";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appliedTutors, setAppliedTutors] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [tutorProfile, setTutorProfile] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem("token");
        const userId = Number(parseJwt(token).nameid);

        const bookingResponse = await GetAllBookingsByStatus("PENDING");
        const allBookings = bookingResponse.data;
        const studentBookings = allBookings.filter((booking) => {
          return (
            booking.bookingUsers[0].userId === userId &&
            booking.bookingUsers[0].role === "STUDENT"
          );
        });

        setRequests(studentBookings);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
    fetchRequests();
  }, []);

  const handleOpenDialog = async (bookingId) => {
    try {
      const tutorsResponse = await GetAllTutorsByBooking(bookingId);
      if (Array.isArray(tutorsResponse.data)) {
        const tutorInfoPromises = tutorsResponse.data.map(async (tutor) => {
          const profile = await GetUserInfo(tutor.user.id);
          return { ...tutor, user: profile };
        });
        const tutorsWithPosts = await Promise.all(tutorInfoPromises);
        setAppliedTutors(tutorsWithPosts);
        setSelectedBookingId(bookingId);
        setDialogOpen(true);
      } else {
        console.error(
          "Invalid response from GetAllTutorsByBooking:",
          tutorsResponse,
        );
      }
    } catch (error) {
      console.error("Error fetching applied tutors:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAccept = (tutorId) => {
    console.log("Accepted tutor with ID:", tutorId);
  };

  const handleOpenProfileDialog = async (userId) => {
    try {
      const profileResponse = await GetUserInfo(userId);
      setTutorProfile(profileResponse);
      setProfileDialogOpen(true);
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
    }
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  const filterAcceptedCredentials = (credentials) => {
    return credentials.filter((credential) => credential.status === "Accepted");
  };

  return (
    <Container maxWidth="max-w-7xl mx-auto p-4" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3">
        Your Requests
      </Typography>
      <Button
        sx={{ margin: "1.5rem" }}
        component={Link}
        to="/student/booking"
        variant="contained"
        color="primary"
      >
        Create New Request
      </Button>
      <Grid container spacing={3}>
        {requests.map((request, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="p-4 border border-black rounded-md shadow-md">
              <CardContent>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  className="text-center"
                  color="text.secondary"
                >
                  Subject: <strong> {request.subjectName}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Level: <strong> {request.levelName}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Number Of Slots: <strong>{request.numOfSlots}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Price Per Slot: <strong>{request.pricePerSlot}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Description: <strong>{request.description}</strong>
                </Typography>

                <Typography color="text.secondary">
                  Status: <strong>{request.status}</strong>
                </Typography>
                <Typography
                  color="blue"
                  textAlign={"right"}
                  className="mt-2 underline"
                >
                  <div
                    onClick={() => handleOpenDialog(request.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Tutors Requests
                  </div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="dialog-title">List tutors applied</DialogTitle>
        <DialogContent>
          {appliedTutors.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No tutors applied :(
            </Typography>
          ) : (
            appliedTutors.map((tutor, index) => (
              <DialogContentText
                key={index}
                id={`tutor-${index}`}
                className="flex justify-between"
              >
                <span
                  onClick={() => handleOpenProfileDialog(tutor.user.id)}
                  className="cursor-pointer text-blue-500"
                >
                  {`${index + 1}. ${tutor.user.userName}`}
                  {tutor.user.posts.length > 0 &&
                    tutor.user.posts.some(post => post.status === "ACTIVE") && (
                    <Tooltip title="Tutors have contributed to improving students' knowledge.">
                      <StarIcon
                        className="mb-1"
                        style={{ color: "red", marginLeft: "5px" }}
                      />
                    </Tooltip>
                  )}
                </span>
                <div className="mb-3">
                  <Button
                    onClick={() => handleAccept(tutor.id)}
                    variant="contained"
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    Accept
                  </Button>
                </div>
              </DialogContentText>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        aria-labelledby="profile-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle variant="h4" id="profile-dialog-title">
          Tutor Profile
        </DialogTitle>
        <DialogContent>
          {tutorProfile && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={tutorProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    marginRight: 2,
                  }}
                />
              </Box>
              <div>
                <Typography>
                  <strong>Name: </strong>
                  {tutorProfile.userName}
                </Typography>
                <Typography>
                  <strong>Email: </strong>
                  {tutorProfile.email}
                </Typography>
                <Typography>
                  <strong>Phone Number: </strong>
                  {tutorProfile.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Address: </strong>
                  {tutorProfile.address}
                </Typography>
                <Typography>
                  <strong>Gender: </strong>
                  {tutorProfile.gender}
                </Typography>
                <Typography>
                  <strong>Credentials:</strong>
                </Typography>
                {filterAcceptedCredentials(tutorProfile.credentials).map(
                  (credential, index) => (
                    <div className="mt-1" key={index}>
                      <Typography
                        className="block"
                        variant="body1"
                        component="p"
                      >
                        <>- {credential.name}:</>
                      </Typography>
                      <img
                        src={credential.image}
                        alt={`Credential ${index + 1}`}
                        className="justify-center"
                        style={{
                          display: "flex",
                          maxWidth: "60%",
                          margin: "10px auto",
                        }}
                      />
                      <br></br>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
