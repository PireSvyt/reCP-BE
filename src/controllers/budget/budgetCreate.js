require("dotenv").config();
const Budget = require("../../models/Budget.js");

module.exports = budgetCreate = (req, res, next) => {
/*

create a budget

possible response types
- budget.create.success
- budget.create.error

*/

if (process.env.DEBUG) {
console.log("budget.create");
}

let budgetToSave = { ...req.body }
budgetToSave.communityid = req.augmented.user.communityid
if (budgetToSave.audience === undefined) {
    budgetToSave.audience = "community"
}
budgetToSave = new Budget(budgetToSave);

// Save
budgetToSave
.save()
.then(() => {
console.log("budget.create.success");
return res.status(201).json({
type: "budget.create.success",
data: {
budget: budgetToSave,
},
});
})
.catch((error) => {
console.log("budget.create.error");
console.error(error);
return res.status(400).json({
type: "budget.create.error",
error: error,
data: {
budget: undefined,
},
});
});
};