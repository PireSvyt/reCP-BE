require("dotenv").config();
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

module.exports = authPasswordReset = (req, res, next) => {
  /*
  
  reset password leveraging double authentication
  
  possible response types
  * auth.passwordreset.success
  * auth.passwordreset.error.inputs
  * auth.passwordreset.error.invalidtoken
  * auth.passwordreset.error.onfind
  * auth.passwordreset.error.onmodify
  * auth.passwordreset.error.notfound
  
  */

  if (process.env.DEBUG) {
    console.log("auth.passwordreset");
  }

  // Save
  if ((req.body.token === "" || req.body.token === undefined) && 
      (req.body.password === "" || req.body.password === undefined)) {
    console.log("auth.passwordreset.error.inputs");
    return res.status(503).json({
      type: "auth.passwordreset.error.inputs",
    });
  } else {
    // Modify
    let attemptToken = req.body.token
    if (req.body.encryption === true) {
      attemptToken = CryptoJS.AES.decrypt(
        attemptToken,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
    let userRequest = { ...req.body };
    jwt.verify(attemptToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("auth.passwordreset.error.invalidtoken");
        console.error(err);
        return res.status(400).json({
          type: "auth.passwordreset.error.invalidtoken",
          error: err,
        });
      } else {
        const decodedToken = jwt_decode(attemptToken);
        userRequest.passwordtoken = decodedToken.passwordtoken
        // Save
        User.findOne({ passwordtoken: userRequest.passwordtoken, login: userRequest.login })
          .then((user) => {
            if (user === null) {
              console.log("auth.passwordreset.notfound");
              return res.status(404).json({
                type: "auth.passwordreset.error.notfound",
              });
            } else {
              console.log("auth.passwordreset.found");
              let userToSave = {...user._doc}
              let attemptPassword = req.body.password
              if (req.body.encryption === true) {
                attemptPassword = CryptoJS.AES.decrypt(
                  attemptPassword,
                  process.env.ENCRYPTION_KEY
                ).toString(CryptoJS.enc.Utf8);
              }
              userToSave.password = attemptPassword
              delete userToSave.passwordtoken
              User.replaceOne(
                {userid: userToSave.userid},
                userToSave
              )
                .then(() => {
                  console.log("auth.passwordreset.success");
                  return res.status(200).json({
                    type: "auth.passwordreset.success",
                  });
                })
                .catch((error) => {
                  console.log("auth.passwordreset.error.onmodify");
                  console.error(error);
                  return res.status(400).json({
                    type: "auth.passwordreset.error.onmodify",
                    error: error,
                  });
                });
            }
          })
          .catch((error) => {
            console.log("auth.passwordreset.error.onfind");
            console.error(error);
            return res.status(400).json({
              type: "auth.passwordreset.error.onfind",
              error: error,
            });
          });
      }
    });
  }
};