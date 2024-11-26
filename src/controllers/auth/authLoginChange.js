require("dotenv").config();
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const fieldDecrypt = require("../../utils/fieldDecrypt.js");
const fieldEncrypt = require("../../utils/fieldEncrypt.js");

module.exports = authLoginChange = (req, res, next) => {
  /*
  
  changes the login leveraging double authentication
  
  possible response types
  * auth.changelogin.success
  * auth.changelogin.error.inputs
  * auth.changelogin.error.invalidtoken
  * auth.changelogin.error.onfind
  * auth.changelogin.error.notfound
  * auth.changelogin.error.invalidpassword
  * auth.changelogin.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("auth.changelogin");
  }

  // Save
  if ((req.body.token === "" || req.body.token === undefined) && 
      (req.body.password === "" || req.body.password === undefined)) {
    console.log("auth.changelogin.error.inputs");
    return res.status(503).json({
      type: "auth.changelogin.error.inputs",
    });
  } else {
    // Modify
    let attemptToken = req.body.token
    jwt.verify(attemptToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("auth.changelogin.error.invalidtoken");
        console.error(err);
        return res.status(400).json({
          type: "auth.changelogin.error.invalidtoken",
          error: err,
        });
      } else {
        const decodedToken = jwt_decode(attemptToken);
        // Save
        User.find({})
        .then((users) => {
          let decryptedUsers = []
          users.forEach(user => {
            let decryptedUser = userDecrypt(user._doc)
            if (decryptedUser.loginchange === decodedToken.loginchange &&
              decryptedUser.userid === decodedToken.userid &&
              decryptedUser.login === decodedToken.login
            ) {
              decryptedUsers.push(decryptedUser)
            }
          })
          if (decryptedUsers.length !== 1) {
            console.log("auth.changelogin.notfound");
            return res.status(404).json({
              type: "auth.changelogin.error.notfound",
            });
          } else {
            let user = decryptedUsers[0]  
              console.log("auth.changelogin.found");
              let attemptPassword = fieldDecrypt(req.body.password, "FE")
				      bcrypt
				        .compare(attemptPassword, user.password)
				        .then((valid) => {
				          if (!valid) {				            
				            // Deny access
				            console.log("auth.changelogin.error.invalidpassword");
				            return res.status(401).json({
				              type: "auth.changelogin.error.invalidpassword",
				            });
				          } else {
                    let decryptedLoginchange = fieldDecrypt(user.loginchange, BE)
                    if (decodedToken.loginchange !== decryptedLoginchange) {
                      // Deny change
                      console.log("auth.changelogin.error.invalidloginchange");
                      return res.status(403).json({
                        type: "auth.changelogin.error.invalidloginchange",
                      });
                    } else {
                      let edits = { 
                        login : user.loginchange,
                        login_enc : true,
                        lastconnections: user.lastconnections === undefined ? [] : user.lastconnections
                      }
                      User.updateOne(
                        { userid: user.userid },
                        { "$set": edits,
                          "$unset": {
                            loginchange: true,
                            loginchange_enc: true
                          }
                        }
                      )
                      .then(() => {
                        console.log("auth.changelogin.success");
                        return res.status(200).json({
                          type: "auth.changelogin.success",
                        });
                      })
                      .catch((error) => {
                        console.log("auth.changelogin.error.onmodify");
                        console.error(error);
                        return res.status(400).json({
                          type: "auth.changelogin.error.onmodify",
                          error: error,
                        });
                      });
                    }
                  }
			          })
            }
          })
          .catch((error) => {
            console.log("auth.changelogin.error.onfind");
            console.error(error);
            return res.status(400).json({
              type: "auth.changelogin.error.onfind",
              error: error,
            });
          });
      }
    });
  }
};