require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetSave = (req, res, next) => {
/*

saves a budget

possible response types
- budget.save.error.budgetid
- budget.save.success.modified
- budget.save.error.onmodify

*/

if (process.env.DEBUG) {
console.log("budget.save");
}

// Save
if (req.body.budgetid === "" || req.body.budgetid === undefined) {
console.log("budget.save.error.budgetid");
return res.status(503).json({
type: "budget.save.error.budgetid",
error: error,
});
} else {
// Modify
let budgetToSave = { ...req.body };
budgetToSave.communityid = req.augmented.user.communityid

// Save
Budget.updateOne(
  {
    budgetid: budgetToSave.budgetid,
    communityid: req.augmented.user.communityid
  },
  budgetToSave
)
  .then(() => {
    console.log("budget.save.success.modified");
    return res.status(200).json({
      type: "budget.save.success.modified",
      budget: budgetToSave,
    });
  })
  .catch((error) => {
    console.log("budget.save.error.onmodify");
    console.error(error);
    return res.status(400).json({
      type: "budget.save.error.onmodify",
      error: error,
    });
  });
}
};