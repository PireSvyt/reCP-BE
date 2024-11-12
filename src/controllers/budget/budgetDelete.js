require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetDelete = (req, res, next) => {
/*

deletes a budget

possible response types
- budget.delete.success
- budget.delete.error.ondeletegames
- budget.delete.error.ondeletebudget

*/

if (process.env.DEBUG) {
console.log("budget.delete", req.body);
}

Budget.deleteOne({ budgetid: req.params.budgetid, communityid: req.augmented.user.communityid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("budget.delete.success");
return res.status(200).json({
type: "budget.delete.success",
data: {
outcome: deleteOutcome,
budgetid: req.params.budgetid,
},
});
} else {
console.log("budget.delete.error.outcome");
return res.status(400).json({
type: "budget.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("budget.delete.error.ondeletebudget");
console.error(error);
return res.status(400).json({
type: "budget.delete.error.ondeletebudget",
error: error,
});
});
};