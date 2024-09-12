require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Action = require("../../models/Action.js");

module.exports = actionSave = (req, res, next) => {
  /*
  
  saves a action
  
  possible response types
  * action.save.error.actionid
  * action.save.success.modified
  * action.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("action.save");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

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

    // Save
    Action.updateOne(
      {
        actionid: actionToSave.actionid,
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
