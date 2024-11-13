require("dotenv").config();
const Budget = require("../../models/Budget.js");
const Transaction = require("../../models/Transaction.js");
const computeBudget = require("./services/computeBudget.js");

module.exports = budgetGetList = (req, res, next) => {
/*

sends back the budget list

possible response types
- budget.getlist.success
- budget.getlist.error.onfind

inputs
- need

*/

if (process.env.DEBUG) {
console.log("budget.getlist");
}

// Initialize
var fields = "budgetid name type slidingDuration categoryids targets";
var filters = { communityid: req.augmented.user.communityid };

Budget.find(filters, fields)
  .then((budgets) => {
    if (budgets.length === 0) {
      // Response
      console.log("budget.getlist.success empty");
      return res.status(200).json({
        type: "budget.getlist.success",
        data: {
          budgets: budgets,
        },
      });
    } else {
      Transaction.find({
        communityid: req.augmented.user.communityid
      })
      .then((transactions) => {
        let budgetsToSend = []
        budgets.forEach(budget => {
          budgetsToSend.push(computeBudget(budget, transactions))
        })
        // Response
        console.log("budget.getlist.success");
        return res.status(200).json({
          type: "budget.getlist.success",
          data: {
            budgets: budgetsToSend,
          },
        });
      })
      .catch((error) => {
        console.log("budget.getlist.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "budget.getlist.error.onfind",
          error: error,
        });
      });
    }
  })
  .catch((error) => {
    console.log("budget.getlist.error.onfind");
    console.error(error);
    return res.status(400).json({
      type: "budget.getlist.error.onfind",
      error: error,
    });
  });
};