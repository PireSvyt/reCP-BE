require("dotenv").config();
const Reward = require("../../models/Reward.js");

module.exports = rewardCreate = (req, res, next) => {
  /*
  
  create a reward
  
  possible response types
  * reward.create.success
  * reward.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("reward.create");
  }

  let rewardToSave = { ...req.body };
  rewardToSave = new Reward(rewardToSave);

  // Save
  rewardToSave
    .save()
    .then(() => {
      console.log("reward.create.success");
      return res.status(201).json({
        type: "reward.create.success",
        data: {
          reward: rewardToSave,
        },
      });
    })
    .catch((error) => {
      console.log("reward.create.error");
      console.error(error);
      return res.status(400).json({
        type: "reward.create.error",
        error: error,
        data: {
          rewardid: "",
        },
      });
    });
};
