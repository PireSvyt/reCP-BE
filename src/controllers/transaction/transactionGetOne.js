require("dotenv").config();
const Transaction = require("../../models/Transaction.js");

module.exports = transactionGetOne = (req, res, next) => {
  /*
  
  sends back the transaction value
  
  possible response types
  * transaction.get.success
  * transaction.get.error.notfound
  * transaction.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("transaction.getone");
  }

  Transaction.findOne({
    transactionid: req.params.transactionid
  }, 'name date by for amount categoryid')
    .then((transaction) => {
      if (transaction !== undefined) {
        console.log("transaction.get.success");
        console.log("transaction", transaction);
        // Response
        return res.status(200).json({
          type: "transaction.get.success",
          data: {
            transaction: outcome,
          },
        });
      } else {
        console.log("transaction.get.error.undefined");
        return res.status(101).json({
          type: "transaction.get.error.undefined",
          data: {
            transaction: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("transaction.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "transaction.get.error.onfind",
        error: error,
        data: {
          transaction: undefined,
        },
      });
    });
};