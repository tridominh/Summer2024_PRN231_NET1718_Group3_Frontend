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
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  GetAllUsers,
  UpdateUserInfo,
} from "../../services/ApiServices/UserService";
import { GetBookingUsersByUserId } from "../../services/ApiServices/BookingUserService";

function AdminStudentsManagement({ id }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const TABLE_HEAD = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Gender",
    "Address",
    "Status",
    "Booking Status",
    "Actions",
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchBookingStatus = async (id) => {
    try {
      const bookingUsers = await GetBookingUsersByUserId(id);
      if (bookingUsers.length > 0) {
        return "In booking";
      } else {
        return "Not in booking";
      }
    } catch (error) {
      console.error("Error fetching booking status:", error);
      return "Unknown";
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await GetAllUsers();
      const students = data.filter((user) => user.role === "Student");

      // Fetch and add booking status to each student
      const studentsWithBookingStatus = await Promise.all(
        students.map(async (student) => {
          const bookingStatus = await fetchBookingStatus(student.id);
          return { ...student, bookingStatus };
        }),
      );

      setStudents(studentsWithBookingStatus);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (student.bookingStatus === "Not in booking") {
      try {
        await UpdateUserInfo({
          id: studentId,
          receiverName: student.name,
          email: student.email,
          address: student.address,
          phoneNumber: student.phone,
          gender: student.gender,
          status: "Inactive",
          avatar: student.avatar,
        });
        fetchStudents();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error updating student:", error);
      }
    } else {
      setSnackbarMessage("This user is in booking, you cannot delete!");
      setSnackbarOpen(true);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedStudent(null);
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setStudentToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <Card sx={{ minHeight: "100%", width: "100%" }}>
      <CardHeader
        title="Students List"
        subheader="See information about all students"
      />
      <CardContent>
        <table
          style={{ width: "100%", minWidth: "600px", tableLayout: "auto" }}
        >
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <Typography variant="subtitle2">{head}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">
                    <Link
                      to={`/AdminUserDetail/${student.id}`}
                      style={{ textDecoration: "none", color: "#1976D2" }}
                    >
                      {student.id}
                    </Link>
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.name}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.email}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.phone}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.gender}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.address}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{student.status}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">
                    {student.bookingStatus}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Tooltip title="View Student">
                    <IconButton onClick={() => handleViewStudent(student)}>
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Student">
                    <IconButton onClick={() => handleOpenDeleteDialog(student)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        className="lime-dialog"
      >
        <DialogTitle className="lime-dialog-title">Student Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStudent && (
              <>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedStudent.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedStudent.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedStudent.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {selectedStudent.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {selectedStudent.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {selectedStudent.status}
                </Typography>
                <Typography variant="body1">
                  <strong>Booking Status:</strong>{" "}
                  {selectedStudent.bookingStatus}
                </Typography>
                <Typography variant="body1">
                  <strong>Avatar:</strong>{" "}
                  <img
                    src={selectedStudent.avatar}
                    alt={`${selectedStudent.name}'s avatar`}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                    }}
                  />
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="lime-dialog-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete student {studentToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteStudent(studentToDelete.id)}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default AdminStudentsManagement;
