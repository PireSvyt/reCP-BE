require("dotenv").config();
const BudgetTarget = require("../../models/BudgetTarget.js");

module.exports = budgettargetGetList = (req, res, next) => {
  /*

sends back the budget target list

possible response types
- budgettarget.getlist.success
- budgettarget.getlist.error.nofilters
- budgettarget.getlist.error.onfind

inputs
- need

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.getlist");
  }

  // Setting up filters
  var filters = {
    communityid: req.augmented.user.communityid,
    userid: req.augmented.user.userid,
  };
  if (req.body.filters !== undefined) {
    if (req.body.filters.budgetid !== undefined) {
      filters.budgetid = req.body.filters.budgetid;
    }
    if (req.body.filters.date !== undefined) {
      if (req.body.filters.date.min !== undefined) {
        filters.startdate = { $gte: req.body.filters.date.min };
      }
      if (req.body.filters.date.max !== undefined) {
        filters.enddate = { $lte: req.body.filters.date.max };
      }
    }
  } else {
    console.log("budgettarget.getlist.error.nofilters");
    return res.status(503).json({
      type: "budgettarget.getlist.error.nofilters",
    });
  }

  BudgetTarget.find(filters)
    .then((budgettargets) => {
      // Response
      console.log("budgettarget.getlist.success empty");
      return res.status(200).json({
        type: "budgettarget.getlist.success",
        data: {
          budgettargets: budgettargets,
        },
      });
    })
    .catch((error) => {
      console.log("budget.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "budgettarget.getlist.error.onfind",
        error: error,
      });
    });
};
