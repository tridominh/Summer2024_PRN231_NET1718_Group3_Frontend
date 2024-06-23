import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllBookings() {
    const response = await axios.get(
        `${getEndpoint()}/api/Booking/GetAll`,
        ngrokSkipWarning
    );

    return response.data.data;
}

export async function GetAllBookingsByStatus(status) {
    const response = await axios.get(
        `${getEndpoint()}/api/Booking/GetAllByStatus?status=${status}`,
        ngrokSkipWarning
    );

    return response.data;
}

export async function CreateBooking(createBookingDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/Create`,
        createBookingDto,
        ngrokSkipWarning
    );

    return response.data.data;
}

export async function AddSchedule(scheduleDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Schedule/Add`,
        scheduleDto,
        ngrokSkipWarning
    );
    return response.data.data;
}

export async function UpdateBooking(updateBookingDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/Update`,
        updateBookingDto,
        ngrokSkipWarning
    );

    return response.data.data;
}

export async function UpdateBookingStatus(updateBookingDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/UpdateStatus`,
        updateBookingDto,
        ngrokSkipWarning
    );

    return response.data.data;
}

export async function ApplyToBooking(applyBookingDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/Apply`,
        applyBookingDto,
        ngrokSkipWarning
    );

    return response.data;
}

export async function GetAllTutorsByBooking(bookingId) {
    const response = await axios.get(
        `${getEndpoint()}/api/Booking/GetTutorsByBooking/${bookingId}`,
        ngrokSkipWarning
    );

    return response.data;
}

export async function AcceptTutor(acceptTutorDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/AcceptTutor`,
        acceptTutorDto,
        ngrokSkipWarning
    );

    return response.data;
}

export async function CancelApplication(cancelApplicationDto) {
    const response = await axios.post(
        `${getEndpoint()}/api/Booking/CancelApplication`,
        cancelApplicationDto,
        ngrokSkipWarning
    );

    return response.data;
}
