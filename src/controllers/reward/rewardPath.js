require("dotenv").config();
const Reward = require("../../models/Reward.js");
const Craft = require("../../models/Craft.js");

module.exports = rewardPath = (req, res, next) => {
  /*
  
  saves a reward
  
  possible response types
  * reward.path.success
  * reward.path.error.inputs
  * reward.path.error.onfindreward
  * reward.path.error.onfindcrafts
  
  */

  if (process.env.DEBUG) {
    console.log("reward.path");
  }

  // Save
  if (req.body.rewardid === "" || req.body.rewardid === undefined) {
    console.log("reward.path.error.inputs");
    return res.status(503).json({
      type: "reward.path.error.inputs",
      error: error,
    });
  } else {
    Reward.find({ rewardid: req.body.rewardid })
      .then((reward) => {
        Craft.find()
          .then((crafts) => {
            function craftPath(craftid, need) {
              let craft = crafts.filter((c) => c.craftid == craftid)[0];
              let path = {
                craftid: craftid,
                need: need,
                duration: craft.duration * need,
                energy: craft.energy * need,
                skillid: craft.skillid,
                level: level.skillid,
                depenencies: [],
              };

              let totalduration = path.duration;
              let totalenergy = path.energy;

              // Dependencies
              if (craft.dependencies !== undefined) {
                if (craft.dependencies.length > 0) {
                  craft.dependencies.forEach((dependency) => {
                    let dependencyPath = craftPath(
                      dependency.craftid,
                      dependency.need
                    );
                    totalduration += dependencyPath.totalduration;
                    totalenergy += dependencyPath.totalenergy;
                    path.dependencies.push(dependencyPath);
                  });
                }
              }

              path.totalduration = totalduration;
              path.totalenergy = totalenergy;

              return path;
            }

            rewardpath = craftPath(reward.craftid, reward.need);
            console.log("reward.path.success");
            return res.status(200).json({
              type: "reward.path.success",
              path: rewardpath,
            });
          })
          .catch((error) => {
            console.log("reward.path.error.onfindcrafts");
            console.error(error);
            return res.status(400).json({
              type: "reward.path.error.onfindcrafts",
              error: error,
            });
          });
      })
      .catch((error) => {
        console.log("reward.path.error.onfindreward");
        console.error(error);
        return res.status(400).json({
          type: "reward.path.error.onfindreward",
          error: error,
        });
      });
  }
};
