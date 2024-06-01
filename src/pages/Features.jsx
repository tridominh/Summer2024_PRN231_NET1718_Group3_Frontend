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

export function Features() {
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState({
        id: "",
        levelName: "",
        status: "Active",
    });
    const [openLevelDialog, setOpenLevelDialog] = useState(false);
    const [levelSnackbarOpen, setLevelSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setLevelSnackbarOpen(false);
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
    const handleCloseLevelDialog = () => setOpenLevelDialog(false);

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


    const handleSaveLevel = async () => {
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

    useEffect(() => {
        fetchLevels();
    }, []);

    return (
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

            <TableContainer component={Paper}>
                <Table>
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
                                        onClick={() =>
                                            handleOpenLevelDialog(level)
                                        }
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


            <Snackbar
                open={levelSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Level saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Features;
