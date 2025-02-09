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

*/

  if (process.env.DEBUG) {
    console.log("budget.getlist");
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
      let budgetsToSend = [];
      // Repackage budgets
      budgets.forEach((budget) => {
        let budgetToSend = { ...budget };
        // Filter budget targets
        budgetToSend.budgettargets = budgetToSend.budgettargets.filter(
          (budgettarget) => {
            return (
              req.body.need.date.min <= budgettarget.startdate &&
              budgettarget.enddate <= req.body.need.date.max
            );
          }
        );
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
