module.exports = function computeTransactionBalance(transaction, balancerules, members) {

  let transactionRatios = {
  };
  members.forEach(member => {
  transactionRatios[member.userid] = 1 / members.length
  })
  
  // Any rule applying?
  balancerules.forEach((balancerule) => {
  let useRuleRatio = true;
  if (Date.parse(transaction.date) < Date.parse(balancerule.startdate)) {
  useRuleRatio = false;
  }
  if (
  balancerule.categoryids.filter((cat) => {
  return cat === transaction.categoryid;
  }).length !== 1
  ) {
  useRuleRatio = false;
  }
  if (balancerule.enddate !== undefined) {
  if (Date.parse(balancerule.enddate) < Date.parse(transaction.date)) {
  useRuleRatio = false;
  }
  }
  if (useRuleRatio) {
  //console.log("using rule", balancerule, "for transaction", transaction);
  
  // Account for defined ratios
  
  balancerule.ratios.forEach(r => {
  
  transactionRatios[r.userid] = r.ratio
  
  })
  
  // Set to null undefined ratios
  
  Object.keys(transactionRatios).forEach(userid => {
  if (!balancerule.ratios.map(r => { return r.userid }).includes(userid)) {
  transactionRatios[userid] = 0
  
  }
  
  })
  }
  });
  
  // Balance
  let outcome = {};
  if (transaction.for.length !== 1) {
  // Shared expense
  Object.keys(transactionRatios).forEach(userid => {
  outcome[userid] = ((transaction.by === userid ? 1 : 0) - transactionRatios[userid]) * transaction.amount;
  })
  } else {
  // simple movement
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