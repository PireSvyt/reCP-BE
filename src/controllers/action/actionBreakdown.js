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
  * audience: personal, community
  * graph: breakdownbymember
  * by: count, duration
  * to: date for date range end
  * since: date for date range start
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
  var filters = {
    communityid: req.augmented.user.communityid,
    done: true,
  };

  // Is need input relevant?
  allowedAudiences = ["personal", "community"];
  allowedGraph = ["breakdownbymember"];
  allowedBy = ["count", "duration"];
  if (!req.body.need) {
    status = 403;
    type = "action.breakdown.error.noneed";
  } else {
    if (
      !allowedAudiences.includes(req.body.need.audience) ||
      !allowedGraph.includes(req.body.need.graph) ||
      !allowedBy.includes(req.body.need.by) ||
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
    $gte: new Date(req.body.need.since),
    $lte: new Date(req.body.need.to),
  };
  if (req.body.need !== undefined) {
    if (req.body.need.audience !== undefined) {
      filters.audience = req.body.need.audience;
      if (req.body.need.audience === "personal") {
        filters.doneby = req.augmented.user.userid;
      }
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
    });
  } else {
    console.log("filters", filters);
    Action.find(filters)
      .then((actions) => {
        console.log("actions", actions.length);
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
