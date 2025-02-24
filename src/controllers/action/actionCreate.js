require("dotenv").config();
const Action = require("../../models/Action.js");

module.exports = actionCreate = (req, res, next) => {
  /*

create a action

possible response types
- action.create.success
- action.create.error

*/

  if (process.env.DEBUG) {
    console.log("action.create");
  }

  let actionToSave = { ...req.body };
  actionToSave.communityid = req.augmented.user.communityid;
  actionToSave = new Action(actionToSave);
  if (actionToSave.audience === "personal") {
    if (actionToSave.for.length !== 1) {
      actionToSave.for = [{ userid: req.augmented.user.userid }];
    }
  }

  // Save
  actionToSave
    .save()
    .then(() => {
      console.log("action.create.success");
      return res.status(201).json({
        type: "action.create.success",
        data: {
          action: actionToSave,
        },
      });
    })
    .catch((error) => {
      console.log("action.create.error");
      console.error(error);
      return res.status(400).json({
        type: "action.create.error",
        error: error,
        data: {
          action: undefined,
        },
      });
    });
};
