require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetTargetCeate = (req, res, next) => {
  /*

saves a budget

possible response types
- budgettarget.create.error.budgetid
- budgettarget.create.success.modified
- budgettarget.create.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.create");
  }

  // Save
  if (req.body.budgetid === "" || req.body.budgetid === undefined) {
    console.log("budgettarget.create.error.budgetid");
    return res.status(503).json({
      type: "budgettarget.create.error.budgetid",
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
        let targets = [...budget.targets];
        req.body.targets.forEach((target) => {
          let newTarget = { ...target };
          if (newTarget.targetid === undefined) {
            newTarget.targetid = random_string(24);
          }
          targets.push(newTarget);
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
            console.log("budgettarget.create.success.modified");
            return res.status(200).json({
              type: "budgettarget.create.success.modified",
              budgettargets: req.body.targets,
            });
          })
          .catch((error) => {
            console.log("budgettarget.create.error.onmodify");
            console.error(error);
            return res.status(400).json({
              type: "budgettarget.create.error.onmodify",
              error: error,
            });
          });
      })
      .catch((error) => {
        console.log("budgettarget.create.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "budgettarget.create.error.onmodify",
          error: error,
        });
      });
  }
};
