require("dotenv").config();
const Action = require("../../models/Action.js");

module.exports = actionSave = (req, res, next) => {
  /*

saves a action

possible response types
- action.save.error.actionid
- action.save.success.modified
- action.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("action.save");
  }

  // Save
  if (req.body.actionid === "" || req.body.actionid === undefined) {
    console.log("action.save.error.actionid");
    return res.status(503).json({
      type: "action.save.error.actionid",
      error: error,
    });
  } else {
    // Modify
    let actionToSave = { ...req.body };
    delete actionToSave.communityid;
    if (actionToSave.done === true) {
      if (actionToSave.doneby === undefined) {
        actionToSave.doneby = req.augmented.user.userid;
      }
      if (actionToSave.donedate === undefined) {
        actionToSave.donedate = new Date();
      }
    }
    if (actionToSave.audience === "personal") {
      if (actionToSave.for.length !== 1) {
        actionToSave.for = [{ userid: req.augmented.user.userid }];
      }
    }

    // Save
    Action.updateOne(
      {
        actionid: actionToSave.actionid,
        communityid: req.augmented.user.communityid,
      },
      actionToSave
    )
      .then(() => {
        console.log("action.save.success.modified");
        return res.status(200).json({
          type: "action.save.success.modified",
          action: actionToSave,
        });
      })
      .catch((error) => {
        console.log("action.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "action.save.error.onmodify",
          error: error,
        });
      });
  }
};
