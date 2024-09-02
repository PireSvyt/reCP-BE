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
    curve[i] = {
      total: 0,
      date: Date.parse(need.since) + i * need.by,
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
