require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetTargetDelete = (req, res, next) => {
  /*

delete a budget target

possible response types
- budgettarget.delete.error.budgetid
- budgettarget.delete.error.targetid
- budgettarget.delete.success.deleted
- budgettarget.delete.error.ondelete

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.delete");
  }

  if (req.body.budgetid === "" || req.body.budgetid === undefined) {
    console.log("budgettarget.delete.error.budgetid");
    return res.status(503).json({
      type: "budgettarget.delete.error.budgetid",
      error: error,
    });
  } else {
    if (req.body.targetid === "" || req.body.targetid === undefined) {
      console.log("budgettarget.delete.error.targetid");
      return res.status(503).json({
        type: "budgettarget.delete.error.targetid",
        error: error,
      });
    } else {
      // ind the original
      Budget.findOne({
        budgetid: req.body.budgetid,
        communityid: req.augmented.user.communityid,
        userid: req.augmented.user.userid,
      })
        .then((budget) => {
          let newTargets = [];
          req.body.targets.forEach((target) => {
            if (target.targetid !== req.body.targetid) {
              targets.push(target);
            }
          });
          // Save
          Budget.updateOne(
            {
              budgetid: req.body.budgetid,
            },
            {
              targets: newTargets,
            }
          )
            .then(() => {
              console.log("budgettarget.delete.success.deleted");
              return res.status(200).json({
                type: "budgettarget.delete.success.deleted",
                budgetid: req.body.budgetid,
                targetid: req.body.targetid,
              });
            })
            .catch((error) => {
              console.log("budgettarget.delete.error.ondelete");
              console.error(error);
              return res.status(400).json({
                type: "budgettarget.delete.error.ondelete",
                error: error,
              });
            });
        })
        .catch((error) => {
          console.log("budgettarget.delete.error.ondelete");
          console.error(error);
          return res.status(400).json({
            type: "budgettarget.delete.error.ondelete",
            error: error,
          });
        });
    }
  }
};
