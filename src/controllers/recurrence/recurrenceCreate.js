require("dotenv").config();
const Recurrence = require("../../models/Recurrence.js");

module.exports = recurrenceCreate = (req, res, next) => {
  /*
  
  create a recurrence
  
  possible response types
  * recurrence.create.success
  * recurrence.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.create");
  }

  let recurrenceToSave = { ...req.body }
  recurrenceToSave.communityid = req.augmented.user.communityid
  recurrenceToSave = new Recurrence(recurrenceToSave);

  // Save
  recurrenceToSave
    .save()
    .then(() => {
      console.log("recurrence.create.success");
      return res.status(201).json({
        type: "recurrence.create.success",
        data: {
          recurrence: recurrenceToSave,
        },
      });
    })
    .catch((error) => {
      console.log("recurrence.create.error");
      console.error(error);
      return res.status(400).json({
        type: "recurrence.create.error",
        error: error,
        data: {
          recurrenceid: "",
        },
      });
    });
};
