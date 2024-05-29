import { TextFields } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function StudentBookingRequest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    subject: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="sm" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3">
        Tutor Booking Request
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-gray-50"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          type="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-50"
        />
        <FormControl fullWidth variant="outlined" className="bg-gray-50">
          <InputLabel id="subject">Role</InputLabel>
          <Select
            labelId="subject"
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="bg-gray-50"
          >
            <MenuItem value="">
              <em>Choose Subject</em>
            </MenuItem>
            <MenuItem value="math">Math</MenuItem>
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="Literature">Literature</MenuItem>
          </Select>
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="bg-blue-500 hover:bg-blue-700"
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}
