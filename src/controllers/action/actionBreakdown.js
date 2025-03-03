require("dotenv").config();
const Action = require("../../models/Action.js");
const computeActionBreakdown = require("./services/computeActionBreakdown.js");

module.exports = actionBeakdown = (req, res, next) => {
  /*

sends back the breakdown computed from Actions

possible response types
- action.breakdown.success
- action.breakdown.error.noneed
- action.breakdown.error.needmissmatch
- action.breakdown.error.onfind

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
    console.log("action.breakdown");
  }

  // Initialize
  var status = 500;
  var type = "action.breakdown.error";
  var fields = "actionid date name by for amount categoryid treatment";
  var filters = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "action.breakdown.error.noneed";
  } else {
    if (
      req.body.need.audience === undefined ||
      req.body.need.audience === "" ||
      req.body.need.to === undefined ||
      req.body.need.to === "" ||
      req.body.need.since === undefined ||
      req.body.need.since === "" ||
      Date.parse(req.body.need.since) > Date.now()
    ) {
      status = 403;
      type = "action.breakdown.error.needmissmatch";
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
    Action.find(filters, fields)
      .then((actions) => {
        let breakdown = computeActionBreakdown(req, actions, req.body.need);
        // Response
        console.log("action.breakdown.success");
        return res.status(200).json({
          type: "action.breakdown.success",
          data: {
            breakdown: breakdown,
          },
        });
      })
      .catch((error) => {
        console.log("action.breakdown.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "action.breakdown.error.onfind",
          error: error,
        });
      });
  }
};
