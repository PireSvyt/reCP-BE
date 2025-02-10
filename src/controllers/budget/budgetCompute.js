require("dotenv").config();
const Budget = require("../../models/Budget.js");
const Transaction = require("../../models/Transaction.js");
const computeBudgetTarget = require("./services/computeBudgetTarget.js");

module.exports = budgetCompute = (req, res, next) => {
  /*

sends back the budget list

possible response types
- budget.compute.success
- budget.compute.error.onfind

inputs
- need

*/

  if (process.env.DEBUG) {
    console.log("budget.compute");
  }

  var filters = {
    communityid: req.augmented.user.communityid,
    userid: req.augmented.user.userid,
  };

  dateMin = new Date(req.body.need.date.min);
  dateMax = new Date(req.body.need.date.max);

  Budget.aggregate([
    {
      $match: filters,
    },
    {
      $lookup: {
        from: "budgettargets",
        foreignField: "budgetid",
        localField: "budgetid",
        as: "budgettargets",
        pipeline: [
          {
            $project: {
              _id: 0,
              budgettargetid: 1,
              startdate: 1,
              enddate: 1,
              target: 1,
              audience: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        budgetid: 1,
        name: 1,
        audience: 1,
        treatment: 1,
        hierarchy: 1,
        categoryid: 1,
        budgettargets: 1,
      },
    },
  ])
    .then((budgets) => {
      Transaction.find({
        communityid: req.augmented.user.communityid,
        date: {
          $gte: new Date(dateMin),
          $lte: new Date(dateMax),
        },
      })
        .then((transactions) => {
          let budgetsToSend = [];
          let processedTransactions = [];
          // Setup budget target windows
          let budgetTargetWindows = [];
          let monthDiff = monthDifference(dateMin, dateMax);
          for (let monthDelta = 0; monthDelta < monthDiff; monthDelta++) {
            let windowStart = new Date("01/01/2025");
            let newStartMonth = (dateMin.getMonth() + monthDelta) % 12;
            let newStartYear =
              dateMin.getFullYear() +
              Math.floor((dateMin.getMonth() + monthDelta) / 12);
            windowStart = windowStart
              .setMonth(newStartMonth)
              .setFullYear(newStartYear);
            let windowEnd = new Date("01/01/2025");
            let newEndMonth = (dateMin.getMonth() + monthDelta + 1) % 12;
            let newEndYear =
              dateMin.getFullYear() +
              Math.floor((dateMin.getMonth() + monthDelta + 1) / 12);
            windowEnd = windowStart
              .setMonth(newEndMonth)
              .setFullYear(newEndYear);
            budgetTargetWindows.push({
              startdate: windowStart,
              enddate: windowEnd,
            });
          }
          budgets.forEach((budget) => {
            let budgetToSend = { ...budget };
            // Filter budget targets
            let newBudgettargets = budgetToSend.budgettargets.filter(
              (budgettarget) => {
                return (
                  dateMin <= budgettarget.startdate &&
                  budgettarget.enddate <= dateMax
                );
              }
            );
            // Complement budget targets with budget target windows
            let audiences = {
              personal: true,
              community: budgetToSend.audience === "community",
            };
            budgetTargetWindows.forEach((budgetTargetWindow) => {
              Object.keys(audiences).forEach((audience) => {
                if (audiences.audience) {
                  shortListedNewBudgettarget = newBudgettargets.filter(
                    (newBudgettarget) => {
                      return (
                        newBudgettarget.startdate ===
                          budgetTargetWindow.startdate &&
                        newBudgettarget.enddate ===
                          budgetTargetWindow.enddate &&
                        newBudgettarget.audience === audience
                      );
                    }
                  );
                  if (shortListedNewBudgettarget.len === 0) {
                    newBudgettargets.push({
                      budgettargetid: "vitural" + random_string(12),
                      audience: audience,
                      startdate: budgetTargetWindow.startdate,
                      enddate: budgetTargetWindow.enddate,
                      target: 0,
                    });
                  }
                }
              });
            });
            // Process transactions
            newBudgettargets = newBudgettargets.map((newBudgettarget) => {
              let computedBudgettargets = { ...newBudgettarget };
              // Filter transactions
              let budgetTargetTransactions = transactions.filter(
                (transaction) => {
                  // Keep trace of processed transactions
                  if (
                    !processedTransactions.includes(transaction.transactionid)
                  ) {
                    processedTransactions.push(transaction.transactionid);
                  }
                  // Filter
                  return (
                    new Date(newBudgettarget.startdate) <=
                      new Date(transaction.date) &&
                    new Date(transaction.date) <
                      new Date(newBudgettarget.enddate) &&
                    (transaction.categoryid === budget.categoryid ||
                      (budget.treatment === "saving" &&
                        transaction.budgetid === budget.budgetid))
                  );
                }
              );
              // Compute budget target
              computedBudgettargets = computeBudgetTarget(
                budget,
                computedBudgettargets,
                budgetTargetTransactions,
                req.augmented.community.members,
                req.augmented.coefficients
              );
              return computedBudgettargets;
            });
            budgetToSend.budgettargets = newBudgettargets;
            // Store resulting budget
            budgetsToSend.push(budgetToSend);
          });
          // Handle flying transactions
          let flyingTransactions = transactions.filter((transaction) => {
            return !processedTransactions.includes(transaction.transactionid);
          });
          if (flyingTransactions.length > 0) {
            let flyingBudget = {
              budgetid: "flyingtransactionsbudget",
              name: "Flying transactions",
              audience: "community",
              treatment: "exit",
              hierarchy: "optional",
            };
            let flyingBudgetTargetPersonal = {
              budgettargetid: "flyingtransactionsbudgettargetpersonal",
              startdate: new Date(req.body.need.date.min),
              enddate: new Date(req.body.need.date.max),
              target: 0,
              audience: "personal",
            };
            let computedFlyingBudgettargetPersonal = computeBudgetTarget(
              flyingBudget,
              flyingBudgetTargetPersonal,
              flyingTransactions,
              req.augmented.user.userid,
              req.augmented.community.members,
              req.augmented.coefficients
            );
            let flyingBudgetTargetCommunity = {
              budgettargetid: "flyingtransactionsbudgettargetcommunity",
              startdate: new Date(req.body.need.date.min),
              enddate: new Date(req.body.need.date.max),
              target: 0,
              audience: "community",
            };
            let computedFlyingBudgettargetCommunity = computeBudgetTarget(
              flyingBudget,
              flyingBudgetTargetCommunity,
              flyingTransactions,
              req.augmented.user.userid
            );
            flyingBudget.budgettargets = [
              computedFlyingBudgettargetPersonal,
              computedFlyingBudgettargetCommunity,
            ];
            budgetsToSend.push(flyingBudget);
          }
          // Response
          console.log("budget.compute.success");
          return res.status(200).json({
            type: "budget.compute.success",
            data: {
              budgets: budgetsToSend,
              transactions: transactions.length,
            },
          });
        })
        .catch((error) => {
          console.log("budget.compute.error.onfind");
          console.error(error);
          return res.status(400).json({
            type: "budget.compute.error.onfind",
            error: error,
          });
        });
    })
    .catch((error) => {
      console.log("budget.compute.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "budget.compute.error.onfind",
        error: error,
      });
    });
};

function monthDifference(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
