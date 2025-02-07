const getTransactionType = require("./getTransactionType.js");
const getTransactionRatios = require("./getTransactionRatios.js");

module.exports = function computeTransactionBalance(
  transaction,
  coefficients,
  members
) {
  let transactionRatios = getTransactionRatios(
    members,
    coefficients,
    transaction
  );

  // Balance
  let outcome = {
    balance: {},
    share: {},
  };
  switch (getTransactionType(transaction).audience) {
    case "personal":
      Object.keys(transactionRatios).forEach((userid) => {
        outcome.balance[userid] = 0;
        if (userid === transaction.by) {
          // Expenser is impacted only on his shere
          outcome.share[userid] = transaction.amount;
        } else {
          // Others are not impacted
          outcome.share[userid] = 0;
        }
      });
      break;
    case "community":
      Object.keys(transactionRatios).forEach((userid) => {
        // /!\ Works only for 2 members
        if (transaction.by === userid) {
          outcome.balance[userid] =
            (1 - transactionRatios[userid]) * transaction.amount;
          outcome.share[userid] =
            transactionRatios[userid] * transaction.amount;
        } else {
          outcome.balance[userid] =
            -1 * transactionRatios[userid] * transaction.amount;
          outcome.share[userid] =
            transactionRatios[userid] * transaction.amount;
        }
      });
      break;
    case "transfer":
      Object.keys(transactionRatios).forEach((userid) => {
        if (userid === transaction.by) {
          // Expenser gets refund
          outcome.balance[userid] = transaction.amount;
          outcome.share[userid] = 0;
        } else if (transaction.for.includes(userid)) {
          // Expensed gets charged
          outcome.balance[userid] = -1 * transaction.amount;
          outcome.share[userid] = transaction.amount;
        } else {
          // Others are not impacted
          outcome.balance[userid] = 0;
          outcome.share[userid] = 0;
        }
      });
      break;
  }

  return outcome;
};
