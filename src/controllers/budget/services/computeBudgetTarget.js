const getTransactionType = require("../../transaction/services/getTransactionType");
const getTransactionRatios = require("../../transaction/services/getTransactionRatios");

module.exports = function computeBudgetTarget(
  budget,
  budgettarget,
  transactions,
  userid,
  members = [],
  coefficients = []
) {
  let computedBudgetTarget = { ...budgettarget };

  // Manage date window
  computedBudgetTarget.startdate = Date.parse(budgettarget.startdate);
  computedBudgetTarget.enddate = Date.parse(budgettarget.enddate);

  // Compute indicators
  computedBudgetTarget.current = 0;
  computedBudgetTarget.projection = 0;

  transactions.forEach((transaction) => {
    let transactionType = getTransactionType(transaction, userid);
    let factor = 1;
    switch (transactionType.audience) {
      case "personal":
        switch (budgettarget.audience) {
          case "personal":
            factor = 1;
            break;
          case "community":
            factor = 0;
            break;
        }
        break;
      case "community":
        switch (budgettarget.audience) {
          case "personal":
            factor = 0;
            break;
          case "community":
            let transactionRatios = getTransactionRatios(
              members,
              coefficients,
              transaction
            );
            console.log("transactionRatios", transactionRatios);
            factor = transactionRatios[userid];
            break;
        }
        break;
    }

    switch (budget.treatment) {
      case "exit":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.current += transaction.amount * factor;
            break;
          case "entry":
            computedBudgetTarget.current -= transaction.amount * factor;
            break;
        }
        break;
      case "entry":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.current -= transaction.amount * factor;
            break;
          case "entry":
            computedBudgetTarget.current += transaction.amount * factor;
            break;
        }
        break;
      case "saving":
        switch (transaction.treatment) {
          case "entry":
            computedBudgetTarget.current += transaction.amount * factor;
            break;
          case "exit":
          case "saving":
            computedBudgetTarget.current -= transaction.amount * factor;
            break;
        }
        break;
      default:
        computedBudgetTarget.error = "budget.treatment unknown";
        console.log("budget.treatment unknown", budget.treatment);
        return computedBudgetTarget;
        break;
    }
  });
  // Prevent null outcome
  if (computedBudgetTarget.current === null) {
    computedBudgetTarget.current = 0;
  }
  // Projection
  const nowDate = new Date();
  const progress =
    (nowDate - computedBudgetTarget.startdate) /
    (computedBudgetTarget.enddate - computedBudgetTarget.startdate);
  computedBudgetTarget.projection =
    computedBudgetTarget.current * (1 / progress);

  return computedBudgetTarget;
};
