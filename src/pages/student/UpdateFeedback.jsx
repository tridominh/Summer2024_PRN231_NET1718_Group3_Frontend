import React, { useState, useEffect } from 'react';
import { GetFeedback, UpdateFeedback as updateFeedbackService } from '../../services/ApiServices/FeedbackService'; // Adjust the path as necessary
import ReactStars from 'react-rating-stars-component';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const UpdateFeedback = ({ feedbackId, userId }) => {
  const [feedback, setFeedback] = useState({
    id: '',
    tutorId: '',
    studentId: '',
    content: '',
    rating: 0, // Initialize rating as 0
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const fetchedFeedback = await GetFeedback(feedbackId);
        setFeedback(fetchedFeedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to fetch feedback details. Please try again.');
      }
    };

    fetchFeedback();
  }, [feedbackId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value,
    });
  };

  const handleRatingChange = (newRating) => {
    setFeedback({
      ...feedback,
      rating: newRating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
// Append userId to feedback as StudentId
const feedbackWithStudentId = {
  ...feedback,
  studentId: userId, // Append userId as StudentId
};

      const response = await updateFeedbackService(feedback);
      setSuccess('Feedback updated successfully!');
    } catch (error) {
      console.error('Error updating feedback:', error);
      setError('Failed to update feedback. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Update Feedback
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tutor ID"
          type="number"
          name="tutorId"
          value={feedback.tutorId}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Student ID"
          type="number"
          name="studentId"
          value={feedback.studentId}
          onChange={handleChange}
          disabled // Student ID should not be editable in update mode
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          name="content"
          value={feedback.content}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Box sx={{ my: 2 }}>
          <Typography component="legend">Rating</Typography>
          <ReactStars
            count={5}
            value={feedback.rating}
            onChange={handleRatingChange}
            size={36}
            activeColor="#ffd700"
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Update Feedback
        </Button>
      </form>
    </Container>
  );
};

export default UpdateFeedback;