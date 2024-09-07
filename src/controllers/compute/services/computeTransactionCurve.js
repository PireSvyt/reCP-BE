module.exports = function computeTransactionCurve(transactions, need) {
  let sinceDate = Date.parse(need.since);
  let nowDate = Date.now();
  let Difference_In_Time = nowDate - sinceDate;
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  let periods = Math.floor(Difference_In_Days / need.by);
  /*console.log("sinceDate", sinceDate);
  console.log("nowDate", nowDate);
  console.log("Difference_In_Time", Difference_In_Time);
  console.log("Difference_In_Days", Difference_In_Days);
  console.log("periods", periods);*/

  // Build curve
  let curve = {};
  for (let i = 0; i <= periods; i++) {
    curve[i] = {
      total: 0,
      date: sinceDate + i * need.by * 1000 * 3600 * 24,
      dateEnd: sinceDate + (i + 1) * need.by * 1000 * 3600 * 24,
    };
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    if (transaction.for.length === 2) {
      let transactionDate = Date.parse(transaction.date);
      //1694236574000
      Object.keys(curve).forEach((k) => {
        if (
          curve[k].date < transactionDate &&
          transactionDate <= curve[k].dateEnd
        ) {
          curve[k].total = curve[k].total + transaction.amount;
        }
      });
    }
  });

  /// Clean
  Object.keys(curve).forEach((k) => {
    delete curve[k].dateEnd;
  });

  return curve;
};
