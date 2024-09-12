require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Action = require("../../models/Action.js");

module.exports = actionCreate = (req, res, next) => {
  /*
  
  create a action
  
  possible response types
  * action.create.success
  * action.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("action.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const actionToSave = new Action({ ...req.body });

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
          actionid: "",
        },
      });
    });
};
