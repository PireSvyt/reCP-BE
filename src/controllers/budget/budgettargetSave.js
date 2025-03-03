require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetTargetSave = (req, res, next) => {
  /*

creates a budget

possible response types
- budgettarget.save.error.budgetid
- budgettarget.save.success.modified
- budgettarget.save.error.onmodify

*/

  let allowedCChanges = ["target"];

  if (process.env.DEBUG) {
    console.log("budgettarget.save");
  }

  // Save
  if (req.body.budgetid === "" || req.body.budgetid === undefined) {
    console.log("budgettarget.save.error.budgetid");
    return res.status(503).json({
      type: "budgettarget.save.error.budgetid",
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
        budget.targets.forEach((target) => {
          if (
            req.body.targets
              .map((t) => {
                return t.targetid;
              })
              .includes(target.targetid)
          ) {
            let newTarget = { ...target };
            let changes = req.body.targets.filter((t) => {
              return t.targetid === target.targetid;
            })[0];
            newTarget.target = changes.target;
            newTargets.push(newTarget);
          } else {
            newTargets.push(target);
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
            console.log("budgettarget.save.success.modified");
            return res.status(200).json({
              type: "budgettarget.save.success.modified",
              budgettargets: req.body.targets,
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
