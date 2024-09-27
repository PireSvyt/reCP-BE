require("dotenv").config();
const Transaction = require("../../models/Transaction.js");

module.exports = transactionDelete = (req, res, next) => {
/*

deletes a transaction

possible response types
- transaction.delete.success
- transaction.delete.error.ondeletegames
- transaction.delete.error.ondeletetransaction

*/

if (process.env.DEBUG) {
console.log("transaction.delete", req.body);
}

Transaction.deleteOne({ transactionid: req.params.transactionid, communityid: req.augmented.user.communityid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("transaction.delete.success");
return res.status(200).json({
type: "transaction.delete.success",
data: {
outcome: deleteOutcome,
transactionid: req.params.transactionid,
},
});
} else {
console.log("transaction.delete.error.outcome");
return res.status(400).json({
type: "transaction.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("transaction.delete.error.ondeletetransaction");
console.error(error);
return res.status(400).json({
type: "transaction.delete.error.ondeletetransaction",
error: error,
});
});
};