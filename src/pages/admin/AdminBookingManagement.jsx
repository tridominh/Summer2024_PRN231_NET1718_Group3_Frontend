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
import { GetAllBookingsByStatus, UpdateBookingStatus } from "../../services/ApiServices/BookingService";
import { TransferMoneyTutor } from "../../services/ApiServices/VnpayService";

function AdminBookingManagement({ id }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

const TABLE_HEAD = [
    "ID",
    "Payment Method",
    "Tutor Id",
    "Student Id",
    "Subject",
    "Level",
    "Number of Slots",
    "Total Price",
    "Actions",
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  /*const fetchBookingStatus = async (id) => {
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
  };*/

  const fetchBookings= async () => {
    try {
      const data = await GetAllBookingsByStatus("PAID");
      //const students = data;

      // Fetch and add booking status to each student

      setBookings(data.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleTransferMoney = async (booking) => {
    try {
      const data = await TransferMoneyTutor({
        userId: booking.bookingUsers
          .filter((bookingUser) => bookingUser.role === "TUTOR")[0].userId, 
        amount: booking.pricePerSlot * booking.numOfSlots,
        orderInfo: "Transfer"
      });
      await UpdateBookingStatus({
          bookingId: booking.id,
          status: "TRANSFERRED"
      })

      fetchBookings();
    } catch (err) {
        
      if (err.response && err.response.data) {
        setError(
          err.response.data
        );
      }
      console.error("Error fetching students:", err);
    }
  };

    return (
    <Card sx={{ minHeight: "100%", width: "100%" }}>
      <CardHeader
        title="Booking List"
        subheader="See information about paid bookings"
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
            {/*JSON.stringify(bookings)*/}
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">
                      {booking.id}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.paymentMethod}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.bookingUsers
                      .filter((user) => user.role === "TUTOR")[0].userId}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.bookingUsers
                      .filter((user) => user.role === "STUDENT")[0].userId}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.subjectName}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.levelName}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{booking.numOfSlots}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">
                    {booking.pricePerSlot*booking.numOfSlots}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTransferMoney(booking)}
                  >
                    Transfer money to tutor
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-red-500">{error}</div>
      </CardContent>
    </Card>
  );
}

export default AdminBookingManagement;
