require("dotenv").config();
const Action = require("../../models/Action.js");

module.exports = actionDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * action.delete.success
  * action.delete.error.ondeletegames
  * action.delete.error.ondeleteaction
  
  */

  if (process.env.DEBUG) {
    console.log("action.delete", req.params);
  }

  Action.deleteOne({ actionid: req.params.actionid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("action.delete.success");
        return res.status(200).json({
          type: "action.delete.success",
          data: {
            outcome: deleteOutcome,
            actionid: req.params.actionid,
          },
        });
      } else {
        console.log("action.delete.error.outcome");
        return res.status(400).json({
          type: "action.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("action.delete.error.ondeleteaction");
      console.error(error);
      return res.status(400).json({
        type: "action.delete.error.ondeleteaction",
        error: error,
      });
    });
};
