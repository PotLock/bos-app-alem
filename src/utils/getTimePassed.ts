// Get the current date in the local time zone
const currentDate = new Date();

// Calculate the time zone offset in milliseconds
let localTimeZoneOffsetMinutes = currentDate.getTimezoneOffset();
localTimeZoneOffsetMinutes = localTimeZoneOffsetMinutes * 60 * 1000;

const oneDayTime = 24 * 60 * 60 * 1000;
const currentTimestamp = new Date().getTime();

const yesterday = currentTimestamp - oneDayTime;
const lastWeek = currentTimestamp - oneDayTime * 7;
const lastMonth = currentTimestamp - oneDayTime * 30;
const lastYear = currentTimestamp - oneDayTime * 365;

const getTimePassed = (timestamp: number, abbreviate: boolean) => {
  // Calculate the difference in milliseconds
  const timePassed = currentTimestamp - timestamp;

  // Convert milliseconds to seconds, minutes, hours, etc.
  const secondsPassed = Math.floor(timePassed / 1000);
  const minutesPassed = Math.floor(secondsPassed / 60);
  const hoursPassed = Math.floor(minutesPassed / 60);
  const daysPassed = Math.floor(hoursPassed / 24);

  let time = "0";

  // Display the time passed conditionally
  if (daysPassed > 0) {
    time = !abbreviate ? `${daysPassed} day${daysPassed === 1 ? "" : "s"}` : `${daysPassed}d`;
  } else if (hoursPassed > 0) {
    time = !abbreviate ? `${hoursPassed} hour${hoursPassed === 1 ? "" : "s"}` : `${hoursPassed}h`;
  } else if (minutesPassed > 0) {
    time = !abbreviate ? `${minutesPassed} minute${minutesPassed === 1 ? "" : "s"}` : `${minutesPassed}m`;
  } else {
    time = !abbreviate ? `${secondsPassed} second${secondsPassed === 1 ? "" : "s"}` : `${secondsPassed}s`;
  }
  return time;
};

export default getTimePassed;
