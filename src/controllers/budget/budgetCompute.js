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
              amount: 1,
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
          $gte: req.body.filters.date.min,
          $lte: req.body.filters.date.max,
        },
      })
        .then((transactions) => {
          let budgetsToSend = [];
          let processedTransactions = [];
          budgets.forEach((budget) => {
            let budgetToSend = { ...budget };
            // Filter budget targets
            let newBudgettargets = budgetToSend.budgettargets.filter(
              (budgettarget) => {
                return (
                  req.body.need.date.min <= budgettarget.startdate &&
                  budgettarget.enddate <= req.body.need.date.max
                );
              }
            );
            // Process transactions
            newBudgettargets = newBudgettargets.map((newBudgettarget) => {
              let computedBudgettargets = { ...newBudgettarget };
              // Filter transactions
              let budgetTargetTransactions = transactions.filter(
                (transaction) => {
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
              // Keep trace of processed transactions
              budgetTargetTransactions.forEach((transaction) => {
                if (
                  !processedTransactions.includes(transaction.transactionid)
                ) {
                  processedTransactions.push(transaction.transactionid);
                }
              });
              // Compute budget target
              computedBudgettargets = computeBudgetTarget(
                budget,
                computedBudgettargets,
                budgetTargetTransactions
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
            let flyingBudgetTarget = {
              budgettargetid: "flyingtransactionsbudgettarget",
              startdate: req.body.filters.date.min,
              enddate: req.body.filters.date.max,
              amount: 0,
              audience: "community",
              budgetid: "flyingtransactionsbudget",
            };
            let flyingBudget = {
              budgetid: "flyingtransactionsbudget",
              name: "Flying transactions",
              audience: "community",
              treatment: "exit",
              hierarchy: "optional",
            };
            let computedFlyingBudgettargets = computeBudgetTarget(
              flyingBudget,
              flyingBudgetTarget,
              flyingTransactions
            );
            flyingBudget.budgettargets = [computedFlyingBudgettargets];
            budgetsToSend.push(flyingBudget);
          }
          // Response
          console.log("budget.compute.success");
          return res.status(200).json({
            type: "budget.compute.success",
            data: {
              budgets: budgetsToSend,
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
