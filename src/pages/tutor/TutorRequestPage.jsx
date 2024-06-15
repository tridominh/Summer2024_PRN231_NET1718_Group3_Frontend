import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import parseJwt from "../../services/parseJwt";
import { ApplyToBooking, GetAllBookingsByStatus } from "../../services/ApiServices/BookingService";
import { GetAllBookingUsers } from "../../services/ApiServices/BookingUserService";

export default function TutorRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem("token");
        const userId = Number(parseJwt(token).nameid);

        const bookingResponse = await GetAllBookingsByStatus("PENDING");
        const allBookings = bookingResponse.data;
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

        setBookings(tutorBookings);
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
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error applying to booking:", error);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="max-w-7xl mx-auto p-4" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3 mt-5">
        Students Requests
      </Typography>
      <Grid container spacing={3}>
        {bookings.map((booking, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="p-4 border border-black rounded-md shadow-md mt-5">
              <CardContent>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  className="text-center"
                  color="text.secondary"
                >
                  Subject: <strong> {booking.subject.name}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Level: <strong> {booking.level.levelName}</strong>
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
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    disabled
                  >
                    Applied
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="Applied successfully, please wait for student response"
      />
    </Container>
  );
}
