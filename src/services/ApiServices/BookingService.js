import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllBookings() {
  const response = await axios.get(
    `${getEndpoint()}/api/Booking/GetAll`,
    ngrokSkipWarning,
  );

  return response.data.data;
}

export async function GetAllBookingsByStatus(status) {
  const response = await axios.get(
    `${getEndpoint()}/api/Booking/GetAllByStatus?status=${status}`,
    ngrokSkipWarning,
  );

  return response.data;
}

export async function CreateBooking(createBookingDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/Create`,
    createBookingDto,
    ngrokSkipWarning,
  );

  return response.data.data;
}

export async function AddSchedule(scheduleDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Schedule/Add`,
    scheduleDto,
    ngrokSkipWarning,
  );
  return response.data.data;
}

export async function UpdateBooking(updateBookingDto) {
  const response = await axios.put(
    `${getEndpoint()}/api/Booking/Update`,
    updateBookingDto,
    ngrokSkipWarning,
  );

  return response.data.data;
}

export async function UpdateBookingStatus(updateBookingDto) {
  const response = await axios.put(
    `${getEndpoint()}/api/Booking/UpdateStatus`,
    updateBookingDto,
    {
      headers: {
        "bypass-tunnel-reminder": "true",
        accept: "application/json;odata.metadata=minimal;odata.streaming=true",
        "Content-Type":
          "application/json;odata.metadata=minimal;odata.streaming=true",
      },
    },
  );

  return response.data.data;
}

export async function ApplyToBooking(applyBookingDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/Apply`,
    applyBookingDto,
    ngrokSkipWarning,
  );

  return response.data;
}

export async function GetAllTutorsByBooking(bookingId) {
  const response = await axios.get(
    `${getEndpoint()}/api/Booking/GetTutorsByBooking/${bookingId}`,
    ngrokSkipWarning,
  );

  return response.data;
}

export async function AcceptTutor(acceptTutorDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/AcceptTutor`,
    acceptTutorDto,
    ngrokSkipWarning,
  );

  return response.data;
}

export async function CancelApplication(cancelApplicationDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/CancelApplication`,
    cancelApplicationDto,
    ngrokSkipWarning,
  );

  return response.data;
}

export function calculateCompletedDate(booking) {
  console.log(booking);
  const dayOfWeekMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // Parse the start date
  let startDate = new Date(booking.startDate);
  let numOfSlots = booking.numOfSlots;

  // Extract the schedule days
  let scheduleDays = booking.schedules.map(
    (schedule) => dayOfWeekMap[schedule.dayOfWeek],
  );

  // Initialize the slot counter
  let slotsCount = 0;

  // Loop until the required number of slots is reached
  while (slotsCount < numOfSlots) {
    // Check if the current day is in the schedule
    if (scheduleDays.includes(startDate.getDay())) {
      slotsCount++;
    }
    // Move to the next day if slotsCount is still less than the required number
    if (slotsCount < numOfSlots) {
      startDate.setDate(startDate.getDate() + 1);
    }
  }

  return startDate;
}
