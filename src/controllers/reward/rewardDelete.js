require("dotenv").config();
const Reward = require("../../models/Reward.js");

module.exports = rewardDelete = (req, res, next) => {
  /*
  
  deletes a reward
  
  possible response types
  * reward.delete.success
  * reward.delete.error.ondeletegames
  * reward.delete.error.ondeletereward
  
  */

  if (process.env.DEBUG) {
    console.log("reward.delete", req.params);
  }

  Reward.deleteOne({ rewardid: req.params.rewardid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("reward.delete.success");
        return res.status(200).json({
          type: "reward.delete.success",
          data: { outcome: deleteOutcome, rewardid: req.params.rewardid },
        });
      } else {
        console.log("reward.delete.error.outcome");
        return res.status(400).json({
          type: "reward.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("reward.delete.error.ondeletereward");
      console.error(error);
      return res.status(400).json({
        type: "reward.delete.error.ondeletereward",
        error: error,
      });
    });
};
