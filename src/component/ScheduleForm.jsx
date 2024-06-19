import React, { useState } from "react";
import { MenuItem, TextField, Button, Grid, IconButton } from "@mui/material";
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

export default function ScheduleForm() {
  const [schedules, setSchedules] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);

  const handleAddSchedule = () => {
    setSchedules([...schedules, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveSchedule = (index) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  return (
    <div className="p-4 w-full">
      <TextField
        label="Duration (minutes)"
        type="number"
        onChange={(e) => handleScheduleChange("duration", e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: 0,
        }}
      />

      {schedules.map((schedule, index) => (
        <Grid container spacing={2} key={index} className="mb-4">
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Time"
              type="time"
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
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Time"
              type="time"
              value={schedule.endTime}
              onChange={(e) =>
                handleScheduleChange(index, "endTime", e.target.value)
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
          <Grid item xs={12} sm={3}>
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
    </div>
  );
}
