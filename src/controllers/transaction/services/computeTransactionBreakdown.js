const computeTransactionBalance = require("./computeTransactionBalance");

module.exports = function computeTransactionBreakdown(
  req,
  transactions,
  need,
  coefficients
) {
  // Initialize
  let breakdown = {};

  function addToBreakdown(transaction, share) {
    if (Object.keys(breakdown).includes(transaction.categoryid)) {
      breakdown[transaction.categoryid] = {
        categoryid: transaction.categoryid,
        total: share === undefined ? transaction.amount : share,
      };
    } else {
      breakdown[transaction.categoryid].total =
        breakdown[transaction.categoryid].total +
        (share === undefined ? transaction.amount : share);
    }
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    if (need.personal === true) {
      if (
        transaction.by === req.augmented.user.userid ||
        transaction.for.includes(req.augmented.user.userid)
      ) {
        if (
          transaction.by === req.augmented.user.userid &&
          transaction.for.includes(req.augmented.user.userid) &&
          transaction.for.length === 1
        ) {
          // Personal expense
          addToBreakdown(transaction);
        } else {
          // Shared expense
          transactionUserBalance = computeTransactionBalance(
            transaction.toObject(),
            coefficients,
            req.body.members
          );
          addToBreakdown(
            transaction,
            transactionUserBalance.share[req.augmented.user.userid]
          );
        }
      }
    } else {
      // Community curve (no coefficient need)
      if (transaction.for.length > 1) {
        addToBreakdown(transaction);
      }
    }
  });

  // Sort
  let sortedBreakdown = Object.values(breakdown);
  sortedBreakdown.sort((a, b) => {
    return a.total - b.total;
  });

  return sortedBreakdown;
};
