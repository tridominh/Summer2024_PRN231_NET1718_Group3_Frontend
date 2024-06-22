import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
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
      <Grid item xs={12} sm={6} md={4}>
        <Card className="p-4 border border-black rounded-md shadow-md">
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
              Number Of Slots: <strong>{booking.numOfSlots}</strong>
            </Typography>
            <Typography color="text.secondary">
              Price Per Slot: <strong>{booking.pricePerSlot}</strong>
            </Typography>
            <Typography color="text.secondary">
              Description: <strong>{booking.description}</strong>
            </Typography>

            <Typography color="text.secondary">
              Status: <strong>{booking.status}</strong>
            </Typography>
            <Typography
              color="blue"
              textAlign={"right"}
              className="mt-2 underline"
            ></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
