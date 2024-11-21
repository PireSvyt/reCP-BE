require("dotenv").config();
const User = require("../../models/User.js");
const userEncrypt = require("../../utils/userEncrypt.js");

module.exports = userSave = (req, res, next) => {
  /*

  saves a user

  possible response types
  - user.save.error.userid
  - user.save.success.modified
  - user.save.error.onmodify

  */

  if (process.env.DEBUG) {
  console.log("user.save");
  }

  // Save
  if (req.body.userid === "" || req.body.userid === undefined) {
    console.log("user.save.error.userid");
    return res.status(503).json({
      type: "user.save.error.userid",
    });
  } else {
    // Modify
    let userToSave = userEncrypt(req.body);
    // Save
    userToSave.lastconnections = []
    User.updateOne(
      {
        userid: userToSave.userid,
      },
      userToSave
    )
      .then(() => {
        console.log("user.save.success.modified");
        return res.status(200).json({
          type: "user.save.success.modified",
          user: userToSave,
        });
      })
      .catch((error) => {
        console.log("user.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "user.save.error.onmodify",
          error: error,
        });
      });
  }
};