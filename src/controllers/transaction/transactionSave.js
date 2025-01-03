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

// Save
if (req.body.transactionid === "" || req.body.transactionid === undefined) {
console.log("transaction.save.error.transactionid");
return res.status(503).json({
type: "transaction.save.error.transactionid",
error: error,
});
} else {
// Modify
let transactionToSave = { ...req.body };
transactionToSave.communityid = req.augmented.user.communityid

// Save
Transaction.updateOne(
  {
    transactionid: transactionToSave.transactionid,
    communityid: req.augmented.user.communityid
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