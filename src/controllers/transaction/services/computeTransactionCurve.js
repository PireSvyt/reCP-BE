const computeTransactionBalance = require("./computeTransactionBalance")

module.exports = function computeTransactionCurve(req, transactions, need, coefficients) {
  let needBy = 0;
  let needFor = 0;

  switch (need.by) {
    case "1week":
      needBy = 7;
      break;
    case "4weeks":
      needBy = 28;
      break;
    case "1month":
      needBy = -1;
      switch (need.for) {
        case "3months":
          needFor = 3;
          break;
        case "6months":
          needFor = 6;
          break;
        case "1year":
          needFor = 12;
          break;
        case "18months":
          needFor = 18;
          break;
        case "2years":
          needFor = 24;
          break;
        case "3years":
          needFor = 36;
          break;
        case "5years":
          needFor = 60;
          break;
      }
      break;
    case "12weeks":
      needBy = 84;
      break;
    case "1year":
      needBy = 365;
      break;
  }

  function sortCurve (dict) {
    let arrayDict = Object.values(dict)
    arrayDict.sort((a, b) => {
      return a.date - b.date;
    });
    let newDict = {}
    let n = 0
    arrayDict.forEach(a => {
      newDict[n] = a
      n += 1
    })
    return newDict
  }

  // Build curve
  let curve = {};
  let sinceDate = Date.parse(need.since);
  let nowDate = Date.now();
  if (needBy === -1) {
    // by month
    nowDate = new Date()
    let currentYear = nowDate.getFullYear();
    let currentMonth = nowDate.getMonth();
    let nextYear;
    let nextMonth;
    for (let i = 0; i < needFor; i++) {
      // Next month
      if (currentMonth == 11) {
        nextMonth = 0;
        nextYear = currentYear + 1;
      } else {
        nextMonth = currentMonth + 1;
        nextYear = currentYear;        
      }
      curve[i] = {
        total: 0,
        date: new Date(currentYear, currentMonth, 1),
        dateEnd: new Date(nextYear, nextMonth, 1),
      };
      // Remove a month
      if (currentMonth > 0) {
        currentMonth = currentMonth-1;
      } else {
        currentMonth = 11;
        currentYear = currentYear-1;
      }
    }
    // Sort the curve
    curve = sortCurve(curve)
  } else {
    // by even periods
    let Difference_In_Time = nowDate - sinceDate;
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let periods = Math.round(Difference_In_Days / needBy);
    sinceDate = nowDate - periods * needBy * (1000 * 3600 * 24);
    for (let i = 0; i < periods; i++) {
      curve[i] = {
        total: 0,
        date: sinceDate + i * needBy * 1000 * 3600 * 24,
        dateEnd: sinceDate + (i + 1) * needBy * 1000 * 3600 * 24,
      };
    }
  }

  // Totalise transactions
  transactions.forEach((transaction) => {
    let transactionDate = Date.parse(transaction.date);
    if (need.personal === true) {
      // Personal curve
      if (transaction.by === req.augmented.user.userid || 
        transaction.for.includes(req.augmented.user.userid)) {
        if (transaction.by === req.augmented.user.userid &&
          transaction.for.includes(req.augmented.user.userid) &&
          transaction.for.length ===1) {
          // Personal expense
          Object.keys(curve).forEach((k) => {
            if (
              curve[k].date < transactionDate &&
              transactionDate <= curve[k].dateEnd
            ) {
              curve[k].total = curve[k].total + transaction.amount;
            }
          });
        } else {
          // Shared expense
          transactionUserBalance = computeTransactionBalance(
            transaction.toObject(),
            coefficients,
            req.body.members
          )
          Object.keys(curve).forEach((k) => {
            if (
              curve[k].date < transactionDate &&
              transactionDate <= curve[k].dateEnd
            ) {
              curve[k].total = curve[k].total + 
                transactionUserBalance.share[req.augmented.user.userid];
            }
          });
        }
      }
    } else {
      // Community curve (no coefficient need)
      if (transaction.for.length > 1) {
        Object.keys(curve).forEach((k) => {
          if (
            curve[k].date < transactionDate &&
            transactionDate <= curve[k].dateEnd
          ) {
            curve[k].total = curve[k].total + transaction.amount;
          }
        });
      }      
    }
  });

  /// Clean
  Object.keys(curve).forEach((k) => {
    delete curve[k].dateEnd;
  });

  return curve;
};
