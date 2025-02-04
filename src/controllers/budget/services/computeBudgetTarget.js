module.exports = function computeBudgetTarget(
  budget,
  budgettarget,
  transactions
) {
  let computedBudgetTarget = { ...budgettarget };

  // Manage date window
  computedBudgetTarget.startdate = Date.parse(budgettarget.startdate);
  computedBudgetTarget.enddate = Date.parse(budgettarget.enddate);

  // Comput target
  computedBudgetTarget.target = budgettarget.amount;

  // Compute indicators
  computedBudgetTarget.indicator = {
    current: 0,
    projection: 0,
  };
  transactions.forEach((transaction) => {
    switch (computedBudgetTarget.treatment) {
      case "exit":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.indicator.current += transaction.amount;
            break;
          case "entry":
            computedBudgetTarget.indicator.current -= transaction.amount;
            break;
        }
        break;
      case "entry":
        switch (transaction.treatment) {
          case "exit":
          case "saving":
            computedBudgetTarget.indicator.current -= transaction.amount;
            break;
          case "entry":
            computedBudgetTarget.indicator.current += transaction.amount;
            break;
        }
        break;
      case "saving":
        switch (transaction.treatment) {
          case "entry":
            computedBudgetTarget.indicator.current += transaction.amount;
            break;
          case "exit":
          case "saving":
            computedBudgetTarget.indicator.current -= transaction.amount;
            break;
        }
        break;
    }
  });
  // Projection
  const nowDate = new Date();
  const progress =
    (nowDate - computedBudgetTarget.startdate) /
    (computedBudgetTarget.enddate - computedBudgetTarget.startdate);
  computedBudgetTarget.indicator.projection =
    computedBudgetTarget.indicator.current * (1 / progress);

  return computedBudgetTarget;
};
