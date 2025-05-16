require("dotenv").config();
const Reward = require("../../models/Reward.js");

module.exports = rewardExpire = (req, res, next) => {
  /*
  
  expire a reward
  
  possible response types
  * reward.expire.success
  * reward.expire.error
  * reward.expire.erroronupdate
  
  */

  if (process.env.DEBUG) {
    console.log("reward.expire");
  }

  // Setting up filters
  var filters = {};
  if (req.body.rewardids !== undefined) {
    filters.rewardid = req.body.rewardids;
  }
  if (req.body.state !== undefined) {
    filters.state = req.body.state;
  }

  Reward.find(filters)
    .then((rewards) => {
      let rewardsToSave = [];
      let bulkRewards = [];
      rewards.forEach((reward) => {
        let rewardToSave = { ...reward };
        rewardToSave.state = "expired";
        rewardsToSave.push(rewardToSave);
        bulkRewards.push({
          updateOne: {
            filter: { rewardid: reward.rewardid },
            update: rewardsToSave,
          },
        });
      });

      // Updates
      let outcome = {
        rewards: { state: "pending", count: null },
      };
      function updateObject(obj, count) {
        outcome[obj].state = "done";
        outcome[obj].count = count;
      }
      function errorObject(obj, error) {
        //console.log(obj + " error", error);
        outcome[obj].state = "error";
        outcome[obj].count = 0;
        outcome[obj].error = error;
      }

      let promises = [];
      promises.push(
        Reward.bulkWrite(bulkRewards)
          .then((rewardOutcome) => {
            updateObject("rewards", rewardOutcome.modifiedCount);
          })
          .catch((error) => {
            //console.log("rewards error", error);
            errorObject("rewards", error);
          })
      );

      // Fire promises
      Promise.all(promises)
        .then(() => {
          console.log("reward.expire.success");
          return res.status(200).json({
            type: "reward.expire.success",
            data: {
              rewards: rewardsToSave,
              outcome: outcome.rewards,
            },
          });
        })
        .catch((error) => {
          console.log("reward.expire.error.onupdate");
          console.error(error);
          return res.status(400).json({
            type: "reward.expire.erroronupdate",
            error: error,
            data: {
              outcome: outcome.rewards,
            },
          });
        });
    })
    .catch((error) => {
      console.log("reward.expire.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "reward.expire.error.onfind",
        error: error,
      });
    });
};
