import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { DeleteUser, GetAllUsers } from "../../services/ApiServices/UserService";

function AdminTutorsManagement({ id }) {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState(null);

  const TABLE_HEAD = ["ID", "Name", "Email", "Phone", "Address", "Status", "Actions"];

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const data = await GetAllUsers();
      const tutors = data.filter((user) => user.role === "Tutor");
      setTutors(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const handleDeleteTutor = async (tutorId) => {
    try {
      await DeleteUser(tutorId);
      fetchTutors();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  const handleViewTutor = (tutor) => {
    setSelectedTutor(tutor);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTutor(null);
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (tutor) => {
    setTutorToDelete(tutor);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setTutorToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card sx={{ minHeight: "100%", width: "100%" }}>
      <CardHeader title="Tutors List" subheader="See information about all tutors" />
      <CardContent>
        <table style={{ width: "100%", minWidth: "600px", tableLayout: "auto" }}>
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th key={index} style={{ border: "1px solid #E0E0E0", padding: "12px", backgroundColor: "#F5F5F5" }}>
                  <Typography variant="subtitle2">{head}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor.id}>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">
                    <Link to={`/AdminUserDetail/${tutor.id}`} style={{ textDecoration: "none", color: "#1976D2" }}>
                      {tutor.id}
                    </Link>
                  </Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{tutor.name}</Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{tutor.email}</Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{tutor.phone}</Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{tutor.address}</Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{tutor.status}</Typography>
                </td>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Tooltip title="View Tutor">
                    <IconButton onClick={() => handleViewTutor(tutor)}>
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Tutor">
                    <IconButton onClick={() => handleOpenDeleteDialog(tutor)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} className="lime-dialog">
        <DialogTitle className="lime-dialog-title">Tutor Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedTutor && (
              <>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedTutor.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedTutor.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedTutor.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {selectedTutor.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {selectedTutor.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {selectedTutor.status}
                </Typography>
                <Typography variant="body1">
                  <strong>Avatar:</strong> <img
                    src={selectedTutor.avatar}
                    alt={`${selectedTutor.name}'s avatar`}
                    style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                  />
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="lime-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tutor {tutorToDelete?.name}?
            <br></br> 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteTutor(tutorToDelete?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default AdminTutorsManagement;
