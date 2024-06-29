import React, { useEffect, useState } from "react";
import {
  GetAllFeedbacks,
  DeleteFeedback,
} from "../../services/ApiServices/FeedbackService";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Rating,
  Box,
  IconButton,
  Popover,
  MenuItem,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

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
  }, []);

  const handlePopoverOpen = (event, feedbackId) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedbackId(feedbackId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    navigate(`/student/feedback/update/${selectedFeedbackId}`);
    handlePopoverClose();
  };

  const handleDelete = () => {
    setDialogOpen(true);
    handlePopoverClose();
  };

  const confirmDelete = async () => {
    try {
      await DeleteFeedback(selectedFeedbackId);
      // Remove the deleted feedback from the state
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== selectedFeedbackId));
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

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
                    Student: {feedback.student?.userName || "Unknown Student"} - Tutor: {feedback.tutor?.userName || "Unknown Tutor"}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginLeft: 1 }}
                  >
                    Subject: {feedback.subjectName || "Unknown Subject"} - Level: {feedback.levelName || "Unknown Level"}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="more"
                onClick={(e) => handlePopoverOpen(e, feedback.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Popover>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this feedback?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FeedbackList;
