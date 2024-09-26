module.exports = function computeTransactionBalance(transaction, coefficients, members) {

  let transactionRatios = {
  };
  members.forEach(member => {
  transactionRatios[member.userid] = 1 / members.length
  })
  
  // Any rule applying?
  coefficients.forEach((coefficient) => {
    let useRuleRatio = true;
    if (Date.parse(transaction.date) < Date.parse(coefficient.startdate)) {
      useRuleRatio = false;
    }
    if (coefficient.categoryids !== undefined) {
      if (!coefficient.categoryids.includes(transaction.categoryid)) {
        useRuleRatio = false;
      }
    }
    if (coefficient.enddate !== undefined) {
      if (Date.parse(coefficient.enddate) < Date.parse(transaction.date)) {
        useRuleRatio = false;
      }
    }
    if (useRuleRatio) {
      // Account for defined userratios
      Object.keys(coefficient.userratios).forEach(userid => {
        if (Object.keys(transactionRatios).includes(userid)) {
          transactionRatios[userid] = coefficient.userratios[userid]
        }
      })      
      // Set to null undefined ratios
      Object.keys(transactionRatios).forEach(userid => {
        if (!Object.keys(coefficient.userratios).includes(userid)) {
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
      outcome[userid] = ((transaction.by === userid ? 1 : -1) * transactionRatios[userid]) * transaction.amount;
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
