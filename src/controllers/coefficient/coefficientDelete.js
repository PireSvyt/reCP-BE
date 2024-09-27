require("dotenv").config();
const Coefficient = require("../../models/Coefficient.js");

module.exports = coefficientDelete = (req, res, next) => {
  /*

deletes a balance rule

possible response types

- coefficient.delete.success
- coefficient.delete.error.ondeletecoefficient

*/

  if (process.env.DEBUG) {
    console.log("coefficient.delete", req.params);
  }

  Coefficient.deleteOne({ coefficientid: req.params.coefficientid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("coefficient.delete.success");
        return res.status(200).json({
          type: "coefficient.delete.success",
          data: {
            outcome: deleteOutcome,
            coefficientid: req.params.coefficientid,
          },
        });
      } else {
        console.log("coefficient.delete.error.outcome");
        return res.status(400).json({
          type: "coefficient.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("coefficient.delete.error.ondeletecoefficient");
      console.error(error);
      return res.status(400).json({
        type: "coefficient.delete.error.ondeletecoefficient",
        error: error,
      });
    });
};
