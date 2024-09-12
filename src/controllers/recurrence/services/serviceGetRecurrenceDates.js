module.exports = function serviceGetRecurrenceDates(recurrence, datesFor) {
  let dates = [];

  let nowdate = new Date();
  let sincedate = new Date(recurrence.sincedate);
  let tilldate = nowdate + 1000 * 3600 * 24 * datesFor;
  let suspendeddate = nowdate - 1;
  let enddate = tilldate + 1;

  // Adjsut constrained dates
  if (recurrence.endDate !== undefined) {
    enddate = new Date(recurrence.enddate);
  }
  if (recurrence.suspendeddate !== undefined) {
    suspendeddate = new Date(recurrence.suspendeddate);
  }

  // Compute dates
  let incrementBase = "";
  let daysIncrement = 0;
  let monthsIncrement = 0;
  let yearsIncrement = 0;
  switch (recurrence.recurrence.by) {
    case "1week":
      incrementBase = "days";
      daysIncrement = 7;
      break;
    case "2weeks":
      incrementBase = "days";
      daysIncrement = 14;
      break;
    case "3weeks":
      incrementBase = "days";
      daysIncrement = 21;
      break;
    case "4weeks":
      incrementBase = "days";
      daysIncrement = 28;
      break;
    case "6weeks":
      incrementBase = "days";
      daysIncrement = 48;
      break;
    case "1month":
      incrementBase = "months";
      monthsIncrement = 1;
      break;
    case "2months":
      incrementBase = "months";
      monthsIncrement = 2;
      break;
    case "3months":
      incrementBase = "months";
      monthsIncrement = 3;
      break;
    case "6months":
      incrementBase = "months";
      monthsIncrement = 6;
      break;
    case "1year":
      incrementBase = "years";
      yearsIncrement = 1;
      break;
  }

  // Handle days increment
  let cDate;
  let periods;
  if (incrementBase === "days") {
    cDate =
      sincedate +
      1000 *
        3600 *
        24 *
        Math.floor(
          (((sincedate - nowdate) / 1000) * 3600 * 24) / daysIncrement
        );
    periods = Math.round(datesFor / daysIncrement) + 1;
  }
  // Handle months increment
  if (incrementBase === "months") {
    cDate = new Date(
      nowdate.getFullYear(),
      nowdate.getMonth() - 1,
      sincedate.getDate()
    );
    periods = Math.round(datesFor / 30 / monthsIncrement) + 2;
  }
  // Handle years increment
  if (incrementBase === "years") {
    cDate = new Date(
      nowdate.getFullYear() - 1,
      sincedate.getMonth(),
      sincedate.getDate()
    );
    periods = Math.round(datesFor / 365 / yearsIncrement) + 2;
  }

  // Find occurences
  for (let p = 0; p < periods; p++) {
    let currentDate = new Date(
      cDate.getFullYear(),
      cDate.getMonth(),
      cDate.getDate()
    );
    // Check if currentDate is appropriate
    let assumedAppropriate = true;
    if (currentDate < sincedate) {
      // Before since date
      assumedAppropriate = false;
    }
    if (enddate < currentDate) {
      // After end date
      assumedAppropriate = false;
    }
    if (currentDate < suspendeddate) {
      // Before suspended date
      assumedAppropriate = false;
    }
    if (tilldate < currentDate) {
      // End of the request
      assumedAppropriate = false;
    }
    if (assumedAppropriate) {
      // Account for the date
      dates.push(currentDate);
    }

    // Increment current date
    if (incrementBase === "days") {
      cDate.setDate(cDate.getDate() + daysIncrement);
    }
    // Handle months increment
    if (incrementBase === "days") {
      cDate.setMonth(cDate.getMonth() + monthsIncrement);
    }
    // Handle years increment
    if (incrementBase === "years") {
      cDate.setFullYear(cDate.getFullYear() + monthsIncrement);
    }
  }

  return dates;
};
