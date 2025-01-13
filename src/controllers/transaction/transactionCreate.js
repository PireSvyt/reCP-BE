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

  let transactionToSave = { ...req.body };
  transactionToSave.communityid = req.augmented.user.communityid;
  transactionToSave.author = req.augmented.user.userid;
  if (transactionToSave.type === undefined) {
    transactionToSave.type = "expense";
  }
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
        data: {
          transaction: undefined,
        },
      });
    });
};
