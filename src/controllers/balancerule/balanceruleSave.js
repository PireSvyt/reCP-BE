require("dotenv").config();
const BalanceRule = require("../../models/BalanceRule.js");

module.exports = balanceruleSave = (req, res, next) => {
  /*

saves a balancerule

possible response types

- balancerule.save.error.balanceruleid
- balancerule.save.success.modified
- balancerule.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("balancerule.save");
  }

  // Save
  if (req.body.balanceruleid === "" || req.body.balanceruleid === undefined) {
    console.log("balancerule.save.error.balanceruleid");
    return res.status(503).json({
      type: "balancerule.save.error.balanceruleid",
      error: error,
    });
  } else {
    // Modify
    let balanceruleToSave = { ...req.body };
    balanceruleToSave.communityid = req.augmented.user.communityid
    balanceruleToSave = JSON.parse(JSON.stringify(balanceruleToSave))

    // Save
    BalanceRule.replaceOne(
      {
        balanceruleid: balanceruleToSave.balanceruleid,
        communityid: req.augmented.user.communityid
      },
      balanceruleToSave
    )
      .then(() => {
        console.log("balancerule.save.success.modified");
        return res.status(200).json({
          type: "balancerule.save.success.modified",
          balancerule: balanceruleToSave,
        });
      })
      .catch((error) => {
        console.log("balancerule.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "balancerule.save.error.onmodify",
          error: error,
        });
      });
  }
};
