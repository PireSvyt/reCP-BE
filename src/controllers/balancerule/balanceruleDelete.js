require("dotenv").config();
const BalanceRule = require("../../models/BalanceRule.js");

module.exports = balanceruleDelete = (req, res, next) => {
  /*

...

possible response types

- balancerule.delete.success
- balancerule.delete.error.ondeletebalancerule

*/

  if (process.env.DEBUG) {
    console.log("balancerule.delete", req.params);
  }

  BalanceRule.deleteOne({ balanceruleid: req.params.balanceruleid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("balancerule.delete.success");
        return res.status(200).json({
          type: "balancerule.delete.success",
          data: {
            outcome: deleteOutcome,
            balanceruleid: req.params.balanceruleid,
          },
        });
      } else {
        console.log("balancerule.delete.error.outcome");
        return res.status(400).json({
          type: "balancerule.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("balancerule.delete.error.ondeletebalancerule");
      console.error(error);
      return res.status(400).json({
        type: "balancerule.delete.error.ondeletebalancerule",
        error: error,
      });
    });
};
