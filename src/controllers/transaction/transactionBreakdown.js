require("dotenv").config();
const Transaction = require("../../models/Transaction.js");
const Coefficient = require("../../models/Coefficient.js");
const computeTransactionBreakdown = require("./services/computeTransactionBreakdown.js");

module.exports = computeBeakdown = (req, res, next) => {
  /*

sends back the breakdown computed from transactions

possible response types
- transaction.breakdown.success
- transaction.breakdown.error.noneed
- transaction.breakdown.error.needmissmatch
- transaction.breakdown.error.onfind

inputs
- need
- - since (date)
- - to (date)
- - personal (boolean)
- filters (optional)
- - by
- members (required if personal need)

*/

  if (process.env.DEBUG) {
    console.log("transaction.breakdown");
  }

  // Initialize
  var status = 500;
  var type = "transaction.breakdown.error";
  var fields = "transactionid date name by for amount categoryid";
  var filters = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "transaction.breakdown.error.noneed";
  } else {
    if (
      req.body.need.since === undefined ||
      req.body.need.since === "" ||
      req.body.need.to === undefined ||
      req.body.need.to === "" ||
      Date.parse(req.body.need.since) > Date.now()
    ) {
      status = 403;
      type = "transaction.breakdown.error.needmissmatch";
    }
  }

  // Setting up filters
  filters.date = {
    $gte: req.body.need.since,
    $lte: req.body.need.to,
  };
  if (req.body.filters !== undefined) {
    if (req.body.filters.by !== undefined) {
      filters.by = req.body.filters.by;
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
    });
  } else {
    Transaction.find(filters, fields)
      .then((transactions) => {
        if (req.body.need.personal === true) {
          let coefficients = [];
          Coefficient.find({ communityid: req.augmented.user.communityid })
            .then((coefficientList) => {
              coefficients = [...coefficientList];
              coefficients = coefficients.sort((a, b) => {
                return a.startdate - b.startdate;
              });
              breakdown = computeTransactionBreakdown(
                req,
                transactions,
                req.body.need,
                coefficients
              );
              // Response
              console.log("transaction.breakdown.success");
              return res.status(200).json({
                type: "transaction.breakdown.success",
                data: {
                  breakdown: breakdown,
                },
              });
            })
            .catch((error) => {
              console.log("transaction.breakdown.error.onfind");
              console.error(error);
              return res.status(400).json({
                type: "transaction.breakdown.error.onfind",
                error: error,
              });
            });
        } else {
          breakdown = computeTransactionBreakdown(
            req,
            transactions,
            req.body.need
          );
          // Response
          console.log("transaction.breakdown.success");
          return res.status(200).json({
            type: "transaction.breakdown.success",
            data: {
              breakdown: breakdown,
            },
          });
        }
      })
      .catch((error) => {
        console.log("transaction.breakdown.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "transaction.breakdown.error.onfind",
          error: error,
        });
      });
  }
};
