module.exports = function computeTransactionBalance(transaction, balancerules) {
  let ratio = {
    Alice: 0.5,
    Pierre: 0.5,
  };

  // Any rule applying?
  balancerules.forEach(balancerule => {
    let useRuleRatio = true
    if (Date.parse(transaction.date) < Date.parse(balancerule.startdate)) { 
      useRuleRatio = false
    }
    if (balancerule.categories
      .filter(cat => {
        return cat.categoryid === transaction.categoryid
      }).length !== 1 ) {
      useRuleRatio = false
    }
    if (balancerule.enddate !== undefined) {
      if (Date.parse(balancerule.enddate) < Date.parse(transaction.date)) {      
        useRuleRatio = false
      }
    }
    if (useRuleRatio) {
      console.log("using rule",balancerule,"for transaction",transaction)
      ratio.Alice = balancerule.filter((br) => {
          return br.user === "Alice";
        })[0].ratio      
      ratio.Pierre = balancerule.filter((br) => {
          return br.user === "Pierre";
        })[0].ratio
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

  if(Alice.ratio === 0.5) { console.log("used default ratio") }
  
  return outcome;
};
