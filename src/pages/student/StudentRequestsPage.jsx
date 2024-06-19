import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { GetAllBookingsByStatus } from "../../services/ApiServices/BookingService";
import parseJwt from "../../services/parseJwt";
import { Link } from "react-router-dom";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);

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
                <Typography color="text.secondary">
                  Number of Tutors applying:{" "}
                  <strong>
                    {
                      request.bookingUsers.filter((item) => {
                        return item.role === "Tutor";
                      }).length
                    }
                  </strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>{" "}
    </Container>
  );
}
