require("dotenv").config();
const Recurrence = require("../../models/Recurrence.js");

module.exports = recurrenceDelete = (req, res, next) => {
  /*
  
  deletes a recurrence
  
  possible response types
  * recurrence.delete.success
  * recurrence.delete.error.ondeletegames
  * recurrence.delete.error.ondeleterecurrence
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.delete", req.params);
  }

  Recurrence.deleteOne({ recurrenceid: req.params.recurrenceid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("recurrence.delete.success");
        return res.status(200).json({
          type: "recurrence.delete.success",
          data: {
            outcome: deleteOutcome,
            recurrenceid: req.params.recurrenceid,
          },
        });
      } else {
        console.log("recurrence.delete.error.outcome");
        return res.status(400).json({
          type: "recurrence.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("recurrence.delete.error.ondeleterecurrence");
      console.error(error);
      return res.status(400).json({
        type: "recurrence.delete.error.ondeleterecurrence",
        error: error,
      });
    });
};
