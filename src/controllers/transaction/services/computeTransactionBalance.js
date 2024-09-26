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
          transactionRatios[userid] = userratio.ratio
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
  let outcome = {};
  if (transaction.for.length !== 1) {
    // Shared expense
    Object.keys(transactionRatios).forEach(userid => {
      outcome[userid] = ((transaction.by === userid ? 1 : -1) * transactionRatios[userid]) * transaction.amount;
    })
  } else {
    // Simple movement
    if (transaction.for.includes(transaction.by)) {
	    Object.keys(transactionRatios).forEach(userid => {
	      outcome[userid] = 0
      })
    } else {
	    Object.keys(transactionRatios).forEach(userid => {
		    if (transaction.for.includes(userid)) {
			    outcome[userid] = -1 * transaction.amount;
		    } else if (transaction.by === userid) {
			    outcome[userid] = 1 * transaction.amount;
		    } else {
		      outcome[userid] = 0
	      }
	    })
    }
  }
  
  return outcome;
  };
