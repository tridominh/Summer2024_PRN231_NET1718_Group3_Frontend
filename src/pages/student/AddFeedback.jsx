import React, { useState } from 'react';
import { AddFeedback as addFeedbackService } from '../../services/ApiServices/FeedbackService'; // Adjust the path as necessary
import ReactStars from 'react-rating-stars-component';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const AddFeedback = ({ userId }) => {
  const [feedback, setFeedback] = useState({
    tutorId: '',
    studentId: '',
    content: '',
    rating: 0, // Initialize rating as 0
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      const response = await addFeedbackService(feedbackWithStudentId);
      setSuccess('Feedback added successfully!');
      // Clear the form after submission
      setFeedback({
        tutorId: '',
        studentId: '',
        content: '',
        rating: 0, // Reset rating to 0
      });
    } catch (error) {
      setError('Failed to add feedback. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Feedback
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
        {/* Student ID is now hidden and set automatically */}
        <TextField
          type="hidden"
          name="studentId"
          value={userId}
          onChange={handleChange}
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
          Add Feedback
        </Button>
      </form>
    </Container>
  );
};

export default AddFeedback;
