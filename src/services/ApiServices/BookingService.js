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

export async function CreateBooking(createBookingDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/Create`,
    createBookingDto,
    ngrokSkipWarning,
  );

  return response.data.data;
}

export async function UpdateBooking(updateBookingDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Booking/Update`,
    updateBookingDto,
    ngrokSkipWarning,
  );

  return response.data.data;
}
