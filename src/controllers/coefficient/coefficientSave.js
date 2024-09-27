require("dotenv").config();
const Coefficient = require("../../models/Coefficient.js");

module.exports = coefficientSave = (req, res, next) => {
  /*

saves a coefficient

possible response types

- coefficient.save.error.coefficientid
- coefficient.save.success.modified
- coefficient.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("coefficient.save");
  }

  // Save
  if (req.body.coefficientid === "" || req.body.coefficientid === undefined) {
    console.log("coefficient.save.error.coefficientid");
    return res.status(503).json({
      type: "coefficient.save.error.coefficientid",
    });
  } else {
    // Modify
    let coefficientToSave = { ...req.body };
    coefficientToSave.communityid = req.augmented.user.communityid
    
    // Save
    Coefficient.replaceOne(
      {
        coefficientid: coefficientToSave.coefficientid,
        communityid: req.augmented.user.communityid
      },
      coefficientToSave
    )
      .then(() => {
        console.log("coefficient.save.success.modified");
        return res.status(200).json({
          type: "coefficient.save.success.modified",
          coefficient: coefficientToSave,
        });
      })
      .catch((error) => {
        console.log("coefficient.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "coefficient.save.error.onmodify",
          error: error,
        });
      });
  }
};
