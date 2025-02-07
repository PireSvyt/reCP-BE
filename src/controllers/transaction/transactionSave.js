require("dotenv").config();
const Transaction = require("../../models/Transaction.js");

module.exports = transactionSave = (req, res, next) => {
  /*

saves a transaction

possible response types
- transaction.save.error.transactionid
- transaction.save.success.modified
- transaction.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("transaction.save");
  }

  let errors = [];
  if (req.body.transactionid === "" || req.body.transactionid === undefined) {
    errors.push("missingtransactionid");
  }
  if (req.body.treatment !== "entry" && req.body.by === undefined) {
    errors.push("missingby");
  }
  if (req.body.treatment === "saving") {
    if (req.body.budgetid === "" || req.body.budgetid === undefined) {
      errors.push("missingbudgetid");
    }
  }

  if (errors.length > 0) {
    console.log("transaction.save.errors", errors);
    return res.status(403).json({
      type: "transaction.save.errors",
      errors: errors,
    });
  } else {
    // Modify
    let transactionToSave = { ...req.body };
    transactionToSave.communityid = req.augmented.user.communityid;
    transactionToSave.author = req.augmented.user.userid;

    // Save
    Transaction.replaceOne(
      {
        transactionid: transactionToSave.transactionid,
        communityid: req.augmented.user.communityid,
      },
      transactionToSave
    )
      .then(() => {
        console.log("transaction.save.success.modified");
        return res.status(200).json({
          type: "transaction.save.success.modified",
          transaction: transactionToSave,
        });
      })
      .catch((error) => {
        console.log("transaction.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "transaction.save.error.onmodify",
          error: error,
        });
      });
  }
};
