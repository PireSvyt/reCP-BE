module.exports = function computeTransactionBalance(transaction, balancerules) {
  let ratio = {
    Alice: 0.5,
    Pierre: 0.5,
  };

  // Any rule applying?
  for (const balancerule of balancerules) {
    let useRuleRatio = true
    if (transaction.date < balancerule.startdate) { 
      useRuleRatio = false
    }
    if (balancerule.categories
      .map((cat) => {
        return cat.categoryid;
      })
      .filter(cat => {
        return cat.categoryid === transaction.categoryid
      }).length !== 1 ) {
      useRuleRatio = false
    }
    if (balancerule.enddate !== undefined) {
      if (balancerule.enddate < transaction.date) {      
        useRuleRatio = false
      }
    }
    if (useRuleRatio) {
      ratio = {
        Alice: balancerule.filter((br) => {
          return br.user === "Alice";
        }).ratio,
        Pierre: balancerule.filter((br) => {
          return br.user === "Pierre";
        }).ratio,
      };
    }
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
