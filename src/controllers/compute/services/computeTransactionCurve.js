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
    console.log("need.since", need.since);
    console.log("Date.parse(need.since)", Date.parse(need.since));
    curveDate.setDate(Date.parse(need.since) + i * need.by);
    console.log("curveDate", curveDate);
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
        (1000 * 3600 * 24) /
        need.by
    );
    curve[slice].total += transaction.amount;
  });

  return curve;
};
