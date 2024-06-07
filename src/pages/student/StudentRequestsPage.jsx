import {
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const sampleRequests = [
    {
      username: "john_doe",
      subject: "Access Request",
      level: "High",
      status: "Pending",
    },
    {
      username: "jane_smith",
      subject: "Bug Report",
      level: "Medium",
      status: "Resolved",
    },
    {
      username: "alice_jones",
      subject: "Feature Request",
      level: "Low",
      status: "In Progress",
    },
    {
      username: "bob_brown",
      subject: "Support Ticket",
      level: "High",
      status: "Closed",
    },
  ];

  useEffect(() => {
    // Fetch user requests from API
    async function fetchRequests() {
      try {
        const response = await fetch("/api/requests");
        const data = await response.json();
        setRequests(data);
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
      <Grid container spacing={2}>
        {sampleRequests.map((request, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="min-h-72 w-full p-6">
              <CardContent>
                <Typography variant="h6" component="div" className="font-bold">
                  Username: {request.username}
                </Typography>
                <Typography color="text.secondary">
                  Subject: {request.subject}
                </Typography>
                <Typography color="text.secondary">
                  Level: {request.level}
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
