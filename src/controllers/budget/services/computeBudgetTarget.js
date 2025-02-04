module.exports = function computeBudgetTarget(
  budget,
  budgettarget,
  transactions
) {
  let computedBudgetTarget = { ...budgettarget };

  // Manage date window
  computedBudgetTarget.startdate = Date.parse(budgettarget.startdate);
  computedBudgetTarget.enddate = Date.parse(budgettarget.enddate);

  // Compute indicators
  computedBudgetTarget.current = 0;
  computedBudgetTarget.projection = 0;

  transactions.forEach((transaction) => {
    switch (budget.treatment) {
      case "exit":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.current += transaction.amount;
            break;
          case "entry":
            computedBudgetTarget.current -= transaction.amount;
            break;
        }
        break;
      case "entry":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.current -= transaction.amount;
            break;
          case "entry":
            computedBudgetTarget.current += transaction.amount;
            break;
        }
        break;
      case "saving":
        switch (transaction.treatment) {
          case "entry":
            computedBudgetTarget.current += transaction.amount;
            break;
          case "exit":
          case "saving":
            computedBudgetTarget.current -= transaction.amount;
            break;
        }
        break;
      default:
        console.error("Wrong budget.treatment", budget.treatment);
        break;
    }
  });
  // Projection
  const nowDate = new Date();
  const progress =
    (nowDate - computedBudgetTarget.startdate) /
    (computedBudgetTarget.enddate - computedBudgetTarget.startdate);
  computedBudgetTarget.projection =
    computedBudgetTarget.current * (1 / progress);

  return computedBudgetTarget;
};
