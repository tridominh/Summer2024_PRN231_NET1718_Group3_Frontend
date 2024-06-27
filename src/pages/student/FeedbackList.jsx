import React, { useEffect, useState } from "react";
import {
  GetAllFeedbacks,
} from "../../services/ApiServices/FeedbackService";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Rating,
  Box,
} from "@mui/material";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Function to fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const data = await GetAllFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []); // Fetch feedbacks on component mount

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Feedback List
      </Typography>
      <List>
        {feedbacks.map((feedback) => (
          <ListItem
            key={feedback.id}
            disableGutters
            sx={{ borderBottom: "1px solid #ddd" }}
          >
            <ListItemText
              primary={`Content: ${feedback.content}`}
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    sx={{ marginRight: 1 }}
                  >
                    Rating:
                  </Typography>
                  <Rating
                    name={`rating-${feedback.id}`}
                    value={feedback.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginLeft: 1 }}
                  >
                    Student ID: {feedback.studentId} - Tutor ID:{" "}
                    {feedback.tutorId}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FeedbackList;
