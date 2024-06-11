import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllBookingUsers() {
    const response = await axios.get(
        `${getEndpoint()}/api/BookingUser/GetAll`,
        ngrokSkipWarning
    );
    return response.data;
}

export async function GetBookingUserById(id) {
    const response = await axios.get(
        `${getEndpoint()}/api/BookingUser/Get?id=${id}`,
        ngrokSkipWarning
    );
    return response.data;
}

export async function GetBookingUsersByUserId(id) {
    const response = await axios.get(
        `${getEndpoint()}/api/BookingUser/GetBookingUserByUserId?id=${id}`,
        ngrokSkipWarning
    );
    return response.data;
}

export async function AddBookingUser(bookingUserDTO) {
    const response = await axios.post(
        `${getEndpoint()}/api/BookingUser/Add`,
        bookingUserDTO,
        ngrokSkipWarning
    );
    return response.data;
}

export async function UpdateBookingUser(bookingUserDTO) {
    const response = await axios.put(
        `${getEndpoint()}/api/BookingUser/Update`,
        bookingUserDTO,
        ngrokSkipWarning
    );
    return response.data;
}

export async function DeleteBookingUser(id) {
    const response = await axios.delete(
        `${getEndpoint()}/api/BookingUser/Delete`,
        { data: id, ...ngrokSkipWarning }
    );
    return response.data;
}
