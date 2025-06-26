export function formatToAMPM(input) {
  const date = new Date(input); // ensures it's a Date object

  if (isNaN(date.getTime())) return "Invalid Date";

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert 0 to 12
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${paddedMinutes} ${ampm}`;
}
