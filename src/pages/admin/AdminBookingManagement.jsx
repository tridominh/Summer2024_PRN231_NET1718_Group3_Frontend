import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import moment from "moment/moment";
import { GetAllBookingsByStatus, UpdateBookingStatus } from "../../services/ApiServices/BookingService";
import { TransferMoneyTutor } from "../../services/ApiServices/VnpayService";
import { GetUserInfo, SendStatusMailTransfermoneyForTeaching } from "../../services/ApiServices/UserService";
import { GetAllByTypeTransaction } from "../../services/ApiServices/TransactionService";

function AdminBookingManagement({ id, showTransfer, handleAdminDeposit }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const TABLE_HEAD = [
    "ID",
    "Date",
    "Payment Method",
    "Tutor Id",
    "Student Id",
    "Number of Slots",
    "Total Price",
    "Actions",
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (showTransfer) {
        const datas = await GetAllBookingsByStatus("PAID");
        setBookings(datas.data);
      } else {
        const data = await GetAllBookingsByStatus("TRANSFERRED");
        setBookings(data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleTransferMoney = async (booking) => {
    try {
      const data = await TransferMoneyTutor({
        userId: booking.bookingUsers.filter((bookingUser) => bookingUser.role === "TUTOR")[0].userId,
        amount: booking.pricePerSlot * booking.numOfSlots,
        orderInfo: "Transfer"
      });
      await UpdateBookingStatus({
        bookingId: booking.id,
        status: "TRANSFERRED"
      });

      const user = await GetUserInfo(booking.bookingUsers.filter((bookingUser) => bookingUser.role === "TUTOR")[0].userId);
      await SendStatusMailTransfermoneyForTeaching(
        {
          email: user.email,
        }
      )

      const transferType = await GetAllByTypeTransaction("TRANSFER");
      const adminShare = transferType.amount;

      setSnackbarMessage("Transfer and email send successfully");
      setSnackbarOpen(true);
      fetchBookings();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      }
      console.error("Error fetching students:", err);
    }
  };

  return (
    <Card sx={{ minHeight: "100%", width: "100%" }}>
      <CardHeader
        title={showTransfer?"Booking List":"Recent Transferred Bookings"}
        subheader={showTransfer?"See information about paid bookings":""}
      />
      <CardContent>
        <table style={{ width: "100%", minWidth: "600px", tableLayout: "auto" }}>
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
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td style={{ border: "1px solid #E0E0E0", padding: "12px" }}>
                  <Typography variant="body2">{booking.id}</Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">{moment(booking.createdDate).format("DD-MM-yyyy")}</Typography>
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
                  <Typography variant="body2">
                    {booking.bookingUsers.filter((user) => user.role === "TUTOR")[0].userId}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  <Typography variant="body2">
                    {booking.bookingUsers.filter((user) => user.role === "STUDENT")[0].userId}
                  </Typography>
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
                    {booking.pricePerSlot * booking.numOfSlots}
                  </Typography>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #E0E0E0",
                    padding: "12px",
                  }}
                >
                  {showTransfer && <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTransferMoney(booking)}
                  >
                    Transfer money to tutor
                  </Button>}
                  <Button
                    style={{ marginLeft: "5px" }}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDialogOpen(booking)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-red-500">{error}</div>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {selectedBooking && (
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="booking-dialog-title"
        >
          <DialogTitle id="booking-dialog-title">Booking Details</DialogTitle>
          <DialogContent>
            <DialogContentText>ID: {selectedBooking.id}</DialogContentText>
            <DialogContentText>
              Payment Method: {selectedBooking.paymentMethod}
            </DialogContentText>
            <DialogContentText>
              Tutor Id: {selectedBooking.bookingUsers.filter((user) => user.role === "TUTOR")[0].userId}
            </DialogContentText>
            <DialogContentText>
              Student Id: {selectedBooking.bookingUsers.filter((user) => user.role === "STUDENT")[0].userId}
            </DialogContentText>
            <DialogContentText>
              Subject: {selectedBooking.subjectName}
            </DialogContentText>
            <DialogContentText>
              Level: {selectedBooking.levelName}
            </DialogContentText>
            <DialogContentText>
              Number of Slots: {selectedBooking.numOfSlots}
            </DialogContentText>
            <DialogContentText>
              Total Price: {selectedBooking.pricePerSlot * selectedBooking.numOfSlots}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
}

export default AdminBookingManagement;
