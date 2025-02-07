require("dotenv").config();
const BudgetTarget = require("../../models/BudgetTarget.js");

module.exports = budgettargetDelete = (req, res, next) => {
  /*

deletes a budget target

possible response types
- budgettarget.delete.success
- budgettarget.delete.error.ondeletegames
- budgettarget.delete.error.ondeletebudget

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.delete", req.body);
  }

  BudgetTarget.deleteOne({
    budgettargetid: req.params.budgettargetid,
    communityid: req.augmented.user.communityid,
    userid: req.augmented.user.userid,
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("budgettarget.delete.success");
        return res.status(200).json({
          type: "budgettarget.delete.success",
          data: {
            outcome: deleteOutcome,
            budgetid: req.params.budgettargetid,
          },
        });
      } else {
        console.log("budgettarget.delete.error.outcome");
        return res.status(400).json({
          type: "budgettarget.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("budgettarget.delete.error.ondeletebudget");
      console.error(error);
      return res.status(400).json({
        type: "budgettarget.delete.error.ondeletebudget",
        error: error,
      });
    });
};
