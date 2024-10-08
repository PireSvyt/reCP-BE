require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");

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
    let userToSave = { ...req.body };

		/*
    if (req.body.encryption === false) {
      if (userToSave.name !== undefined) {
        userToSave.name = CryptoJS.AES.decrypt(
          userToSave.name,
          process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
      }
      if (userToSave.login !== undefined) {
        userToSave.login = CryptoJS.AES.decrypt(
          userToSave.login,
          process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
      }
    }
    */

    // Save
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