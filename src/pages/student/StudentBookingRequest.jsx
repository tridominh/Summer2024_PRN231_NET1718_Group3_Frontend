import React from "react";
import BookingRequestForm from "../../component/BookingRequestForm";

export default function StudentBookingRequest({ token, setNotLogin }) {
  return <BookingRequestForm token={token} setNotLogin={setNotLogin} />;
}
