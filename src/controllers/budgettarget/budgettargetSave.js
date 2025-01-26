require("dotenv").config();
const BudgetTarget = require("../../models/BudgetTarget.js");

module.exports = budgettargetSave = (req, res, next) => {
  /*

saves a budget

possible response types
- budgettarget.save.error.budgetid
- budgettarget.save.error.treatment
- budgettarget.save.success.modified
- budgettarget.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.save");
  }

  // Save
  if (req.body.budgettargetid === "" || req.body.budgettargetid === undefined) {
    console.log("budgettarget.save.error.budgetid");
    return res.status(503).json({
      type: "budgettarget.save.error.budgettargetid",
      error: "missing budgettargetid",
    });
  } else {
    // Modify
    let budgettargetToSave = { ...req.body };
    budgettargetToSave.communityid = req.augmented.user.communityid;
    budgettargetToSave.userid = req.augmented.user.userid;

    // Save
    BudgetTarget.updateOne(
      {
        budgettargetid: budgettargetToSave.transactionid,
        communityid: req.augmented.user.communityid,
        userid: req.augmented.user.userid,
      },
      budgettargetToSave
    )
      .then(() => {
        console.log("budgettarget.save.success.modified");
        return res.status(200).json({
          type: "budgettarget.save.success.modified",
          budgettarget: budgettargetToSave,
        });
      })
      .catch((error) => {
        console.log("budgettarget.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "budgettarget.save.error.onmodify",
          error: error,
        });
      });
  }
};
