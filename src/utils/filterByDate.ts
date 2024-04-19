const filterByDate = (filter: string, donation: any) => {
  const currentTimestamp = new Date().getTime();
  const oneDayTime = 24 * 60 * 60 * 1000;
  const donateAt = donation.donated_at_ms || donation.donated_at;

  const yesterday = currentTimestamp - oneDayTime;
  const lastWeek = currentTimestamp - oneDayTime * 7;
  const lastMonth = currentTimestamp - oneDayTime * 30;
  const lastYear = currentTimestamp - oneDayTime * 365;

  switch (filter) {
    case "day":
      if (donateAt > yesterday) return true;
      return false;
    case "week":
      if (donateAt > lastWeek) return true;
      return false;
    case "month":
      if (donateAt > lastMonth) return true;
      return false;
    case "year":
      if (donateAt > lastYear) return true;
      return false;
    case "all":
      return true;

    default:
      return true;
  }
};

export default filterByDate;
