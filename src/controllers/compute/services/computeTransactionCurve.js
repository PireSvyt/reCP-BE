module.exports = function computeTransactionCurve(transactions, need) {
  let sinceDate = Date.parse(need.since);
  let now = Date.now();
  let Difference_In_Time = now.getTime() - sinceDate.getTime();
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  let periods = Difference_In_Days / need.by;

  // Build curve
  let curve = {};
  for (let i = 0; i < periods; i++) {
    let curveDate = new Date();
    curveDate.setDate(sinceDate.getDate() + i * need.by);
    //curveDate = sinceDate + i * need.by * 1000 * 3600 * 24;
    curve[i] = {
      total: 0,
      date: curveDate,
    };
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    let transactionDate = new Date(transaction.date);
    let Difference_In_Time = transactionDate.getTime() - sinceDate.getTime();

    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let Period = Difference_In_Days / need.by;
    let slice = Math.floor(Period);

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
