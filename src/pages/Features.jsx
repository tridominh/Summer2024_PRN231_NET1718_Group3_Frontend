import React, { useEffect, useState } from "react";
import {
  GetAllLevels,
  AddLevel,
  UpdateLevel,
} from "../services/ApiServices/LevelService";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  AddSubject,
  GetAllSubjects,
  UpdateSubject,
} from "../services/ApiServices/SubjectService";

export default function Features() {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState({
    id: "",
    levelName: "",
    status: "Active",
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({
    id: "",
    name: "",
    status: "Active",
  });

  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
  const [levelSnackbarOpen, setLevelSnackbarOpen] = useState(false);
  const [subjectSnackbarOpen, setSubjectSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameExistsError, setNameExistsError] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setLevelSnackbarOpen(false);
    setSubjectSnackbarOpen(false);
  };

  const handleOpenLevelDialog = (level = null) => {
    if (level) setSelectedLevel(level);
    else
      setSelectedLevel({
        id: "",
        levelName: "",
        status: "Active",
      });
    setOpenLevelDialog(true);
  };

  const handleOpenSubjectDialog = (subject = null) => {
    if (subject) setSelectedSubject(subject);
    else
      setSelectedSubject({
        id: "",
        name: "",
        status: "Active",
      });
    setOpenSubjectDialog(true);
  };

  const handleCloseLevelDialog = () => setOpenLevelDialog(false);
  const handleCloseSubjectDialog = () => setOpenSubjectDialog(false);

  const fetchLevels = async () => {
    try {
      const levels = await GetAllLevels();
      setLevels(levels);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const fetchSubjects = async () => {
    try {
      const subjects = await GetAllSubjects();
      setSubjects(subjects);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const validateNameSubject = (name) => {
    const isNameExists = subjects.some((subject) => subject.name === name);
    if (isNameExists) {
      setNameExistsError(true);
      return false;
    }

    const nameRegex = /^[a-zA-Z\sÀ-ỹ]{1,50}$/;
    if (!nameRegex.test(name)) {
      setNameExistsError(false);
      setErrorMessage("Name must be alphabetic characters and have maximum length of 50.");
      return false;
    }

    setNameExistsError(false);
    setErrorMessage("");
    return true;
  };

  const validateNameLevel = (name) => {
    const isNameExists = levels.some((level) => level.levelName === name);
    if (isNameExists) {
      setNameExistsError(true);
      return false;
    }

    const nameRegex = /^[a-zA-Z\sÀ-ỹ0-9]{1,50}$/;
    if (!nameRegex.test(name)) {
      setNameExistsError(false);
      setErrorMessage("Name must be alphabetic characters, number and have maximum length of 50.");
      return false;
    }

    setNameExistsError(false);
    setErrorMessage("");
    return true;
  };

  const handleDeleteLevel = async (name, levelId) => {
    try {
      await UpdateLevel({
        levelName: name,
        id: levelId,
        status: "Inactive",
      });
      setLevelSnackbarOpen(true);
      fetchLevels();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const handleDeleteSubject = async (name, subjectId) => {
    try {
      await UpdateSubject({
        name: name,
        id: subjectId,
        status: "Inactive",
      });
      setSubjectSnackbarOpen(true);
      fetchSubjects();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const handleSaveLevel = async () => {
    const { levelName } = selectedLevel;
    if (!validateNameLevel(levelName)) {
      return;
    }

    try {
      let updatedLevel = {
        id: selectedLevel.id,
        levelName: selectedLevel.levelName,
        status: selectedLevel.status,
      };

      let addLevel = {
        levelName: selectedLevel.levelName,
        status: "Active",
      };

      if (selectedLevel.id) {
        await UpdateLevel(updatedLevel);
      } else {
        await AddLevel(addLevel);
      }
      setLevelSnackbarOpen(true);
      fetchLevels();
      handleCloseLevelDialog();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  const handleSaveSubject = async () => {
    const { name } = selectedSubject;
    if (!validateNameSubject(name)) {
      return;
    }

    try {
      let updatedSubject = {
        id: selectedSubject.id,
        name: selectedSubject.name,
        status: selectedSubject.status,
      };

      let addSubject = {
        name: selectedSubject.name,
        status: "Active",
      };

      if (selectedSubject.id) {
        await UpdateSubject(updatedSubject);
      } else {
        await AddSubject(addSubject);
      }
      setSubjectSnackbarOpen(true);
      fetchSubjects();
      handleCloseSubjectDialog();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchLevels();
    fetchSubjects();
  }, []);

  return (
    <div className="flex gap-3">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ maxWidth: 500, width: "100%", mt: 4, mx: "auto" }}
      >
        <Typography variant="h4">Manage Levels</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenLevelDialog(null)}
        >
          Add Level
        </Button>

        <TableContainer component={Paper} sx={{ maxHeight: "270px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Level Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>{level.levelName}</TableCell>
                  <TableCell>{level.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenLevelDialog(level)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleDeleteLevel(level.levelName, level.id)
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openLevelDialog} onClose={handleCloseLevelDialog}>
          <DialogTitle>
            {selectedLevel.id ? "Edit Level" : "Add Level"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Level Name"
              type="text"
              fullWidth
              value={selectedLevel.levelName}
              onChange={(e) =>
                setSelectedLevel({
                  ...selectedLevel,
                  levelName: e.target.value,
                })
              }
              error={nameExistsError}
              helperText={nameExistsError ? "This name is existed" : ""}
            />
            <TextField
              disabled={selectedLevel.status === "Active"}
              margin="dense"
              label="Status"
              type="text"
              fullWidth
              value={selectedLevel.status}
              onChange={(e) =>
                setSelectedLevel({
                  ...selectedLevel,
                  status: e.target.value,
                })
              }
              select
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <div className="text-red-500">{errorMessage}</div>

            <Button
              className="mt-2"
              variant="contained"
              color="primary"
              onClick={handleSaveLevel}
            >
              Save
            </Button>
            <Button
              className="ml-2 mt-2"
              variant="contained"
              color="primary"
              onClick={handleCloseLevelDialog}
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      </Box>

      <Snackbar
        open={levelSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Level saved successfully!
        </Alert>
      </Snackbar>

      <br></br>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ maxWidth: 500, width: "100%", mt: 4, mx: "auto" }}
      >
        <Typography variant="h4">Manage Subjects</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenSubjectDialog(null)}
        >
          Add Subject
        </Button>

        <TableContainer component={Paper} sx={{ maxHeight: "270px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenSubjectDialog(subject)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleDeleteSubject(subject.name, subject.id)
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openSubjectDialog} onClose={handleCloseSubjectDialog}>
          <DialogTitle>
            {selectedSubject.id ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Subject Name"
              type="text"
              fullWidth
              value={selectedSubject.name}
              onChange={(e) =>
                setSelectedSubject({
                  ...selectedSubject,
                  name: e.target.value,
                })
              }
              error={nameExistsError}
              helperText={nameExistsError ? "This name is existed" : ""}
            />
            <TextField
              disabled={selectedSubject.status === "Active"}
              margin="dense"
              label="Status"
              type="text"
              fullWidth
              value={selectedSubject.status}
              onChange={(e) =>
                setSelectedSubject({
                  ...selectedSubject,
                  status: e.target.value,
                })
              }
              select
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <div className="text-red-500">{errorMessage}</div>
            <Button
              className="mt-2"
              variant="contained"
              color="primary"
              onClick={handleSaveSubject}
            >
              Save
            </Button>
            <Button
              className="ml-2 mt-2"
              variant="contained"
              color="primary"
              onClick={handleCloseSubjectDialog}
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
        
        <Snackbar
          open={subjectSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Subject saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}
