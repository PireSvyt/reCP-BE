require("dotenv").config();
const Transaction = require("../../models/Transaction.js");

module.exports = transactionCreate = (req, res, next) => {
  /*

create a transaction

possible response types
- transaction.create.success
- transaction.create.error

*/

  if (process.env.DEBUG) {
    console.log("transaction.create");
  }

  let errors = [];
  let transactionToSave = { ...req.body };
  transactionToSave.communityid = req.augmented.user.communityid;
  transactionToSave.author = req.augmented.user.userid;
  if (transactionToSave.treatment === undefined) {
    transactionToSave.treatment = "exit";
  }
  if (transactionToSave.treatment === "entry") {
    delete transactionToSave.by;
  } else {
    if (transactionToSave.by === "" || transactionToSave.by === undefined) {
      errors.push("missingby");
    }
  }
  if (transactionToSave.treatment === "saving") {
    if (
      transactionToSave.budgetid === "" ||
      transactionToSave.budgetid === undefined
    ) {
      errors.push("missingbudgetid");
    }
  }

  if (errors.length > 0) {
    console.log("transaction.create.errors", errors);
    return res.status(403).json({
      type: "transaction.create.errors",
      errors: errors,
    });
  } else {
    transactionToSave = new Transaction(transactionToSave);

    // Save
    transactionToSave
      .save()
      .then(() => {
        console.log("transaction.create.success");
        return res.status(201).json({
          type: "transaction.create.success",
          data: {
            transaction: transactionToSave,
          },
        });
      })
      .catch((error) => {
        console.log("transaction.create.error");
        console.error(error);
        return res.status(400).json({
          type: "transaction.create.error",
          error: error,
        });
      });
  }
};
