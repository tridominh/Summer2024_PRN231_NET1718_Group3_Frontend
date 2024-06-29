import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import parseJwt from "../../services/parseJwt";
import {
  ApplyToBooking,
  CancelApplication,
  GetAllBookings,
  calculateCompletedDate,
} from "../../services/ApiServices/BookingService";
import { GetAllBookingUsers } from "../../services/ApiServices/BookingUserService";
import { GetUserInfo } from "../../services/ApiServices/UserService";
import { GetAllSubjects } from "../../services/ApiServices/SubjectService";
import { formatDate } from "../../services/utils";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TutorRequestsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  const [appliedBookings, setAppliedBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpens, setDialogOpens] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleOpenDialog = async (booking) => {
    try {
      const studentUser = booking.bookingUsers.find(
        (user) => user.role === "STUDENT",
      );
      if (!studentUser) {
        throw new Error("No student user found for this booking");
      }
      const response = await GetUserInfo(studentUser.userId);
      setSelectedStudentProfile(response);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const handleOpenBookingDetailDialog = async (booking) => {
    try {
      const studentUser = booking.bookingUsers.find(
        (user) => user.role === "STUDENT",
      );
      if (!studentUser) {
        throw new Error("No student user found for this booking");
      }
      const response = await GetUserInfo(studentUser.userId);
      setSelectedBooking(booking);
      setDialogOpens(true);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogOpens(false);
    setSelectedStudentProfile(null);
    setSelectedBooking(null);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(parseJwt(token).nameid);

      const bookingResponse = await GetAllBookings();
      const allBookings = bookingResponse.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
      const bookingUsers = await GetAllBookingUsers();
      const tutorBookingIds = bookingUsers
        .filter((bookingUser) => bookingUser.userId === userId)
        .map((bookingUser) => bookingUser.bookingId);

      const tutorBookings = allBookings.map((booking) => ({
        ...booking,
        tutorApplied: tutorBookingIds.includes(booking.id),
        tutorApproved: bookingUsers.some(
          (bookingUser) =>
            bookingUser.bookingId === booking.id &&
            bookingUser.userId === userId &&
            bookingUser.status === "APPROVED",
        ),
      }));

      const tutorAppliedBookingIds = bookingUsers
        .filter(
          (bookingUser) =>
            bookingUser.userId === userId && bookingUser.status === "APPLIED",
        )
        .map((bookingUser) => bookingUser.bookingId);

      const appliedBookings = allBookings
        .filter((booking) => tutorAppliedBookingIds.includes(booking.id))
        .map((booking) => ({
          ...booking,
          tutorApplied: true,
        }));

      const tutorApprovedBookingIds = bookingUsers
        .filter(
          (bookingUser) =>
            bookingUser.userId === userId && bookingUser.status === "APPROVED",
        )
        .map((bookingUser) => bookingUser.bookingId);

      const approvedBookings = allBookings
        .filter((booking) => tutorApprovedBookingIds.includes(booking.id))
        .map((booking) => ({
          ...booking,
          tutorApproved: true,
        }));

      setBookings(tutorBookings);
      setAllBookings(tutorBookings);
      setAppliedBookings(appliedBookings);
      setApprovedBookings(approvedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  const convertToDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-CA");
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const handleApply = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(parseJwt(token).nameid);

      const bookingToApply = bookings.find(
        (booking) => booking.id === bookingId,
      );
      if (!bookingToApply) {
        throw new Error(`Booking with ID ${bookingId} not found.`);
      }

      const tutorInfo = await GetUserInfo(userId);
      if (!tutorInfo) {
        throw new Error(`User information not found for user ID ${userId}.`);
      }

      const matchingCredentials = tutorInfo.credentials.filter(
        (credential) => credential.subjectId === bookingToApply.subjectId,
      );

      if (
        matchingCredentials.length === 0 ||
        matchingCredentials.every(
          (credential) => credential.status === "Pending",
        )
      ) {
        setSnackbarMessage(
          "You don't have credentials for this subject to apply",
        );
        setSnackbarOpen(true);
        return;
      }

      const hasActiveCredential = matchingCredentials.some(
        (credential) => credential.status === "Accepted",
      );
      if (!hasActiveCredential) {
        setSnackbarMessage(
          "You don't have credentials for this subject to apply",
        );
        setSnackbarOpen(true);
        return;
      }

      const applyBookingDto = {
        bookingId: bookingId,
        userId: userId,
      };

      await ApplyToBooking(applyBookingDto);

      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, tutorApplied: true };
        }
        return booking;
      });

      setBookings(updatedBookings);
      setSnackbarMessage(
        "Applied successfully, please wait for student response",
      );
      fetchBookings();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error applying to booking:", error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(parseJwt(token).nameid);

      const cancelBookingDto = {
        bookingId: bookingId,
        userId: userId,
      };

      await CancelApplication(cancelBookingDto);

      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, tutorApplied: false };
        }
        return booking;
      });

      setBookings(updatedBookings);
      setSnackbarMessage("Application canceled successfully");
      fetchBookings();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error canceling application:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderBookings = (filteredBookings) => {
    return filteredBookings.map((booking, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card
          style={{ height: "350px" }}
          className="p-4 border border-black rounded-md shadow-md mt-5"
        >
          <CardContent>
            <div className="mb-2">
              <Typography
                sx={{ fontWeight: "bold" }}
                className="text-center"
                color="text.secondary"
              >
                <strong>Subject: </strong>
                {booking.subjectName}
              </Typography>
            </div>
            <Typography color="text.secondary">
              <strong>Create Date: </strong>{" "}
              {convertToDate(booking.createdDate)}
            </Typography>

            <Typography color="text.secondary">
              <strong>Grade: </strong>
              {booking.levelName}
            </Typography>
            <Typography color="text.secondary">
              <strong>Start Date: </strong>
              {formatDate(booking.startDate)}
            </Typography>

            <Typography color="text.secondary">
              <strong>Total slots: </strong>
              {booking.numOfSlots}
            </Typography>
            <Typography color="text.secondary">
              <strong>Price Per Slot: </strong>
              {formatPrice(booking.pricePerSlot, "VND")}
            </Typography>
            <Typography color="text.secondary">
              <strong>Description: </strong>
              {booking.description}
            </Typography>

            <Typography color="text.secondary">
              <strong>Status: </strong> {booking.status}
            </Typography>

            <Typography
              color="blue"
              textAlign={"right"}
              className="mt-2 underline"
            >
              <div
                onClick={() => handleOpenBookingDetailDialog(booking)}
                style={{ cursor: "pointer" }}
              >
                View Booking Details
              </div>
            </Typography>
            <Typography
              color="blue"
              textAlign={"right"}
              className="mt-2 underline"
            >
              <div
                onClick={() => handleOpenDialog(booking)}
                style={{ cursor: "pointer" }}
              >
                View Profile Student
              </div>
            </Typography>

            {!booking.tutorApproved && !booking.tutorApplied ? (
              booking.status === "CANCELLED" ? (
                <Button
                  sx={{ mt: 2 }}
                  className="start-80"
                  variant="contained"
                  color="primary"
                  disabled
                >
                  Apply
                </Button>
              ) : booking.status === "PENDING" ? (
                <Button
                  sx={{ mt: 2 }}
                  className="start-80"
                  variant="contained"
                  color="primary"
                  onClick={() => handleApply(booking.id)}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  sx={{ mt: 2 }}
                  className="start-80"
                  variant="contained"
                  color="primary"
                  disabled
                >
                  Apply
                </Button>
              )
            ) : (
              <>
                <Button
                  sx={{ mt: 2, mr: 1 }}
                  variant="contained"
                  color="primary"
                  disabled
                >
                  Applied
                </Button>
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancel(booking.id)}
                  disabled={
                    booking.status === "APPROVED" ||
                    booking.status === "CANCELLED"
                  }
                >
                  Cancel
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="max-w-7xl mx-auto p-4" className="my-3">
      <Typography
        variant="h4"
        align="center"
        className="text-violet-800 my-3 mt-5"
      >
        Students Requests
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="requests tabs"
          centered
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Applied" {...a11yProps(1)} />
          <Tab label="Approved" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0}>
        <Grid container spacing={3}>
          {renderBookings(allBookings)}
        </Grid>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1}>
        <Grid container spacing={3}>
          {renderBookings(appliedBookings)}
        </Grid>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 2}>
        <Grid container spacing={3}>
          {renderBookings(approvedBookings)}
        </Grid>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Student Profile</DialogTitle>
        <DialogContent>
          {selectedStudentProfile ? (
            <DialogContentText>
              <Typography>
                <strong>Name:</strong> {selectedStudentProfile.userName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedStudentProfile.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedStudentProfile.phoneNumber}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedStudentProfile.address}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {selectedStudentProfile.gender}
              </Typography>
            </DialogContentText>
          ) : (
            <DialogContentText>Loading...</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={dialogOpens} onClose={handleCloseDialog}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <CardContent>
              <div className="mb-2">
                <Typography
                  sx={{ fontWeight: "bold" }}
                  className="text-center"
                  color="text.secondary"
                >
                  <strong>Subject: </strong>
                  {selectedBooking.subjectName}
                </Typography>
              </div>
              <Typography color="text.secondary">
                <strong>Create Date: </strong>{" "}
                {convertToDate(selectedBooking.createdDate)}
              </Typography>

              <Typography color="text.secondary">
                <strong>Grade: </strong>
                {selectedBooking.levelName}
              </Typography>
              <Typography color="text.secondary">
                <strong>Start Date: </strong>
                {formatDate(selectedBooking.startDate)}
              </Typography>

              <Typography color="text.secondary">
                <strong>Total slots: </strong>
                {selectedBooking.numOfSlots}
              </Typography>
              <Typography color="text.secondary">
                <strong>Completed Date: </strong>
                {formatDate(calculateCompletedDate(selectedBooking))}
              </Typography>

              <Typography color="text.secondary">
                <strong>Price Per Slot: </strong>
                {formatPrice(selectedBooking.pricePerSlot, "VND")}
              </Typography>
              <Typography color="text.secondary">
                <strong>Description: </strong>
                {selectedBooking.description}
              </Typography>

              <Typography color="text.secondary">
                <strong>Status: </strong> {selectedBooking.status}
              </Typography>

              <Divider className="my-3 bg-black" />

              <Typography variant="h6" color="textSecondary">
                Schedule
              </Typography>
              {selectedBooking.schedules.map((schedule, index) => (
                <Box key={index} mt={2}>
                  <Typography color="textSecondary">
                    Day: <strong>{schedule.dayOfWeek}</strong>
                  </Typography>
                  <Typography color="textSecondary">
                    Time: <strong>{schedule.startTime}</strong>
                  </Typography>
                  <Typography color="textSecondary">
                    Duration: <strong>{schedule.duration}</strong>
                  </Typography>
                </Box>
              ))}
            </CardContent>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}
