require("dotenv").config();
const Coefficient = require("../../models/Coefficient.js");

module.exports = communityAugmentReq = (req, res, next) => {
  if (process.env.DEBUG) {
    console.log("coefficient.augmentreq");
  }

  Coefficient.aggregate([
    {
      $match: { communityid: req.augmented.user.communityid },
    },
    {
      $project: {
        _id: 0,
        coefficientid: 1,
        startdate: 1,
        enddate: 1,
        categoryids: 1,
        userratios: 1,
      },
    },
  ])
    .then((coefficients) => {
      let coefficientList = [...coefficients];
      coefficientList = coefficientList.sort((a, b) => {
        return a.startdate - b.startdate;
      });
      req.augmented = {
        coefficients: coefficientList,
      };
      next();
    })
    .catch((error) => {
      console.log("coefficient.augmentreq.error.onaggreate");
      console.error(error);
      return res.status(400).json({
        type: "coefficient.augmentreq.error.onaggreate",
        error: error,
      });
    });
};
