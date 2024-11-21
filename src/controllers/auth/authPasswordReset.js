require("dotenv").config();
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const fieldDecrypt = require("../../utils/fieldDecrypt.js");
const fieldEncrypt = require("../../utils/fieldEncrypt.js");

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
    jwt.verify(attemptToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("auth.passwordreset.error.invalidtoken");
        console.error(err);
        return res.status(400).json({
          type: "auth.passwordreset.error.invalidtoken",
          error: err,
        });
      } else {
        let decodedToken = jwt_decode(attemptToken);
        let encryptedLogin = fieldEncrypt(decodedToken.login)
        // Save
        User.findOne({ 
          userid: decodedToken.userid, 
          passwordtoken: decodedToken.passwordtoken, 
          login: { $in : [ decodedToken.login, encryptedLogin ] }
        })
          .then((user) => {
            if (user === null) {
              console.log("auth.passwordreset.notfound");
              return res.status(404).json({
                type: "auth.passwordreset.error.notfound",
              });
            } else {
              console.log("auth.passwordreset.found");
              let attemptPassword = req.body.password
              if (req.body.encryption === true) {
                attemptPassword = fieldDecrypt(attemptPassword);
              }
              let edits = { 
                password: attemptPassword,
                lastconnections: user.lastconnections === undefined ? [] : user.lastconnections
              }
              User.updateOne(
                { userid: user.userid },
                { "$set": edits,
                  "$unset": {
                    passwordtoken: true
                  }
                }
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