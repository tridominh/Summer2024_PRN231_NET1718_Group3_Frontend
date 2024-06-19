import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
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
import { Delete } from "@mui/icons-material";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BookingRequestForm({ token }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    description: "",
    numOfWeeks: 0,
    duration: "00:00",
    pricePerSlot: 0,
  });
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [schedules, setSchedules] = useState([
    { day: "", startTime: "00:00:00", endTime: "00:00:00" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const subjectsResponse = await GetAllSubjects();
        const levelsResponse = await GetAllLevels();

        setSubjects(subjectsResponse);
        setLevels(levelsResponse);
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

    console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      console.log("User is not logged in, navigating to #login-signup");
      window.location.hash = "#login-signup";
      return;
    }

    const bookingDto = {
      userId: Number(parseJwt(token).nameid),
      subjectId: formData.subject,
      levelId: formData.level,
      numOfSlots: formData.numOfWeeks * schedules.length,
      pricePerSlot: formData.pricePerSlot,
      description: formData.description,
    };

    const bookingCreateResponse = await CreateBooking(bookingDto);
    console.log(bookingCreateResponse);

    navigate("/student/requests");
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveSchedule = (index) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  const calculateEndTime = (start, interval) => {
    if (!start || !interval) return "";

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [intervalHours, intervalMinutes] = interval.split(":").map(Number);

    if (
      isNaN(startHours) ||
      isNaN(startMinutes) ||
      isNaN(intervalHours) ||
      isNaN(intervalMinutes)
    ) {
      return "";
    }

    const startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    const endDate = new Date(
      startDate.getTime() + intervalHours * 3600000 + intervalMinutes * 60000,
    );

    const endHours = String(endDate.getHours()).padStart(2, "0");
    const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;

    if (field === "startTime") {
      newSchedules[index]["endTime"] = calculateEndTime(
        value,
        formData.duration,
      );
    }

    setSchedules(newSchedules);
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
        <Typography sx={{ fontWeight: "bold" }} align="left" variant="body1">
          Subject Info
        </Typography>
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
        <Typography sx={{ fontWeight: "bold" }} align="left" variant="body1">
          Schedule
        </Typography>
        <TextField
          name="numOfWeeks"
          fullWidth
          variant="outlined"
          className="bg-gray-50"
          id="outlined-controlled"
          label="Number of Weeks"
          onChange={handleChange}
        />
        <TextField
          label="Slot Duration"
          name="duration"
          fullWidth
          type="text"
          value={formData.duration}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            pattern: "[0-9]{2}:[0-9]{2}",
            placeholder: "HH:MM",
          }}
        />
        {schedules.map((schedule, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{ width: "100%" }}
            className="mb-4"
          >
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Day"
                value={schedule.day}
                onChange={(e) =>
                  handleScheduleChange(index, "day", e.target.value)
                }
                fullWidth
                variant="outlined"
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Time"
                type="time"
                name="startTime"
                value={schedule.startTime}
                onChange={(e) =>
                  handleScheduleChange(index, "startTime", e.target.value)
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                disabled
                label="End Time"
                type="time"
                value={schedule.endTime}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              {index > 0 && (
                <IconButton
                  onClick={() => handleRemoveSchedule(index)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddSchedule}>
          Add Schedule
        </Button>
        <Typography sx={{ fontWeight: "bold" }} variant="body1" align="left">
          Price
        </Typography>
        <TextField
          type="number"
          name="pricePerSlot"
          fullWidth
          variant="outlined"
          className="bg-gray-50"
          id="outlined-controlled"
          label="Budget Per Slot"
          onChange={handleChange}
        />
        <Typography sx={{ fontWeight: "bold" }} variant="body1" align="left">
          Other
        </Typography>
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
