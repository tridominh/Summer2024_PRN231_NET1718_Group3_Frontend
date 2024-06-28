import React, { useState, useEffect } from 'react';
import { GetBookingUserByUserIdFeedback } from '../../services/ApiServices/BookingUserService'; 
import { AddFeedback as addFeedbackService } from '../../services/ApiServices/FeedbackService';
import ReactStars from 'react-rating-stars-component';
import { TextField, Button, Typography, Container, Box, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AddFeedback = ({ userId }) => {
  const [feedback, setFeedback] = useState({
    tutorId: '',
    studentId: userId,
    subjectName: '',
    levelName: '',
    content: '',
    rating: 0,
  });

  const [bookingUsers, setBookingUsers] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBookingUsers = async () => {
      try {
        const data = await GetBookingUserByUserIdFeedback(userId);
        setBookingUsers(data);
      } catch (error) {
        console.error('Error fetching booking users:', error);
        // Handle error (e.g., display an error message to the user)
      }
    };

    fetchBookingUsers();
  }, [userId]);

  const handleTutorChange = (event) => {
    const tutorId = event.target.value;
    const selectedBooking = bookingUsers.find(bu => bu.bookingId === tutorId);

    setSelectedTutor(tutorId);
    setFeedback({
      ...feedback,
      tutorId,
      subjectName: selectedBooking.booking.subject.name,
      levelName: selectedBooking.booking.level.levelName,
    });
  };

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
        studentId: parseInt(userId), // Append userId as StudentId
      };

      const response = await addFeedbackService(feedbackWithStudentId);
      setSuccess('Feedback added successfully!');
      // Clear the form after submission
      setFeedback({
        tutorId: '',
        studentId: '',
        SubjectName: '',
        LevelName:  '',
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Tutor</InputLabel>
          <Select value={selectedTutor} onChange={handleTutorChange}>
            {bookingUsers.map(bu => (
              <MenuItem key={bu.userId} value={bu.bookingId}>
                {bu.user.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
         <TextField
          type="hidden"
          name="studentId"
          value={userId}
        />
        <TextField
          label="Subject"
          name="subjectName"
          fullWidth
          margin="normal"
          value={feedback.subjectName}
        />
        <TextField 
          label="Level"
          name="levelName"
          fullWidth
          margin="normal"
          value={feedback.levelName}
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
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, mb: 7 }}>
          Add Feedback
        </Button>
      </form>
    </Container>
  );
};

export default AddFeedback;
