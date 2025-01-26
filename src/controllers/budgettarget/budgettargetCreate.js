require("dotenv").config();
const BudgetTarget = require("../../models/BudgetTarget.js");

module.exports = budgettargetCreate = (req, res, next) => {
  /*

create a budget

possible response types
- budgettarget.create.success
- budgettarget.create.error

*/

  if (process.env.DEBUG) {
    console.log("budgettarget.create");
  }

  let budgettargetToSave = { ...req.body };
  budgettargetToSave.userid = req.augmented.user.userid;
  budgettargetToSave.communityid = req.augmented.user.communityid;
  budgettargetToSave = new BudgetTarget(budgettargetToSave);

  // Save
  budgettargetToSave
    .save()
    .then(() => {
      console.log("budgettarget.create.success");
      return res.status(201).json({
        type: "budgettarget.create.success",
        data: {
          budgettarget: budgettargetToSave,
        },
      });
    })
    .catch((error) => {
      console.log("budgettarget.create.error");
      console.error(error);
      return res.status(400).json({
        type: "budgettarget.create.error",
        error: error,
      });
    });
};
