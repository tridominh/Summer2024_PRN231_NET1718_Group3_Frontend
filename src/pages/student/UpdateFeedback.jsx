import React, { useState, useEffect } from 'react';
import { GetBookingUserByUserIdFeedback } from '../../services/ApiServices/BookingUserService';
import { GetFeedback, UpdateFeedback as updateFeedbackService } from '../../services/ApiServices/FeedbackService';
import ReactStars from 'react-rating-stars-component';
import { 
  TextField, Button, Typography, Container, Box, Alert, MenuItem, Select, FormControl, InputLabel, Card, CardContent, CardActions 
} from '@mui/material';

const UpdateFeedback = ({ feedbackId, userId }) => {
  const [feedback, setFeedback] = useState({
    id: '',
    tutorId: '',
    studentId: userId,
    subjectName: '',
    levelName: '',
    content: '',
    rating: 0,
  });

  const [bookingUsers, setBookingUsers] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch feedback details by ID
        const fetchedFeedback = await GetFeedback(feedbackId);
        setFeedback(fetchedFeedback);
        setSelectedTutor(fetchedFeedback.tutorId);

        // Fetch booking users
        const bookingUsersData = await GetBookingUserByUserIdFeedback(userId);
        setBookingUsers(bookingUsersData);

        const selectedTutorName = bookingUsersData.find(item => item.bookingId === fetchedFeedback.tutorId)?.user?.userName || '';
        setTutorName(selectedTutorName);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    };

    fetchData();
  }, [feedbackId, userId]);

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
      const feedbackWithStudentId = {
        ...feedback,
        studentId: userId,
      };

      await updateFeedbackService(feedbackWithStudentId);
      setSuccess('Feedback updated successfully!');
    } catch (error) {
      console.error('Error updating feedback:', error);
      setError('Failed to update feedback. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Update Feedback
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
              label="Student ID"
              type="number"
              name="studentId"
              value={feedback.studentId}
              onChange={handleChange}
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="Subject"
              name="subjectName"
              value={feedback.subjectName}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Level"
              name="levelName"
              value={feedback.levelName}
              fullWidth
              margin="normal"
              disabled
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
            <CardActions>
              <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                Update Feedback
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateFeedback;
