import React, { useEffect, useState } from "react";
import BookingRequestForm from "../../component/BookingRequestForm";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import BookingDetails from "../../component/BookingDetails";
import { useNavigate, useParams } from "react-router-dom";
import { GetAllBookings } from "../../services/ApiServices/BookingService";

const steps = [
  "Enter your request details",
  "Check Booking Details",
  "Finish Booking",
];

export default function StudentBookingRequest({ userId }) {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    async function fetchApprovedBooking() {
      if (id != null) {
        const allBookings = await GetAllBookings();
        const approvedBooking = allBookings.find((booking) => {
          return booking.id == id;
        });

        setBooking(approvedBooking);
        setActiveStep(1);
      }
    }

    fetchApprovedBooking();
  }, [id]);

  const isStepCompleted = (step) => {
    return completed.has(step);
  };

  const handleNext = () => {
    let newCompleted = completed;
    if (isStepCompleted(activeStep)) {
      newCompleted = new Set(newCompleted.values());
      newCompleted.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompleted(newCompleted);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper sx={{ marginY: "3rem" }} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepCompleted(index)) {
            stepProps.completed = true;
          }

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }} align="center">
            Thanks for choosing our service :)
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" my={3}>
          <Button onClick={() => navigate("/student/requests")} variant="contained" color="primary">
            Go to Requests
          </Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && <BookingRequestForm token={token} />}
          {activeStep === 1 && <BookingDetails booking={booking} userId={userId} handleNext={handleNext}/>}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0 || activeStep === 2 || activeStep === 1}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            <Button disabled={activeStep === 1 || activeStep === 0  } onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
