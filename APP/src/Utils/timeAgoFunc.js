export function timeAgo(isoTime) {
  const now = new Date();
  const updated = new Date(isoTime);
  const diffInSeconds = Math.floor((now - updated) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffInSeconds >= day) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds >= hour) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds >= minute) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
}
