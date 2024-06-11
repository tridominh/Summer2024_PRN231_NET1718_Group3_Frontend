import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GetAllBookingsByStatus } from "../../services/ApiServices/BookingService";
import { GetAllSubjects } from "../../services/ApiServices/SubjectService";
import { GetAllLevels } from "../../services/ApiServices/LevelService";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const bookingResponse = await GetAllBookingsByStatus("PENDING");
        const bookingData = bookingResponse.data;

        const subjectResponse = await GetAllSubjects();
        const subjectData = subjectResponse;

        const levelResponse = await GetAllLevels();
        const levelData = levelResponse;

        setRequests(bookingData);
        setSubjects(subjectData);
        setLevels(levelData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
    fetchRequests();
  }, []);

  return (
    <Container maxWidth="sm" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3">
        Your Requests
      </Typography>
      <Grid container spacing={3}>
        {requests.map((request, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  Subject:{" "}
                  {
                    subjects.find(
                      (s) => s.id === request.subjectLevel.subjectId,
                    ).name
                  }
                </Typography>
                <Typography color="text.secondary">
                  Level:{" "}
                  {
                    levels.find((l) => l.id === request.subjectLevel.levelId)
                      .levelName
                  }
                </Typography>
                <Typography color="text.secondary">
                  Description: {request.description}
                </Typography>
                <Typography color="text.secondary">
                  Status: {request.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>{" "}
    </Container>
  );
}
