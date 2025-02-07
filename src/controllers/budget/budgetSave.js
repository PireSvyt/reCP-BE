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
    delete budgetToSave.communityid;
    delete budgetToSave.userid;
    let errors = [];
    switch (budgetToSave.treatment) {
      case "saving":
        if (budgetToSave.name === undefined || budgetToSave.name === "") {
          errors.push("missing name");
        }
        break;
      case "exit":
      case "entry":
        if (!["necessary", "optional"].includes(budgetToSave.hierarchy)) {
          errors.push("missing hierarchy");
        }
        if (
          budgetToSave.categoryid === undefined ||
          budgetToSave.categoryid === ""
        ) {
          errors.push("missing categoryid");
        }
        break;
    }
    if (errors.length > 0) {
      console.log("budget.save.error");
      console.error(errors);
      return res.status(400).json({
        type: "budget.save.error",
        error: errors,
      });
    }

    // Save
    Budget.updateOne(
      {
        budgetid: budgetToSave.budgetid,
        communityid: req.augmented.user.communityid,
        userid: req.augmented.user.userid,
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
