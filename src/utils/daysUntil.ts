function daysUntil(timestamp: number) {
  const now = Date.now();
  const differenceInTime = timestamp - now;
  // Convert time difference from milliseconds to days

  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays === 0 ? "< 1 day ago" : `${differenceInDays} ${differenceInDays === 1 ? "day" : "days"} ago`;
}

export default daysUntil;