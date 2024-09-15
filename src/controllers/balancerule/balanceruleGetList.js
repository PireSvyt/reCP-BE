require("dotenv").config();
const BalanceRule = require("../../models/BalanceRule.js");

module.exports = balanceruleGetList = (req, res, next) => {
  /*

sends back the list of balance rules

possible response types

- balancerule.getlist.success
- balancerule.getlist.error.onfind

*/

  if (process.env.DEBUG) {
    console.log("balancerule.getlist");
  }

  BalanceRule.find({}, "balanceruleid startdate enddate categories ratios")
    .then((balancerules) => {
      return res.status(200).json({
        type: "balancerule.getlist.success",
        data: {
          balancerules: balancerules,
        },
      });
    })
    .catch((error) => {
      console.log("balancerule.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "balancerule.getlist.error.onfind",
        error: error,
        data: {
          balancerules: undefined,
        },
      });
    });
};
