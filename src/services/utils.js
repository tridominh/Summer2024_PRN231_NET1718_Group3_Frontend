export function formatPrice(price, currency) {
  return price?.toLocaleString("de-DE") + " " + currency;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function convertToDate(dateTime) {
  const date = new Date(dateTime);

  return date.toLocaleDateString("en-CA");
}

export function timeStringToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
}
