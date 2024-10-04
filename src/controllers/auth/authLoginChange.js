require("dotenv").config();
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");

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
    if (req.body.encryption === true) {
      attemptToken = CryptoJS.AES.decrypt(
        attemptToken,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
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
        User.findOne({ 
          userid: decodedToken.userid, 
          loginchange: decodedToken.loginchange, 
          login: decodedToken.login
        })
          .then((user) => {
            if (user === null) {
              console.log("auth.changelogin.notfound");
              return res.status(404).json({
                type: "auth.changelogin.error.notfound",
              });
            } else {
              console.log("auth.changelogin.found");
              let attemptPassword = req.body.password
						  if (req.body.encryption === true) {
								attemptPassword = CryptoJS.AES.decrypt(
								attemptPassword,
								process.env.ENCRYPTION_KEY
								).toString(CryptoJS.enc.Utf8);
						  }
				      bcrypt
				        .compare(attemptPassword, user.password)
				        .then((valid) => {
				          if (!valid) {
										console.log("bcrypt.compare", valid)
				            // Account for attempt ?
				            
				            // Deny access
				            console.log("auth.changelogin.error.invalidpassword");
				            return res.status(401).json({
				              type: "auth.changelogin.error.invalidpassword",
				            });
				          } else {
					          let userToSave = {...user._doc}
			              userToSave.loginchange = userToSave.login
			              delete userToSave.loginchange
			              User.replaceOne(
			                {userid: userToSave.userid},
			                userToSave
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