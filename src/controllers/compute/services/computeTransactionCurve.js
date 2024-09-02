module.exports = function computeTransactionCurve(transactions, need) {
  // Build curve
  let curve = {};
  let movingDate = need.since;
  let i = -1;
  do {
    i += 1;
    movingDate = need.since + i * need.by;
    curve[i] = {
      total: 0,
      date: movingDate,
    };
  } while (movingDate <= Date.now());

  // Totalise transactions
  transactions.forEach((transaction) => {
    let slice = Math.floor((transaction.date - need.since) / need.by);
    curve[slice] = curve[slice].total + transaction.amount;
  });

  return curve;
};
