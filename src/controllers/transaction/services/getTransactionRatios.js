module.exports = function getTransactionRatios(members, coefficients, transaction) {
    let transactionRatios = {};
    members.forEach((member) => {
      transactionRatios[member.userid] = 1 / members.length;
    });

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
        coefficient.userratios.forEach((userratio) => {
          if (Object.keys(transactionRatios).includes(userratio.userid)) {
            transactionRatios[userratio.userid] = userratio.ratio;
          }
        });
        // Set to null undefined ratios
        Object.keys(transactionRatios).forEach((userid) => {
          if (
            !coefficient.userratios
              .map((userratio) => {
                return userratio.userid;
              })
              .includes(userid)
          ) {
            transactionRatios[userid] = 0;
          }
        });
      }
    });
    return transactionRatios;
  }