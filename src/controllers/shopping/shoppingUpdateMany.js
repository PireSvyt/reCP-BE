require("dotenv").config();
const Transaction = require("../../models/Transaction.js");

module.exports = transactionUpdateMany = (req, res, next) => {
  /*
  
  update transactions
  
  possible response types
  * transaction.updatemany.success
  * transaction.updatemany.error
  
  possible edits
  * - categoryid
  
  */

  if (process.env.DEBUG) {
    console.log("transaction.updatemany");
  }

  // Initialize
  var status = 500;
  var type = "transaction.updatemany.error";
  var filters = {};
  var changes = {};

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "transaction.updatemany.error.noneed";
  } else {
    switch (req.body.need) {
      case "categoryid":
        filters = { transactionid: { $in: req.body.transactions } };
        changes = { categoryid: req.body.newValue };
        break;
      default:
        status = 403;
        type = "transaction.updatemany.error.needmissmatch";
    }
  }

  // Update
  Transaction.updateMany(filters, changes)
    .then((outcome) => {
      if (outcome.nModified === req.body.transactions.length) {
        console.log("transaction.updatemany.success");
        Transaction.find(filters)
          .then((transactions) => {
            return res.status(201).json({
              type: "transaction.updatemany.success",
              data: {
                outcome: outcome,
                transactions: transactions,
              },
            });
          })
          .catch((error) => {
            console.log("transaction.updatemany.erroronfind");
            console.error(error);
            return res.status(400).json({
              type: "transaction.updatemany.erroronfind",
              error: error,
              data: {
                outcome: null,
              },
            });
          });
      } else {
        console.log("transaction.updatemany.partial");
        Transaction.find(filters)
          .then((transactions) => {
            return res.status(201).json({
              type: "transaction.updatemany.partial",
              data: {
                outcome: outcome,
                transactions: transactions,
              },
            });
          })
          .catch((error) => {
            console.log("transaction.updatemany.erroronfind");
            console.error(error);
            return res.status(400).json({
              type: "transaction.updatemany.erroronfind",
              error: error,
              data: {
                outcome: null,
              },
            });
          });
      }
    })
    .catch((error) => {
      console.log("transaction.updatemany.error");
      console.error(error);
      return res.status(400).json({
        type: "transaction.updatemany.error",
        error: error,
        data: {
          outcome: null,
        },
      });
    });
};
