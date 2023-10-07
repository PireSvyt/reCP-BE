module.exports = function computeTransactionBalance(transaction) {
  let ratio = {
    Alice: 0.5,
    Pierre: 0.5,
  };

  let rules = [
    {
      datestart: new Date("2023-04-01"),
      dateend: null,
      categories: [
        "625bea0ebd23b203b66897da", // Alimentation
      ],
      ratio: {
        Alice: 0.4,
        Pierre: 0.6,
      },
    },
  ];

  // Any rule applying?
  for (const rule of rules) {
    if (
      (transaction.date >= rule.datestart || rule.datestart === null) &&
      (transaction.date <= rule.dateend || rule.dateend === null) &&
      rule.categories.includes(transaction.category)
    ) {
      //console.log("Applying rule :", rule, " to transaction ", transaction);
      ratio = rule.ratio;
    } /*else {
      console.log("no rule applied");
    }*/
  }

  // Balance
  let outcome = {};
  if (transaction.for.length !== 1) {
    // Shared expense
    outcome["Alice"] =
      ((transaction.by === "Alice" ? 1 : 0) - ratio.Alice) * transaction.amount;
    outcome["Pierre"] =
      ((transaction.by === "Pierre" ? 1 : 0) - ratio.Pierre) *
      transaction.amount;
  } else {
    if (!transaction.for.includes(transaction.by)) {
      // Expense for the other
      outcome[transaction.by] = 1 * transaction.amount;
      outcome[transaction.for[0]] = -1 * transaction.amount;
    } else {
      // Self expense
      outcome[transaction.by] = 0;
    }
  }
  return outcome;
};
