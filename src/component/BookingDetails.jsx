import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BookingDetails({ booking }) {
  const navigate = useNavigate();
  const acceptedBooking = booking?.bookingUsers?.filter((bookingUser) => {
    return bookingUser.role === "TUTOR" && bookingUser.status === "ACCEPTED";
  });

  return (
    <Box component="section">
      <Typography variant="h4" align="center" className="text-violet-800" my-3>
        Booking Details
      </Typography>

      {!booking && (
        <div className="my-3">
          <p>Failed to fetch booking</p>
        </div>
      )}

      {!acceptedBooking && (
        <div className="flex flex-col justify-items-center items-center my-3">
          <p className="text-center">You haven't approved any tutors yet.</p>
          <Button
            onClick={() => navigate("/student/requests")}
            variant="contained"
          >
            Go to Requests
          </Button>
        </div>
      )}
    </Box>
  );
}
