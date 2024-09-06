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
  console.log("curve", curve);

  // Totalise transactions
  transactions.forEach((transaction) => {
    let slice = Math.floor(
      (Date.parse(transaction.date) - Date.parse(need.since)) /
        (1000 * 3600 * 24 * need.by)
    );
    if (Object.keys(curve).includes(slice)) {
      curve[slice].total += transaction.amount;
    } else {
      console.log("Date.parse(transaction.date)", Date.parse(transaction.date));
      console.log("Date.parse(need.since)", Date.parse(need.since));
      console.log("1000*3600*24*need.by", 1000 * 3600 * 24 * need.by);
      console.log("slice", slice);
    }
  });

  return curve;
};
