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
} from "@mui/material";
import { Link } from "react-router-dom";

import parseJwt from "../../services/parseJwt";
import { ApplyToBooking, CancelApplication, GetAllBookings } from "../../services/ApiServices/BookingService";
import { GetAllBookingUsers } from "../../services/ApiServices/BookingUserService";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TutorRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  const [appliedBookings, setAppliedBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem("token");
        const userId = Number(parseJwt(token).nameid);

        const bookingResponse = await GetAllBookings();
        const allBookings = bookingResponse;
        const bookingUsers = await GetAllBookingUsers();
        const tutorBookingIds = bookingUsers
          .filter(
            (bookingUser) =>
              bookingUser.userId === userId 
                    )
          .map((bookingUser) => bookingUser.bookingId);

        const tutorBookings = allBookings.map((booking) => ({
          ...booking,
          tutorApplied: tutorBookingIds.includes(booking.id),
        }));
        const tutorAppliedBookingIds = bookingUsers
        .filter(
          (bookingUser) =>
            bookingUser.userId === userId && bookingUser.status === "APPLIED"
        )
        .map((bookingUser) => bookingUser.bookingId);

      const appliedBookings = allBookings
        .filter((booking) => tutorAppliedBookingIds.includes(booking.id))
        .map((booking) => ({
          ...booking,
          tutorApplied: true,
        }));

        console.log(appliedBookings);
        console.log(appliedBookings);
        setBookings(tutorBookings);
        setAllBookings(tutorBookings);
        setAppliedBookings(appliedBookings);
        setApprovedBookings(tutorBookings.filter((booking) => booking.status === "APPROVED"));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchBookings();
  }, []);

  const handleApply = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(parseJwt(token).nameid);
  
      const applyBookingDto = {
        bookingId: bookingId,
        userId: userId,
      };
  
      const response = await ApplyToBooking(applyBookingDto);
  
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, tutorApplied: true };
        }
        return booking;
      });
  
      setBookings(updatedBookings);
      setSnackbarMessage('Applied successfully, please wait for student response');
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
  
      const response = await CancelApplication(cancelBookingDto);
  
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, tutorApplied: false };
        }
        return booking;
      });
  
      setBookings(updatedBookings);
      setSnackbarMessage('Application canceled successfully');
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
        <Card className="p-4 border border-black rounded-md shadow-md mt-5">
          <CardContent>
            <Typography
              sx={{ fontWeight: "bold" }}
              className="text-center"
              color="text.secondary"
            >
              Subject: <strong> {booking.subjectName}</strong>
            </Typography>
            <Typography color="text.secondary">
              Level: <strong> {booking.levelName}</strong>
            </Typography>
            <Typography color="text.secondary">
              Description: <strong>{booking.description}</strong>
            </Typography>
            <Typography color="text.secondary">
              Status: <strong>{booking.status}</strong>
            </Typography>
            <Typography color="text.secondary" textAlign={"right"} className="mt-2">
              <Link to="#" underline="hover">
                View more
              </Link>
            </Typography>
            {!booking.tutorApplied ? (
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                onClick={() => handleApply(booking.id)}
              >
                Apply
              </Button>
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
      <Typography variant="h4" align="center" className="text-violet-800 my-3 mt-5">
        Students Requests
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}
