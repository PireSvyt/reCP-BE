require("dotenv").config();
const Transaction = require("../../models/Transaction.js");
const compare_date = require("../../utils/compare_date.js");

module.exports = transactionGetList = (req, res, next) => {
  /*

sends back the transaction list

possible response types
- transaction.getlist.success
- transaction.getlist.error.noneed
- transaction.getlist.error.needmissmatch
- transaction.getlist.error.onfind

inputs
- need
- transactions
- - number
- - lastid (optional)
- filters (optional)
- - amount min max
- - date min max
- - categories (categoryid) / nocategory + categories not in
- - by
- - text
- - tags (tagid) / notag only
- - treatment (exit / entry / saving / budgettarget)

*/

  if (process.env.DEBUG) {
    console.log("transaction.getlist");
  }

  // Initialize
  var status = 500;
  var type = "transaction.getlist.error";
  var fields = "";
  var filters = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "transaction.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "list":
        fields =
          "transactionid date name by for amount categoryid tagids treatment budgetid";
        break;
      default:
        status = 403;
        type = "transaction.getlist.error.needmissmatch";
    }
  }

  // Setting up filters
  if (req.body.filters !== undefined) {
    if (req.body.filters.amount !== undefined) {
      if (req.body.filters.amount.min !== undefined) {
        filters.amount = { $gte: req.body.filters.amount.min };
      }
      if (req.body.filters.amount.max !== undefined) {
        if (req.body.filters.amount.min !== undefined) {
          filters.amount = {
            $gte: req.body.filters.amount.min,
            $lte: req.body.filters.amount.max,
          };
        } else {
          filters.amount = { $lte: req.body.filters.amount.max };
        }
      }
    }
    if (req.body.filters.date !== undefined) {
      if (req.body.filters.date.min !== undefined) {
        filters.date = { $gte: req.body.filters.date.min };
      }
      if (req.body.filters.date.max !== undefined) {
        if (req.body.filters.date.min !== undefined) {
          filters.date = {
            $gte: req.body.filters.date.min,
            $lte: req.body.filters.date.max,
          };
        } else {
          filters.date = { $lte: req.body.filters.date.max };
        }
      }
    }
    if (req.body.filters.categories !== undefined) {
      filters.categoryid = { $in: req.body.filters.categories };
    }
    if (req.body.filters.nocategory !== undefined) {
      let categories = req.body.filters.categories;
      categories.push(null);
      filters.categoryid = { $not: { $in: categories } };
    }
    if (req.body.filters.tags !== undefined) {
      filters.tagids = {
        $elemMatch: { tagid: { $in: req.body.filters.tags } },
      };
    }
    if (req.body.filters.by !== undefined) {
      filters.by = req.body.filters.by;
    }
    if (req.body.filters.text !== undefined) {
      filters.name = new RegExp(req.body.filters.text, "i");
    }
    if (req.body.filters.treatment !== undefined) {
      filters.treatment = req.body.filters.treatment;
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
    Transaction.find(filters, fields)
      .then((transactions) => {
        transactions.sort(compare_date);
        let action = "error";

        // Remove expenses which do not concern the user
        transactions = transactions.filter((transaction) => {
          return (
            transaction.by === req.augmented.user.userid ||
            transaction.for.includes(req.augmented.user.userid)
          );
        });

        // Are transactions already loaded
        let lastidpos = 0;
        if (req.body.transactions.lastid !== undefined) {
          // Find last transaction loaded
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
          lastidpos + req.body.transactions.number + 1 // to N+M, ex. 0+10
        );

        // Check if more
        // transactions [ N ... N+M ] length = M+1, ex. 0-10 -> 11 transactions
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
        console.log("transaction.getlist.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "transaction.getlist.error.onfind",
          error: error,
          data: {
            transactions: undefined,
            action: "error",
          },
        });
      });
  }
};
