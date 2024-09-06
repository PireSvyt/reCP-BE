module.exports = function computeTransactionCurve(transactions, need) {
  // Build curve
  let curve = {};
  for (
    let i = 0;
    i <
    Math.floor(
      (Date.now() - Date.parse(need.since)) / (1000 * 3600 * 24) / need.by
    );
    i++
  ) {
    let curveDate = new Date();
    curveDate = Date.parse(need.since) + i * need.by * 1000 * 3600 * 24;
    curve[i] = {
      total: 0,
      date: curveDate,
    };
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    let Difference_In_Time =
      Date.parse(transaction.date).getTime() - Date.parse(need.since).getTime();

    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let Period = Difference_In_Days / need.by;
    let slice = Match.floor(Period);

    /*let slice = Math.floor(
      (Date.parse(transaction.date) - Date.parse(need.since)) /
        (1000 * 3600 * 24 * need.by)
    );*/

    if (Object.keys(curve).includes(slice)) {
      curve[slice].total = curve[slice].total + transaction.amount;
    } else {
      console.log("Difference_In_Time", Difference_In_Time);
      console.log("Difference_In_Days", Difference_In_Days);
      console.log("Period", Period);
      console.log("slice", slice);
    }
  });

  return curve;
};
