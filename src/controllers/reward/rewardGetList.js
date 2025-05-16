require("dotenv").config();
const Reward = require("../../models/Reward.js");

module.exports = rewardGetList = (req, res, next) => {
  /*
  
  sends back the list of rewards
  
  possible response types
  * reward.getlist.success
  * reward.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("reward.getlist");
  }

  // Setting up filters
  var filters = {};
  if (req.body.status !== undefined) {
    filters.status = req.body.status;
  } else {
    filters.status = { $not: { state: "expired" } };
  }

  Reward.find(filters)
    .then((rewards) => {
      return res.status(200).json({
        type: "reward.getlist.success",
        data: {
          rewards: rewards,
        },
      });
    })
    .catch((error) => {
      console.log("reward.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "reward.getlist.error.onfind",
        error: error,
      });
    });
};
