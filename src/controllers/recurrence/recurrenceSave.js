require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Recurrence = require("../../models/Recurrence.js");

module.exports = recurrenceSave = (req, res, next) => {
  /*
  
  saves a recurrence
  
  possible response types
  * recurrence.save.error.recurrenceid
  * recurrence.save.success.modified
  * recurrence.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.save");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  // Save
  if (req.body.recurrenceid === "" || req.body.recurrenceid === undefined) {
    console.log("recurrence.save.error.recurrenceid");
    return res.status(503).json({
      type: "recurrence.save.error.recurrenceid",
      error: error,
    });
  } else {
    // Modify
    let recurrenceToSave = { ...req.body };
    let unset = {};
    if (recurrenceToSave.suspendeddate === undefined) {
      recurrenceToSave.suspendeddate = undefined;
    }
    if (recurrenceToSave.enddate === undefined) {
      recurrenceToSave.enddate = undefined;
    }

    // Save
    Recurrence.updateMany(
      {
        recurrenceid: recurrenceToSave.recurrenceid,
      },
      recurrenceToSave,
      { overwriteDiscriminatorKey: true }
    )
      .then(() => {
        console.log("recurrence.save.success.modified");
        return res.status(200).json({
          type: "recurrence.save.success.modified",
          recurrence: recurrenceToSave,
        });
      })
      .catch((error) => {
        console.log("recurrence.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "recurrence.save.error.onmodify",
          error: error,
        });
      });
  }
};
