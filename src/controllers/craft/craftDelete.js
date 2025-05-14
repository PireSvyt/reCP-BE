require("dotenv").config();
const Craft = require("../../models/Craft.js");

module.exports = craftDelete = (req, res, next) => {
  /*
  
  deletes a craft
  
  possible response types
  * craft.delete.success
  * craft.delete.error.ondeletegames
  * craft.delete.error.ondeletecraft
  
  */

  if (process.env.DEBUG) {
    console.log("craft.delete", req.params);
  }

  Craft.deleteOne({ craftid: req.params.craftid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("craft.delete.success");
        return res.status(200).json({
          type: "craft.delete.success",
          data: { outcome: deleteOutcome, craftid: req.params.craftid },
        });
      } else {
        console.log("craft.delete.error.outcome");
        return res.status(400).json({
          type: "craft.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("craft.delete.error.ondeletecraft");
      console.error(error);
      return res.status(400).json({
        type: "craft.delete.error.ondeletecraft",
        error: error,
      });
    });
};
