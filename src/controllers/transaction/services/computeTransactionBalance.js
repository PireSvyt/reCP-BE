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
      coefficient.userratios.forEach(userratio => {
        if (Object.keys(transactionRatios).includes(userratio.userid)) {
          transactionRatios[userratio.userid] = userratio.ratio
        }
      })      
      // Set to null undefined ratios
      Object.keys(transactionRatios).forEach(userid => {
        if (!coefficient.userratios.map(userratio => {return userratio.userid}).includes(userid)) {
          transactionRatios[userid] = 0
        }
      })
    }
  });
  
  // Balance
  let outcome = {
    balance: {},
    share: {}
  };
  if (transaction.for.length > 1) {
    // Shared expense
    Object.keys(transactionRatios).forEach(userid => {
      // /!\ Works only for 2 members
      if (transaction.by === userid) {
        outcome.balance[userid] = (1 - transactionRatios[userid]) * transaction.amount;
        outcome.share[userid] = transactionRatios[userid] * transaction.amount;
      } else {
        outcome.balance[userid] = -1 * transactionRatios[userid] * transaction.amount;	
        outcome.share[userid] = transactionRatios[userid] * transaction.amount;      
      }
    })
  } else {
    if (transaction.for.includes(transaction.by)) {
      // Personal expense      
	    Object.keys(transactionRatios).forEach(userid => {
	      outcome.balance[userid] = 0
        if (userid === transaction.by) {
          // Expenser is impacted only on his shere
          outcome.share[userid] = transaction.amount;
        } else {
          // Others are not impacted
          outcome.share[userid] = 0;
        }
      })
    } else {
      // Expense for someone else
	    Object.keys(transactionRatios).forEach(userid => {
        if (userid === transaction.by) {
          // Expenser gets refund
          outcome.balance[userid] = transaction.amount
          outcome.share[userid] = 0;
        } else if (transaction.for.includes(userid)) {
          // Expensed gets charged
          outcome.balance[userid] = -1 * transaction.amount
          outcome.share[userid] = transaction.amount;
        } else {
          // Others are not impacted
          outcome.balance[userid] = 0
          outcome.share[userid] = 0;
        }
	    })
    }
  }
  
  return outcome;
  };
