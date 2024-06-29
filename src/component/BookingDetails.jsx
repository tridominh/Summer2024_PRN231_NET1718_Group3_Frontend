import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { formatDate, formatPrice } from "../services/utils";
import {
  CheckCreditService,
  PayService,
  TransferMoney,
} from "../services/ApiServices/VnpayService";
import {
  UpdateBookingStatus,
  calculateCompletedDate,
} from "../services/ApiServices/BookingService";
import { GetUserInfo } from "../services/ApiServices/UserService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function BookingDetails({ booking, userId, handleNext }) {
  const navigate = useNavigate();
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirmCredit, setOpenConfirmCredit] = useState(false);
  const [needCredit, setNeedCredit] = useState(0);
  const [acceptedTutors, setAcceptedTutors] = useState([]);
  const [tutorProfile, setTutorProfile] = useState();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchTutorProfile() {
      const acceptedTutor = booking?.bookingUsers?.find(
        (bookingUser) =>
          bookingUser.role === "TUTOR" && bookingUser.status === "APPROVED",
      );
      const tutorProfile = await GetUserInfo(acceptedTutor?.userId);
      setTutorProfile(tutorProfile);
    }

    if (booking) {
      const acceptedTutors = booking?.bookingUsers?.filter(
        (bookingUser) =>
          bookingUser.role === "TUTOR" && bookingUser.status === "APPROVED",
      );
      setAcceptedTutors(acceptedTutors);

      fetchTutorProfile();
    }
  }, [booking]);

  const tutorId = booking?.bookingUsers?.find(
    (bookingUser) => bookingUser.role === "TUTOR",
  )?.userId;

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const handleCloseConfirmPayment = () => {
    setOpenConfirmPayment(false);
  };

  const handleConfirmPayment = () => {
    processPayment();
  };

  const handleCloseConfirmCredit = () => {
    setOpenConfirmCredit(false);
  };

  const handleConfirmCredit = () => {
    addCredit();
  };

  const addCredit = async () => {
    try {
      let payDto = {
        userId: parseInt(userId),
        amount: needCredit,
        orderInfo: "Add Credit",
      };
      const response = await PayService(payDto);
      window.location.href = response.data;
      handleCloseConfirmCredit();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const processPayment = async () => {
    try {
      let payDto = {
        userId: parseInt(userId),
        amount: booking.pricePerSlot * booking.numOfSlots,
        orderInfo: "Booking Payment",
      };
      const response = await CheckCreditService(payDto);
      setOpenConfirmPayment(false);
      await TransferMoney({
        userId: parseInt(userId),
        receiverId: tutorId,
        amount: booking.pricePerSlot * booking.numOfSlots,
        orderInfo: "Booking Payment",
      });
      await UpdateBookingStatus({
        bookingId: booking.id,
        status: "PAID",
      });
      setOpenSnackbar(true);
      handleNext();
    } catch (error) {
      if (error.response.status === 400) {
        setNeedCredit(parseInt(error.response.data));
        setOpenConfirmPayment(false);
        setOpenConfirmCredit(true);
      }
      console.error(error);
    }
  };

  return (
    <Box component="section" p={4}>
      <div>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Booking Details
        </Typography>
      </div>
      {!booking && (
        <Box textAlign="center" my={3}>
          <Typography variant="h6" color="error">
            Failed to fetch booking
          </Typography>
        </Box>
      )}
      {acceptedTutors.length === 0 && (
        <Box display="flex" flexDirection="column" alignItems="center" my={3}>
          <Typography variant="h6" align="center" gutterBottom>
            You haven't approved any tutors yet.
          </Typography>
          <Button
            onClick={() => navigate("/student/requests")}
            variant="contained"
            color="primary"
          >
            Go to Requests
          </Button>
        </Box>
      )}
      {booking && (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "25vh" }}
        >
          <Grid item xs={12} sm={8} md={6}>
            <Card className="p-4 border border-black rounded-md shadow-md">
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Subject: <strong>{booking.subjectName}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Level: <strong>{booking.levelName}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Start Date: <strong>{formatDate(booking.startDate)}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Number Of Slots: <strong>{booking.numOfSlots}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Completed Date:
                  <strong>{formatDate(calculateCompletedDate(booking))}</strong>
                </Typography>

                <Typography color="textSecondary">
                  Price Per Slot:{" "}
                  <strong>{formatPrice(booking.pricePerSlot, "VND")}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Total Price:{" "}
                  <strong>
                    {formatPrice(
                      booking.pricePerSlot * booking.numOfSlots,
                      "VND",
                    )}
                  </strong>
                </Typography>
                <Typography color="textSecondary">
                  Description: <strong>{booking.description}</strong>
                </Typography>
                <Typography color="textSecondary">
                  Your Tutor:{" "}
                  <strong>
                    {tutorProfile ? tutorProfile.userName : "No Information"}
                  </strong>
                </Typography>
                <Typography color="textSecondary">
                  Status: <strong>{booking.status}</strong>
                </Typography>
              </CardContent>
              <Accordion
                className="border border-black"
                onClick={toggleAccordion}
                expanded={expanded}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" color="textSecondary">
                    Schedule
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {booking.schedules.map((schedule, index) => (
                    <Box key={index} mt={2}>
                      <Typography color="textSecondary">
                        Day: <strong>{schedule.dayOfWeek}</strong>
                      </Typography>
                      <Typography color="textSecondary">
                        Time: <strong>{schedule.startTime}</strong>
                      </Typography>
                      <Typography color="textSecondary">
                        Duration: <strong>{schedule.duration}</strong>
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Card>
            <Box mt={2} textAlign="center">
              <Button
                onClick={() => setOpenConfirmPayment(true)}
                variant="contained"
                color="primary"
                disabled={
                  acceptedTutors.length === 0 || booking.status === "PAID"
                }
              >
                Pay bill
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      <Dialog open={openConfirmPayment} onClose={handleCloseConfirmPayment}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This will use{" "}
            {formatPrice(booking.pricePerSlot * booking.numOfSlots, "VND")} of
            your credit balance.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmPayment} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPayment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmCredit} onClose={handleCloseConfirmCredit}>
        <DialogTitle>Insufficient Credit</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Do you want to add {formatPrice(needCredit, "VND")} to your credit
            balance?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmCredit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCredit} color="primary">
            Add Credit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Payment processed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
