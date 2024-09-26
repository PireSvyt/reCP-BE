require("dotenv").config();
const Coefficient = require("../../models/Coefficient.js");

module.exports = coefficientGetList = (req, res, next) => {
  /*

sends back the list of balance rules

possible response types

- coefficient.getlist.success
- coefficient.getlist.error.onfind

*/

  if (process.env.DEBUG) {
    console.log("coefficient.getlist");
  }

  Coefficient.find({ communityid: req.augmented.user.communityid }, "coefficientid startdate enddate categories ratios")
    .then((coefficients) => {
      return res.status(200).json({
        type: "coefficient.getlist.success",
        data: {
          coefficients: coefficients,
        },
      });
    })
    .catch((error) => {
      console.log("coefficient.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "coefficient.getlist.error.onfind",
        error: error,
        data: {
          coefficients: undefined,
        },
      });
    });
};
