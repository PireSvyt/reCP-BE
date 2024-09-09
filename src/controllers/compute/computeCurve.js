require("dotenv").config();
const Transaction = require("../../models/Transaction.js");
const compare_date = require("../../utils/compare_date.js");
const computeTransactionCurve = require("./services/computeTransactionCurve.js");

module.exports = computeCurve = (req, res, next) => {
  /*
  
  sends back the curve computed from transactions
  
  possible response types
  * compute.curve.success
  * compute.curve.error.noneed
  * compute.curve.error.needmissmatch
  * compute.curve.error.onfind
  
  inputs
  * need
  * - since
  * - by (in days)
  * filters (optional)
  * - categories (categoryid)
  * - by

  */

  if (process.env.DEBUG) {
    console.log("compute.curve");
  }

  // Initialize
  var status = 500;
  var type = "compute.curve.error";
  var fields = "transactionid date name by for amount categoryid";
  var filters = {};

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "compute.curve.error.noneed";
  } else {
    if (
      req.body.need.by === undefined || req.body.need.by === ""
      req.body.need.for === undefined || req.body.need.for === "" ||
      Date.parse(req.body.need.since) > Date.now()
    ) {
      status = 403;
      type = "compute.curve.error.needmissmatch";
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
      data: {
        curve: undefined,
      },
    });
  } else {
    Transaction.find(filters, fields)
      .then((transactions) => {
        transactions.sort(compare_date);

        curve = computeTransactionCurve(transactions, req.body.need);

        // Response
        console.log("compute.curve.success");
        return res.status(200).json({
          type: "compute.curve.success",
          data: {
            curve: curve,
          },
        });
      })
      .catch((error) => {
        console.log("compute.curve.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "compute.curve.error.onfind",
          error: error,
          data: {
            curve: undefined,
          },
        });
      });
  }
};
