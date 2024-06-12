import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GetAllBookingsByStatus } from "../../services/ApiServices/BookingService";
import { GetAllSubjects } from "../../services/ApiServices/SubjectService";
import { GetAllLevels } from "../../services/ApiServices/LevelService";
import { GetAllBookingUsers } from "../../services/ApiServices/BookingUserService";
import parseJwt from "../../services/parseJwt";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem("token");
        const userId = Number(parseJwt(token).nameid);

        const bookingResponse = await GetAllBookingsByStatus("PENDING");
        const allBookings = bookingResponse.data;
        const bookingUsers = await GetAllBookingUsers();
        const studentBookingIds = bookingUsers
          .filter((bookingUser) => {
            return (
              bookingUser.userId === userId && bookingUser.role === "STUDENT"
            );
          })
          .map((bookingUser) => {
            return bookingUser.bookingId;
          });
        const studentBookings = allBookings.filter((booking) => {
          return studentBookingIds.includes(booking.id);
        });

        const subjectResponse = await GetAllSubjects();
        const subjectData = subjectResponse;

        const levelResponse = await GetAllLevels();
        const levelData = levelResponse;

        setRequests(studentBookings);
        setSubjects(subjectData);
        setLevels(levelData);
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
      <Grid container spacing={3}>
        {requests.map((request, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="p-4 rounded-md shadow-md">
              <CardContent>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  className="text-center"
                  color="text.secondary"
                >
                  Subject:{" "}
                  <strong>
                    {" "}
                    {
                      subjects.find(
                        (s) => s.id === request.subjectLevel.subjectId,
                      ).name
                    }
                  </strong>
                </Typography>
                <Typography color="text.secondary">
                  Level:{" "}
                  <strong>
                    {" "}
                    {
                      levels.find((l) => l.id === request.subjectLevel.levelId)
                        .levelName
                    }
                  </strong>
                </Typography>
                <Typography color="text.secondary">
                  Description: <strong>{request.description}</strong>
                </Typography>
                <Typography color="text.secondary">
                  Status: <strong>{request.status}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>{" "}
    </Container>
  );
}
