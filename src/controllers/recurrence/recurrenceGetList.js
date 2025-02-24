require("dotenv").config();
const Recurrence = require("../../models/Recurrence.js");

module.exports = recurrenceGetList = (req, res, next) => {
  /*
  
  sends back the list of recurrences
  
  possible response types
  * recurrence.getlist.success
  * recurrence.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.getlist");
  }

  Recurrence.find(
    { communityid: req.augmented.user.communityid },
    "recurrenceid audience name active recurrence reminder for sincedate suspendeddate enddate notes duration"
  )
    .then((recurrences) => {
      // Filter
      recurrencesToSend = recurrences.filter((recurrence) => {
        return (
          recurrence.audience === "community" ||
          (recurrence.audience === "personal" &&
            recurrence.for.includes(req.augmented.user.userid))
        );
      });
      return res.status(200).json({
        type: "recurrence.getlist.success",
        data: {
          recurrences: recurrencesToSend,
        },
      });
    })
    .catch((error) => {
      console.log("recurrence.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "recurrence.getlist.error.onfind",
        error: error,
        data: {
          recurrences: undefined,
        },
      });
    });
};
