require("dotenv").config();
const Transaction = require("../../models/Transaction.js");
const Coefficient = require("../../models/Coefficient.js");
const compare_date = require("../../utils/compare_date.js");
const computeTransactionCurve = require("./services/computeTransactionCurve.js");

module.exports = computeCurve = (req, res, next) => {
/*

sends back the curve computed from transactions

possible response types
- transaction.curve.success
- transaction.curve.error.noneed
- transaction.curve.error.needmissmatch
- transaction.curve.error.onfind

inputs
- need
- - since
- - by (in days)
- - personal (boolean)
- filters (optional)
- - categories (categoryid)
- - by
- members (required if personal need)

*/

if (process.env.DEBUG) {
  console.log("transaction.curve");
}

// Initialize
var status = 500;
var type = "transaction.curve.error";
var fields = "transactionid date name by for amount categoryid";
var filters = { communityid: req.augmented.user.communityid };

// Is need input relevant?
if (!req.body.need) {
  status = 403;
  type = "transaction.curve.error.noneed";
} else {
  if (
    req.body.need.by === undefined || req.body.need.by === "" ||
    req.body.need.for === undefined || req.body.need.for === "" ||
    Date.parse(req.body.need.since) > Date.now()
  ) {
    status = 403;
    type = "transaction.curve.error.needmissmatch";
  }
}

// Setting up filters
filters.date = { $gte: req.body.need.since };
if (req.body.filters !== undefined) {
  if (req.body.filters.categories !== undefined) {
    filters.categoryid = { $in: req.body.filters.categories };
  }
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
transactions.sort(compare_date);
    if (req.body.need.personal === true) {
      let coefficients = [];
      Coefficient.find({ communityid: req.augmented.user.communityid })
        .then((coefficientList) => {
          coefficients = [...coefficientList];
          coefficients = coefficients.sort((a, b) => {
            return a.startdate - b.startdate;
          });
          curve = computeTransactionCurve(req, transactions, req.body.need, coefficients);
          // Response
          console.log("transaction.curve.success");
          return res.status(200).json({
            type: "transaction.curve.success",
            data: {
              curve: curve,
            },
          });
        })
        .catch((error) => {
          console.log("transaction.curve.error.onfind");
          console.error(error);
          return res.status(400).json({
            type: "transaction.curve.error.onfind",
            error: error,
          });
        });
    } else {
      curve = computeTransactionCurve(req, transactions, req.body.need);
      // Response
      console.log("transaction.curve.success");
      return res.status(200).json({
        type: "transaction.curve.success",
        data: {
          curve: curve,
        },
      });
    }
  })
  .catch((error) => {
    console.log("transaction.curve.error.onfind");
    console.error(error);
    return res.status(400).json({
      type: "transaction.curve.error.onfind",
      error: error,
    });
  });
}
};
