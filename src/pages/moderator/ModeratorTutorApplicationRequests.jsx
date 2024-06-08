import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TableVirtuoso } from "react-virtuoso";
import { GetAllUsers, SendStatusMail, UpdateUserInfo } from "../../services/ApiServices/UserService";

export function ModeratorTutorApplicationRequests() {
    const [users, setUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");


    const fetchUsers = async () => {
        try {
            const data = await GetAllUsers();
            const tutors = data.filter((user) => user.role === "Tutor" && user.status === "Inactive");
            setUsers(tutors);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const acceptUser = async (user) => {
        try {
            const userr = {
                id: user.id,
                receiverName: user.name,
                email: user.email,
                phoneNumber: user.phone,
                address: user.address,
                gender: user.gender,
                avatar: user.avatar,
                status: "Active"
            }
            const users = await UpdateUserInfo(userr);
            await SendStatusMail({
                email: user.email,
                status: "Active"
            });
            await fetchUsers();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const rejectUser = async (user) => {
        try {
            const userr = {
                id: user.id,
                receiverName: user.name,
                email: user.email,
                phoneNumber: user.phone,
                address: user.address,
                gender: user.gender,
                avatar: user.avatar,
                status: "Inactive"
            }
            const users = await UpdateUserInfo(userr);
            await SendStatusMail({
                email: user.email,
                status: "Inactive"
            });
            await fetchUsers();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const handleViewUserDetails = (user) => {
        setSelectedUserDetails(user);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { width: 100, label: "Name", dataKey: "name" },
        { width: 100, label: "Email", dataKey: "email" },
        { width: 100, label: "Phone", dataKey: "phone" },
        { width: 100, label: "Address", dataKey: "address" },
        { width: 100, label: "Status", dataKey: "status" },
        { width: 300, label: "Actions", dataKey: "actions" },
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) =>
                column.dataKey !== "actions" ? (
                    <TableCell key={column.dataKey} align={column.numeric || false ? "right" : "left"}>
                        {row[column.dataKey]}
                    </TableCell>
                ) : (
                    <TableCell key={column.dataKey} text-align="center">
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="success"
                            onClick={() => acceptUser(row)}
                        >
                            Accept
                        </Button>
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="error"
                            onClick={() => rejectUser(row)}
                        >
                            Reject
                        </Button>
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewUserDetails(row)}
                        >
                            View
                        </Button>
                    </TableCell>
                )
            )}
        </>
    );

    return (
        <>
            <Box
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 1200,
                    width: "100%",
                    mt: 4,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5c6bc0",
                    }}
                >
                    Tutor Application Requests
                </Typography>
                <Paper style={{ height: 400, width: "100%" }}>
                    <TableVirtuoso
                        data={users}
                        components={{
                            Scroller: TableContainer,
                            Table: (props) => (
                                <Table {...props} sx={{ borderCollapse: "separate" }} />
                            ),
                            TableRow: ({ item: _item, ...props }) => (
                                <TableRow {...props} />
                            ),
                            TableBody: React.forwardRef((props, ref) => (
                                <TableBody {...props} ref={ref} />
                            )),
                        }}
                        fixedHeaderContent={() => (
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.dataKey}
                                        align={column.numeric || false ? "right" : "left"}
                                        style={{ width: column.width }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                        itemContent={rowContent}
                    />
                </Paper>
            </Box>

            <Dialog
                open={selectedUserDetails !== null}
                onClose={() => setSelectedUserDetails(null)}
                aria-labelledby="user-details-title"
            >
                <DialogTitle id="user-details-title">
                    User Details
                </DialogTitle>
                <DialogContent>
                    {selectedUserDetails && (
                        <>
                            <Typography variant="body1">
                                <strong>Name:</strong> {selectedUserDetails.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {selectedUserDetails.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phone:</strong> {selectedUserDetails.phone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {selectedUserDetails.address}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong> {selectedUserDetails.status}
                            </Typography>
                            {selectedUserDetails.credentials[0].image && (
                                <img
                                    src={selectedUserDetails.credentials[0].image}
                                    alt="Credential"
                                    style={{ width: "100%", marginTop: 16 }}
                                />
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedUserDetails(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ModeratorTutorApplicationRequests;
