require("dotenv").config();
const BudgetTarget = require("../../models/BudgetTarget.js");
const Transaction = require("../../models/Transaction.js");
const Category = require("../../models/Category.js");
const computeBudget = require("./services/computeBudget.js");

module.exports = budgettargetCompute = (req, res, next) => {
  /*

sends back the budget list

possible response types
- budgettarget.compute.success
- budgettarget.compute.error.nofilters
- budgettarget.compute.error.onfind

inputs
- filters

*/

  if (process.env.DEBUG) {
    console.log("budget.getlist");
  }

  // Setting up filters
  var budgetFilters = {
    communityid: req.augmented.user.communityid,
    userid: req.augmented.user.userid,
    startdate: { $gte: req.body.filters.date.min },
    enddate: { $lte: req.body.filters.date.max },
  };
  let transactionFilters = {
    communityid: req.augmented.user.communityid,
    date: {
      $gte: req.body.filters.date.min,
      $lte: req.body.filters.date.max,
    },
  };

  Category.find({ communityid: req.augmented.user.communityid }).then(
    (categories) => {
      BudgetTarget.find(budgettargetFilters)
        .then((budgettargets) => {
          Transaction.find(transactionFilters)
            .then((transactions) => {
              // Compute budgets
              let budgetsToSend = [];
              categories.forEach((category) => {
                let categoryBudgetTargets = budgettargets.filter(
                  (budgettarget) => {
                    return budgettarget.budgetid;
                  }
                );
                if (categoryBudgetTargets.includes(category.categoryid)) {
                  // Aggregate budget targets as one if many
                  categoryBudgetTarget = aggregateBudgetTargets(
                    categoryBudgetTargets
                  );
                  // Compute budget
                  budgetsToSend.push(
                    computeBudget(
                      // for this user
                      req.augmented.user.userid,
                      // for this category
                      category,
                      // with ths budget target
                      categoryBudgetTarget,
                      // and transactions related to this category and with matching dates
                      transactions.filter((transaction) => {
                        let transactionIsForThisCategory = false;
                        let transactionMatchesBudgetTargetDates = false;
                        if (category.treatment === "saving") {
                          if (
                            transaction.budgetid === category.categoryid &&
                            transaction.treatment === "saving"
                          ) {
                            transactionIsForThisCategory = true;
                          }
                        } else {
                          if (transaction.categoryid === category.categoryid) {
                            transactionIsForThisCategory = true;
                          }
                        }
                        if (
                          categoryBudgetTarget.startdate <= transaction.date &&
                          transaction.date < categoryBudgetTarget.enddate
                        ) {
                          transactionMatchesBudgetTargetDates = true;
                        }
                        return (
                          transactionIsForThisCategory &&
                          transactionMatchesBudgetTargetDates
                        );
                      })
                    )
                  );
                }
              });

              // Handle transactions without budget
              let nobucketTransactions = transactions.filter((transaction) => {
                let transactionHasACategory = categories
                  .map((category) => {
                    return category.categoryid;
                  })
                  .includes(transaction.categoryid);
                let transactionIsSavingOfACategory =
                  categories
                    .map((category) => {
                      return category.categoryid;
                    })
                    .includes(transaction.budgetid) &&
                  transaction.treatment === "saving";
                return (
                  !transactionHasACategory && !transactionIsSavingOfACategory
                );
              });
              if (nobucketTransactions.length > 0) {
                budgetsToSend.push(
                  computeBudget(
                    req.augmented.user.userid,
                    {
                      categoryid: "personalunknowns",
                      treatment: "exit",
                      hierarchy: "necessary",
                      name: "personal unknowns",
                      // More needed most likely
                    },
                    {
                      budgettargetid: random_string(),
                      communityid: req.augmented.user.communityid,
                      userid: req.augmented.user.userid,
                      startdate: req.body.filters.date.min,
                      enddate: req.body.filters.date.max,
                      amount: 0,
                      audience: "personal",
                      budgetid: "personalunknowns",
                    },
                    nobucketTransactions
                  )
                );
                budgetsToSend.push(
                  computeBudget(
                    req.augmented.user.userid,
                    {
                      categoryid: "communityunknowns",
                      treatment: "exit",
                      hierarchy: "necessary",
                      name: "community unknowns",
                      // More needed most likely
                    },
                    {
                      budgettargetid: random_string(),
                      communityid: req.augmented.user.communityid,
                      userid: req.augmented.user.userid,
                      startdate: req.body.filters.date.min,
                      enddate: req.body.filters.date.max,
                      amount: 0,
                      audience: "community",
                      budgetid: "communityunknowns",
                    },
                    nobucketTransactions
                  )
                );
              }

              // Package budgets
              let finalBudget = {};
              finalBudget.neccessay = aggregateBudgets(
                budgetsToSend.filter((b) => {
                  return b.treatment === "exit" && b.hierarchy === "necessary";
                })
              );
              finalBudget.optional = aggregateBudgets(
                budgetsToSend.filter((b) => {
                  return b.treatment === "exit" && b.hierarchy === "optional";
                })
              );
              finalBudget.savings = aggregateBudgets(
                budgetsToSend.filter((b) => {
                  return b.treatment === "saving";
                })
              );
              finalBudget.entries = aggregateBudgets(
                budgetsToSend.filter((b) => {
                  return b.treatment === "entry";
                })
              );

              // Response
              console.log("budgettarget.compute.success empty");
              return res.status(200).json({
                type: "budgettarget.compute.success",
                data: {
                  budget: finalBudget,
                },
              });
            })
            .catch((error) => {
              console.log("budgettarget.compute.error.onfind");
              console.error(error);
              return res.status(400).json({
                type: "budgettarget.compute.error.onfind",
                error: error,
              });
            });
        })
        .catch((error) => {
          console.log("budgettarget.compute.error.onfind");
          console.error(error);
          return res.status(400).json({
            type: "budgettarget.compute.error.onfind",
            error: error,
          });
        });
    }
  );
};

function aggregateBudgetTargets(budgettargets) {
  return {
    budgettargetid: random_string(),
    communityid: budgettargets[0].communityid,
    userid: budgettargets[0].userid,
    startdate: Math.min(
      budgettargets.map((budgettarget) => {
        return budgettarget.startdate;
      })
    ),
    enddate: Math.max(
      budgettargets.map((budgettarget) => {
        return budgettarget.enddate;
      })
    ),
    amount: budgettargets
      .map((budgettarget) => {
        return budgettarget.enddate;
      })
      .reduce((a, b) => a + b, 0),
    audience: budgettargets[0].audience,
    budgetid: budgettargets[0].budgetid,
  };
}
function aggregateBudgets(budgets) {
  let aggregatedBudget = {
    current: 0,
    target: 0,
    projection: 0,
    budgets: [...budgets].sort((a, b) => {
      return a.target - b.target;
    }),
  };

  budgets.forEach((budget) => {
    aggregatedBudget.current += budget.current;
    aggregatedBudget.target += budget.target;
    aggregatedBudget.projection += budget.projection;
  });

  return aggregatedBudget;
}
