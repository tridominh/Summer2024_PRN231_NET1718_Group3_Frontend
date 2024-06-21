import React, { useState } from "react";
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

const steps = [
  "Enter your request details",
  "Check Booking Details",
  "Finish Booking",
];

export default function StudentBookingRequest() {
  const token = localStorage.getItem("token");
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());

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
      <Stepper activeStep={activeStep}>
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
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {activeStep === 0 && <BookingRequestForm token={token} />}
          {activeStep === 1 && <BookingDetails />}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
