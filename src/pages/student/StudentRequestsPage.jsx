import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);

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
      <List>
        {requests.map((request) => (
          <ListItem key={request.id}>
            <ListItemText
              primary={`Subject: ${request.subject}, Level: ${request.level}`}
              secondary={`Requested on: ${new Date(request.createdAt).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
