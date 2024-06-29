import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Pagination,
} from "@mui/material";
import {
  AcceptTutor,
  GetAllBookingsByStatus,
  UpdateBookingStatus,
} from "../../services/ApiServices/BookingService";
import parseJwt from "../../services/parseJwt";
import { Link, useNavigate } from "react-router-dom";
import { GetAllTutorsByBooking } from "../../services/ApiServices/BookingService";
import {
  GetUserInfo,
  SendStatusMailApproveTeaching,
} from "../../services/ApiServices/UserService";
import StarIcon from "@mui/icons-material/Star";
import { formatPrice } from "../../services/utils";

export default function StudentRequestsPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState({
    pending: [],
    approved: [],
    paid: [],
    cancelled: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appliedTutors, setAppliedTutors] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 6;
  const [snackbarOpening, setSnackbarOpening] = useState(false);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem("token");
        const userId = Number(parseJwt(token).nameid);

        const pendingResponse = await GetAllBookingsByStatus("PENDING");
        const approvedResponse = await GetAllBookingsByStatus("APPROVED");
        const paidResponse = await GetAllBookingsByStatus("PAID");
        const cancelledResponse = await GetAllBookingsByStatus("CANCELLED");

        const allPendingBookings = pendingResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
        );
        const allApprovedBookings = approvedResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
        );

        const allPaidBookings = paidResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
        );
        const allCancelledBookings = cancelledResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
        );

        const studentPendingBookings = allPendingBookings.filter(
          (booking) =>
            booking.bookingUsers[0].userId === userId &&
            booking.bookingUsers[0].role === "STUDENT",
        );

        const studentApprovedBookings = allApprovedBookings.filter(
          (booking) =>
            booking.bookingUsers[0].userId === userId &&
            booking.bookingUsers[0].role === "STUDENT",
        );

        const studentPaidBookings = allPaidBookings.filter(
          (booking) =>
            booking.bookingUsers[0].userId === userId &&
            booking.bookingUsers[0].role === "STUDENT",
        );

        const studentCancelledBookings = allCancelledBookings.filter(
          (booking) =>
            booking.bookingUsers[0].userId === userId &&
            booking.bookingUsers[0].role === "STUDENT",
        );

        setRequests({
          pending: studentPendingBookings,
          approved: studentApprovedBookings,
          paid: studentPaidBookings,
          cancelled: studentCancelledBookings,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setIsLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const getCurrentRequests = (requests) => {
    const startIndex = (currentPage - 1) * requestsPerPage;
    const endIndex = startIndex + requestsPerPage;

    return requests.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const convertToDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-CA");
  };

  const handleOpenDialog = async (booking) => {
    try {
      const tutorsResponse = await GetAllTutorsByBooking(booking.id);
      if (Array.isArray(tutorsResponse.data)) {
        const tutorInfoPromises = tutorsResponse.data.map(async (tutor) => {
          const profile = await GetUserInfo(tutor.user.id);
          return { ...tutor, user: profile };
        });
        const tutorsWithPosts = await Promise.all(tutorInfoPromises);
        const tutorsWithActivePosts = tutorsWithPosts.map((tutor) => ({
          ...tutor,
          activePostsCount: tutor.user.posts.filter(
            (post) => post.status === "ACTIVE",
          ).length,
        }));
        console.log(tutorsWithActivePosts);
        setAppliedTutors(tutorsWithActivePosts);
        // setAppliedTutors(tutorsWithPosts);
        setSelectedBooking(booking);
        setDialogOpen(true);
      } else {
        console.error(
          "Invalid response from GetAllTutorsByBooking:",
          tutorsResponse,
        );
      }
    } catch (error) {
      console.error("Error fetching applied tutors:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAccept = async (tutor) => {
    try {
      const acceptTutorDto = {
        bookingId: selectedBooking.id,
        tutorId: tutor.userId,
      };

      await AcceptTutor(acceptTutorDto);
      setSnackbarMessage("Accept tutor successfully");
      setSnackbarOpening(true);

      navigate(`/student/booking/${acceptTutorDto.bookingId}`, {
        state: { openSnack: true, snackMessage: "Accept tutor successfully" },
      });
      await SendStatusMailApproveTeaching({
        email: tutor.user.email,
        status: "APPROVED",
      });
    } catch (error) {
      console.error("Error in handleAccept:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleOpenProfileDialog = async (userId) => {
    try {
      const profileResponse = await GetUserInfo(userId);
      setTutorProfile(profileResponse);
      setProfileDialogOpen(true);
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
    }
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  const filterAcceptedCredentials = (credentials) => {
    return credentials.filter((credential) => credential.status === "Accepted");
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarOpening(false);
  };

  const handleCancel = async (bookingId) => {
    try {
      await UpdateBookingStatus({
        bookingId: bookingId,
        status: "CANCELLED",
      });
      setSnackbarMessage("Booking cancelled successfully");
      setSnackbarOpen(true);

      // Refresh the booking list
      const token = localStorage.getItem("token");
      const userId = Number(parseJwt(token).nameid);

      const pendingResponse = await GetAllBookingsByStatus("PENDING");
      const paidResponse = await GetAllBookingsByStatus("PAID");
      const cancelledResponse = await GetAllBookingsByStatus("CANCELLED");

      const allPendingBookings = pendingResponse.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
      const allPaidBookings = paidResponse.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
      const allCancelledBookings = cancelledResponse.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );

      const studentPendingBookings = allPendingBookings.filter(
        (booking) =>
          booking.bookingUsers[0].userId === userId &&
          booking.bookingUsers[0].role === "STUDENT",
      );

      const studentPaidBookings = allPaidBookings.filter(
        (booking) =>
          booking.bookingUsers[0].userId === userId &&
          booking.bookingUsers[0].role === "STUDENT",
      );

      const studentCancelledBookings = allCancelledBookings.filter(
        (booking) =>
          booking.bookingUsers[0].userId === userId &&
          booking.bookingUsers[0].role === "STUDENT",
      );

      setRequests({
        pending: studentPendingBookings,
        paid: studentPaidBookings,
        cancelled: studentCancelledBookings,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setSnackbarMessage("Failed to cancel booking");
      setSnackbarOpen(true);
    }
  };

  const renderBookings = (bookings) => {
    return getCurrentRequests(bookings).map((request, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card className="p-4 border border-black rounded-md shadow-md">
          <CardContent>
            <div className="mb-2">
              <Typography
                sx={{ fontWeight: "bold" }}
                className="text-center"
                color="text.secondary"
              >
                <strong>Subject: </strong>
                {request.subjectName}
              </Typography>
            </div>
            <Typography color="text.secondary">
              <strong>Create Date: </strong>{" "}
              {convertToDate(request.createdDate)}
            </Typography>

            <Typography color="text.secondary">
              <strong>Grade: </strong>
              {request.levelName}
            </Typography>
            <Typography color="text.secondary">
              <strong>Slot per week: </strong>
              {request.numOfSlots}
            </Typography>
            <Typography color="text.secondary">
              <strong>Price Per Slot: </strong>
              {formatPrice(request.pricePerSlot, "VND")}
            </Typography>
            <Typography color="text.secondary">
              <strong>Description: </strong>
              {request.description}
            </Typography>

            <Typography color="text.secondary">
              <strong>Status: </strong> {request.status}
            </Typography>
            <div className="flex justify-between mt-3">
              {request.status === "PAID" && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleCancel(request.id)}
                  disabled
                >
                  Cancel
                </Button>
              )}
              {(request.status === "PENDING" ||
                request.status === "APPROVED") && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleCancel(request.id)}
                >
                  Cancel
                </Button>
              )}
              <div>
                {request.status !== "CANCELLED" && (
                  <Typography
                    color="blue"
                    textAlign={"right"}
                    className="mt-2 underline"
                  >
                    <div
                      onClick={() => navigate(`/student/booking/${request.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      View Booking Details
                    </div>
                  </Typography>
                )}
                {/* <Typography */}
                {/*   color="blue" */}
                {/*   textAlign={"right"} */}
                {/*   className="mt-2 underline" */}
                {/*   hidden={request.status === "CANCELLED"} */}
                {/* > */}
                {/*   <div style={{ cursor: "pointer" }}>View Schedule</div> */}
                {/* </Typography> */}
                {request.status !== "CANCELLED" && (
                  <Typography
                    color="blue"
                    textAlign={"right"}
                    className="mt-2 underline"
                  >
                    <div
                      onClick={() => handleOpenDialog(request)}
                      style={{ cursor: "pointer" }}
                    >
                      Tutors Requests
                    </div>
                  </Typography>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="max-w-7xl mx-auto p-4" className="my-3">
      <Typography
        variant="h4"
        align="center"
        className="text-violet-800 my-3 mt-5"
      >
        Your Requests
      </Typography>
      <Button
        sx={{ margin: "1.5rem" }}
        component={Link}
        to="/student/booking"
        variant="contained"
        color="primary"
      >
        Create New Request
      </Button>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="requests tabs"
          centered
        >
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Paid" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {tabValue === 0 && (
        <Box role="tabpanel">
          <Grid justifyContent="center" container spacing={3}>
            {renderBookings(requests.pending || [])}
          </Grid>

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(requests.pending.length / requestsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box role="tabpanel">
          <Grid justifyContent="center" container spacing={3}>
            {renderBookings(requests.approved || [])}
          </Grid>

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(requests.approved.length / requestsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {tabValue === 2 && (
        <Box role="tabpanel">
          <Grid justifyContent="center" container spacing={3}>
            {renderBookings(requests.paid || [])}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(requests.paid.length / requestsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {tabValue === 3 && (
        <Box role="tabpanel">
          <Grid justifyContent="center" container spacing={3}>
            {renderBookings(requests.cancelled || [])}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(requests.cancelled.length / requestsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="dialog-title">List tutors applied</DialogTitle>
        <DialogContent>
          {appliedTutors.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No tutors applied :(
            </Typography>
          ) : (
            appliedTutors.map((tutor, index) => (
              <>
                <DialogContentText
                  key={index}
                  id={`tutor-${index}`}
                  className="flex justify-between"
                >
                  <span
                    onClick={() => handleOpenProfileDialog(tutor.user.id)}
                    className="cursor-pointer w-full flex text-blue-500"
                  >
                    <span className="">{`${index + 1}. ${tutor.user.userName}`}</span>
                    <span>
                      {tutor.activePostsCount > 0 &&
                        Array.from(
                          { length: parseInt(1) },
                          (_, index) => index + 1,
                        ).map((_, index) => (
                          <Tooltip
                            title={`Tutors have contributed to improving students' knowledge with ${tutor.activePostsCount} post(s).`}
                          >
                            <StarIcon
                              className="mb-1"
                              style={{
                                color: "red",
                                marginLeft: "5px",
                              }}
                            />
                          </Tooltip>
                        ))}
                    </span>
                  </span>
                  <div className="mb-3">
                    <Button
                      onClick={() => handleAccept(tutor)}
                      variant="contained"
                      color="primary"
                      disabled={
                        selectedBooking.status === "PAID" ||
                        selectedBooking.status === "APPROVED"
                      }
                      sx={{ ml: 1 }}
                    >
                      Accept
                    </Button>
                  </div>
                </DialogContentText>
                <div className="w-full flex justify-center"></div>
              </>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        aria-labelledby="profile-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle variant="h4" id="profile-dialog-title">
          Tutor Profile
        </DialogTitle>
        <DialogContent>
          {tutorProfile && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={tutorProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    marginRight: 2,
                  }}
                />
              </Box>
              <div>
                <Typography>
                  <strong>Name: </strong>
                  {tutorProfile.userName}
                </Typography>
                <Typography>
                  <strong>Email: </strong>
                  {tutorProfile.email}
                </Typography>
                <Typography>
                  <strong>Phone Number: </strong>
                  {tutorProfile.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Address: </strong>
                  {tutorProfile.address}
                </Typography>
                <Typography>
                  <strong>Gender: </strong>
                  {tutorProfile.gender}
                </Typography>
                <Typography>
                  <strong>Credentials:</strong>
                </Typography>
                {filterAcceptedCredentials(tutorProfile.credentials).map(
                  (credential, index) => (
                    <div className="mt-1" key={index}>
                      <Typography
                        className="block"
                        variant="body1"
                        component="p"
                      >
                        <>- {credential.name}:</>
                      </Typography>
                      <img
                        src={credential.image}
                        alt={`Credential ${index + 1}`}
                        className="justify-center"
                        style={{
                          display: "flex",
                          maxWidth: "60%",
                          margin: "10px auto",
                        }}
                      />
                      <br></br>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />

      <Snackbar
        open={snackbarOpening}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </Container>
  );
}
