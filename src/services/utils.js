export function formatPrice(price, currency) {
  return price.toLocaleString("de-DE") + " " + currency;
}

export function convertToDate(dateTime) {
  const date = new Date(dateTime);

  return date.toLocaleDateString("en-CA");
}
