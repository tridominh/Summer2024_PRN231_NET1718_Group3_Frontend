export function formatPrice(price, currency) {
  return price?.toLocaleString("de-DE") + " " + currency;
}

export function convertToDate(dateTime) {
  const date = new Date(dateTime);

  return date.toLocaleDateString("en-CA");
}

export function timeStringToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
}
