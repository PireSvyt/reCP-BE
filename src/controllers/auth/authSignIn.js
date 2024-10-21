require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const serviceGetNextAllowedAttempt = require("./services/serviceGetNextAllowedAttempt.js")

module.exports = authSignIn = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  possible response types
  * auth.signin.success
  * auth.signin.error.toomanyattempts
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
      } else if (user.state === "anonymous") {
        // Inexisting user
        console.log("auth.signin.error.notfound");
        return res.status(404).json({
          type: "auth.signin.error.notfound",
        });
      } else {
	      // Check attempts
	      let nextAllowedAttempt = serviceGetNextAllowedAttempt(user.failedconnections)
	      if (nextAllowedAttempt.delayed === true) {
				  // Deny access with delay
          console.log("auth.signin.error.toomanyattempts");
          return res.status(401).json({
            type: "auth.signin.error.toomanyattempts",
            nextattempt: nextAllowedAttempt.date,
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
		      bcrypt
		        .compare(attemptPassword, user.password)
		        .then((valid) => {
		          if (!valid) {
								console.log("bcrypt.compare", valid)
		            // Account for attempt ?
		            let failedconnections
		            if (user.failedconnections === undefined) {
			            failedconnections = [ Date.now() ]
		            } else {
			            failedconnections = [...user.failedconnections]
			            failedconnections.push( Date.now() )
		            }	            
		            // Record failed attempt
		            User.updateOne(
									{ userid: user.userid },
									{ "$set": { 
										  failedconnections : failedconnections 
									  }
					        }
								).then((outcome) => {
									if (outcome.acknowledged) {
									  console.log("user.recordfailedconnections.success");
									} else {
									  console.log("user.recordfailedconnections.failed");
									}
							  })
							  .catch((error) => {
									console.log("user.recordfailedconnections.error");
									console.error(error);
							  })
							  .then(() => {
								  nextAllowedAttempt = serviceGetNextAllowedAttempt(failedconnections)
								  if (nextAllowedAttempt.delayed === true) {
									  // Deny access with delay
				            console.log("auth.signin.error.toomanyattempts");
				            return res.status(401).json({
				              type: "auth.signin.error.toomanyattempts",
				              nextattempt: nextAllowedAttempt.date,
				            });
								  } else {
				            // Only deny access
				            console.log("auth.signin.error.invalidpassword");
				            return res.status(401).json({
				              type: "auth.signin.error.invalidpassword",
				            });
								  }
							  })	            
		          } else {	
		            // Record connection & clear previous attempts
								User.updateOne(
									{ userid: user.userid },
									{ "$set": { 
										  lastconnection : Date.now() ,
										  failedconnections: []
									  }
					        }
								).then((outcome) => {
									if (outcome.acknowledged) {
									  console.log("user.recordconnection.success");
									} else {
									  console.log("user.recordconnection.failed");
									}
							  })
							  .catch((error) => {
									console.log("user.recordconnection.error");
									console.error(error);
							  })
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