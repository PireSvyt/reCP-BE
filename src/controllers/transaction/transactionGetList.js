require("dotenv").config();
const Transaction = require("../../models/Transaction.js");
const compare_date = require("../../utils/compare_date.js")

module.exports = transactionGetList = (req, res, next) => {
  /*
  
  sends back the transaction list
  
  possible response types
  * transaction.getlist.success
  * transaction.getlist.error.noneed
  * transaction.getlist.error.needmissmatch
  * transaction.getlist.error.findingtransactions
  * transaction.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("transaction.getlist");
  }

  // Initialize
  var status = 500;
  var type = "table.gethistory.error";
  var fields = "";

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "transaction.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        fields = "transactionid date name by for amount categoryid";
        break;
      default:
        status = 403;
        type = "transaction.getlist.error.needmissmatch";
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
      data: {
        transactions: [],
        more: null,
        action: null,
      },
    });
  } else {
    Transaction.find({}, 'transactionid name date by for amount categoryid')
    .then((transactions) => {
            transactions.sort(compare_date);

            let action = "error";
            // Are games already loaded
            let lastidpos = 0;
            if (req.body.transactions.lastid !== undefined) {
              // Find last game loaded
              lastidpos = transactions.findIndex((transaction) => {
                return transaction.transactionid === req.body.transactions.lastid;
              });
              if (lastidpos === -1) {
                // Last id not found :/
                action = "error";
                lastidpos = 0;
              } else {
                action = "append";
                lastidpos = lastidpos + 1;
              }
            } else {
              action = "new";
            }
            // Shorten payload
            transactions = transactions.slice(
              lastidpos, // from N, ex. 0
              lastidpos + req.body.transactions.number + 1, // to N+M, ex. 0+10
            );
            // Check if more
            // games [ N ... N+M ] length = M+1, ex. 0-10 -> 11 games
            let more = transactions.length > req.body.transactions.number;
            // Shorten to desired length
            if (more === true) {
              transactions.pop();
            }

            // Response
            console.log("transaction.getlist.success");
            return res.status(200).json({
              type: "transaction.getlist.success",
              data: {
                transactions: transactions,
                more: more,
                action: action,
              },
            });
          })
          .catch((error) => {
            console.log("transaction.getlist.error.findingtransactions");
            console.error(error);
            return res.status(400).json({
              type: "table.gethistory.error.findingtransactions",
              error: error,
            });
          })
          .catch((error) => {
            console.log("transaction.getlist.error.onfind");
            console.error(error);
            return res.status(400).json({
              type: "transaction.getlist.error.onfind",
              error: error,
              data: {
                transaction: undefined,
              },
            });
          });
    }
};