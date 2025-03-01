require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetGetList = (req, res, next) => {
  /*

sends back the budget list

possible response types
- budget.getlist.success
- budget.getlist.error.onfind

inputs
- need
- filters (optional)
- - budgetid

*/

  if (process.env.DEBUG) {
    console.log("budget.getlist");
  }

  var filters = {
    communityid: req.augmented.user.communityid,
    userid: req.augmented.user.userid,
  };

  // Setting up filters
  if (req.body.filters !== undefined) {
    if (req.body.filters.budgetid !== undefined) {
      filters.budgetid = req.body.filters.budgetid;
    }
  }

  Budget.aggregate([
    {
      $match: filters,
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
        targets: 1,
      },
    },
  ])
    .then((budgets) => {
      let budgetsToSend = [];
      // Repackage budgets
      budgets.forEach((budget) => {
        let budgetToSend = { ...budget };
        // Filter budget targets
        budgetToSend.targets = budgetToSend.targets.filter((target) => {
          return (
            req.body.need.date.min <= target.startdate &&
            target.enddate <= req.body.need.date.max
          );
        });
        // Store resulting budget
        budgetsToSend.push(budgetToSend);
      });
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
};
