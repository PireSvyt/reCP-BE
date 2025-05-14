require("dotenv").config();
const Reward = require("../../models/Reward.js");

module.exports = rewardSave = (req, res, next) => {
  /*
  
  saves a reward
  
  possible response types
  * reward.save.error.rewardid
  * reward.save.success.modified
  * reward.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("reward.save");
  }

  // Save
  if (req.body.rewardid === "" || req.body.rewardid === undefined) {
    console.log("reward.save.error.rewardid");
    return res.status(503).json({
      type: "reward.save.error.rewardid",
      error: error,
    });
  } else {
    // Modify
    let rewardToSave = { ...req.body };

    // Save
    Reward.updateOne(
      {
        rewardid: rewardToSave.rewardid,
      },
      rewardToSave
    )
      .then(() => {
        console.log("reward.save.success.modified");
        return res.status(200).json({
          type: "reward.save.success.modified",
          reward: rewardToSave,
        });
      })
      .catch((error) => {
        console.log("reward.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "reward.save.error.onmodify",
          error: error,
        });
      });
  }
};
