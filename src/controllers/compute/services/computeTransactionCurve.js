module.exports = function computeTransactionCurve(transactions, need) {
  // Build curve
  let curve = {};
  let movingDate = need.since;
  for (
    let i = 0;
    i < Math.floor((Date.now() - Date.parse(need.since)) / need.by);
    i++
  ) {
    curve[i] = {
      total: 0,
      date: Date.parse(need.since) + i * need.by,
    };
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    let slice = Math.floor(
      (transaction.date - Date.parse(need.since)) / need.by
    );
    curve[slice].total += transaction.amount;
  });

  return curve;
};
