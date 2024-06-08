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
  Typography,
} from "@mui/material";
import { GetAllSubjects } from "../../services/ApiServices/SubjectService";
import { GetAllLevels } from "../../services/ApiServices/LevelService";

export default function StudentBookingRequest({ token, setNotLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    level: "",
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

        console.log(subjectsData);
        console.log(levelsData);

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

    navigate("/student/requests");
  };

  return (
    <Container maxWidth="sm" className="my-3">
      <Typography variant="h4" align="center" className="text-violet-800 my-3">
        Tutor Booking Request
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
              <MenuItem key={subject.id} value={subject.name}>
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
              <MenuItem key={level.levelId} value={level.levelName}>
                {level.levelName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
