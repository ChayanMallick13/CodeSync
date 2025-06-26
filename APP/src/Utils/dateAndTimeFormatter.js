export function formatTimestamp(timestamp = Date.now()) {
  const options = {
    year: "numeric",
    month: "long",   // e.g., "June"
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(timestamp).toLocaleString("en-US", options);
}
