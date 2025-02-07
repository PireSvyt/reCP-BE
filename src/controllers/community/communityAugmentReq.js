require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communityAugmentReq = (req, res, next) => {
  if (process.env.DEBUG) {
    console.log("community.getmine");
  }

  Community.aggregate([
    {
      $match: { communityid: req.augmented.user.communityid },
    },
    {
      $project: {
        _id: 0,
        communityid: 1,
        name: 1,
        members: 1,
      },
    },
  ])
    .then((communities) => {
      req.augmented = {
        community: communities[0],
      };
      next();
    })
    .catch((error) => {
      console.log("community.augmentreq.error.onaggreate");
      console.error(error);
      return res.status(400).json({
        type: "community.augmentreq.error.onaggreate",
        error: error,
      });
    });
};
