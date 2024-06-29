import React, { useEffect, useState } from "react";
import { GetAllFeedbacks } from "../../services/ApiServices/FeedbackService";
import { GetBookingUserByUserIdFeedback } from "../../services/ApiServices/BookingUserService";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Rating,
  Box,
  CircularProgress,
  Alert,
  Container
} from "@mui/material";

const FeedbackList = ({ userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingUsers, setBookingUsers] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const data = await GetAllFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedbacks. Please try again later.");
    }
  };

  const fetchBookingUsers = async () => {
    try {
      const data = await GetBookingUserByUserIdFeedback(userId);
      setBookingUsers(data);
    } catch (error) {
      console.error("Error fetching booking users:", error);
      setError("Failed to fetch booking users. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFeedbacks();
      await fetchBookingUsers();
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const getBookingUserDetails = (tutorId) => {
    const bookingUser = bookingUsers.find(bu => bu.bookingId === tutorId);
    if (bookingUser) {
      return {
        tutorName: bookingUser.user.userName,
        subjectName: bookingUser.booking.subject.name,
        levelName: bookingUser.booking.level.levelName
      };
    } else {
      return {
        tutorName: 'Unknown Tutor',
        subjectName: 'Unknown Subject',
        levelName: 'Unknown Level'
      };
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Feedback List
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {feedbacks.map((feedback) => {
              const { tutorName, subjectName, levelName } = getBookingUserDetails(feedback.tutorId);
              return (
                <ListItem
                  key={feedback.id}
                  disableGutters
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <ListItemText
                    primary={`Content: ${feedback.content}`}
                    secondary={
                      <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
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
                        </Box>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Student: {userId} - Tutor: {tutorName}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginTop: 1 }}
                        >
                          Subject: {subjectName} - Level: {levelName}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default FeedbackList;
