const getTransactionType = require("../../transaction/services/getTransactionType.js");

module.exports = function computeBudget(
  userid,
  budget,
  budgettarget,
  transactions
) {
  let computedBudget = { ...budget };

  // Manage date window
  computedBudget.startdate = Date.parse(budgettarget.startdate);
  computedBudget.enddate = Date.parse(budgettarget.enddate);

  // Comput target
  computedBudget.target = budgettarget.amount;

  // Compute indicators
  computedBudget.indicator = {
    current: 0,
    projection: 0,
  };
  transactions.forEach((transaction) => {
    switch (computedBudget.treatment) {
      case "exit":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudget.indicator.current += transaction.amount;
            break;
          case "entry":
            computedBudget.indicator.current -= transaction.amount;
            break;
        }
        break;
      case "entry":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudget.indicator.current -= transaction.amount;
            break;
          case "entry":
            computedBudget.indicator.current += transaction.amount;
            break;
        }
        break;
      case "saving":
        switch (transaction.treatment) {
          case "entry":
            computedBudget.indicator.current += transaction.amount;
            break;
          case "exit":
          case "saving":
            computedBudget.indicator.current -= transaction.amount;
            break;
        }
        break;
    }
  });
  // Projection
  const nowDate = new Date();
  const progress =
    (nowDate - computedBudget.startdate) /
    (computedBudget.enddate - computedBudget.startdate);
  computedBudget.indicator.projection =
    computedBudget.indicator.current * (1 / progress);

  return computedBudget;
};
