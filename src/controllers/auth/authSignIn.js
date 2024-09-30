require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const userRecordConnection = require("../user/userRecordConnection.js");

module.exports = authSignIn = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  possible response types
  * auth.signin.success
  * auth.signin.error.notfound
  * auth.signin.error.onfind
  * auth.signin.error.invalidpassword
  * auth.signin.error.onpasswordcompare
  
  */

  if (process.env.DEBUG) {
    console.log("auth.signin");
  }

  let attemptLogin = req.body.login
  if (req.body.encryption === true) {
	attemptLogin = CryptoJS.AES.decrypt(
		attemptLogin,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8);
  }

  User.findOne({ login: attemptLogin })
    .then((user) => {
      if (!user) {
        // Inexisting user
        console.log("auth.signin.error.notfound");
        return res.status(404).json({
          type: "auth.signin.error.notfound",
        });
      } else {
	      // Check password
	      let attemptPassword = req.body.password
		  if (req.body.encryption === true) {
			attemptPassword = CryptoJS.AES.decrypt(
			attemptPassword,
			process.env.ENCRYPTION_KEY
			).toString(CryptoJS.enc.Utf8);
		  }
		  console.log("attemptPassword", attemptPassword)
	      bcrypt
	        .compare(attemptPassword, user.password)
	        .then((valid) => {
	          if (!valid) {
				console.log("bcrypt.compare", valid)
	            // Account for attempt ?
	            
	            // Deny access
	            console.log("auth.signin.error.invalidpassword");
	            return res.status(401).json({
	              type: "auth.signin.error.invalidpassword",
	            });
	          } else {
	            // Clear previous attempts?
	
	            // Record connection
              userRecordConnection(req)
	              .then(() => {
		              // Grant access
	                return res.status(200).json({
	                  type: "auth.signin.success",
	                  data: {
	                    token: jwt.sign(
	                      {
	                        userid: user.userid,
	                        type: user.type,
	                        communityid: user.communityid
	                      },
	                      process.env.JWT_SECRET,
	                      {
	                        expiresIn: "365d",
	                      }
	                    ),
	                  },
	                });
	              })
	          }
	        })
	        .catch((error) => {
	          console.log("auth.signin.error.onpasswordcompare", error);
	          return res.status(500).json({
	            type: "auth.signin.error.onpasswordcompare",
	            error: error,
	          });
	        });
      }
    })
    .catch((error) => {
      console.log("auth.signin.error.onfind", error);
      return res.status(500).json({
        type: "auth.signin.error.onfind",
        error: error,
      });
    });
};