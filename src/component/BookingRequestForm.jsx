import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { GetAllSubjects } from "../services/ApiServices/SubjectService";
import { GetAllLevels } from "../services/ApiServices/LevelService";
import parseJwt from "../services/parseJwt";
import { CreateBooking } from "../services/ApiServices/BookingService";

export default function BookingRequestForm({ token, setNotLogin }) {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    description: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const subjectsResponse = await GetAllSubjects();
        const levelsResponse = await GetAllLevels();
        const subjectsData = await subjectsResponse;
        const levelsData = await levelsResponse;

        setSubjects(subjectsData);
        setLevels(levelsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      console.log("User is not logged in, navigating to #login-signup");
      setNotLogin(true);
      window.location.hash = "#login-signup";
      return;
    }

    const bookingDto = {
      userId: Number(parseJwt(accessToken).nameid),
      subjectId: formData.subject,
      levelId: formData.level,
      description: formData.description,
    };

    const response = await CreateBooking(bookingDto);

    if (response.ok) {
      const addedBooking = response.data;

      console.log(addedBooking);
    }
    navigate("/student/requests");
  };

  return (
    <Container maxWidth="sm" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3">
        Post Booking Request
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <FormControl fullWidth variant="outlined" className="bg-gray-50">
          <InputLabel id="subject">Subject</InputLabel>
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
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" className="bg-gray-50">
          <InputLabel id="level">Level</InputLabel>
          <Select
            labelId="level"
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="bg-gray-50"
          >
            <MenuItem value="">
              <em>Choose Level</em>
            </MenuItem>
            {levels.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.levelName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="description"
          fullWidth
          variant="outlined"
          className="bg-gray-50"
          id="outlined-controlled"
          label="Description"
          onChange={handleChange}
        />
        <Button
          fullWidth
          type="submit"
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
