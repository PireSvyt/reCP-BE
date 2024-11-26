require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User.js");
const serviceGetNextAllowedAttempt = require("./services/serviceGetNextAllowedAttempt.js")
//const fieldEncrypt = require("../../utils/fieldEncrypt.js");
const fieldDecrypt = require("../../utils/fieldDecrypt.js");
const userDecrypt = require("../user/services/userDecrypt.js");

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

  //let attemptLogin = fieldEncrypt(req.body.login, "BE")

  User.find({})
  /* Possible only if cluster is not free :/
  User.aggregate([
	{
	  	$addFields: {
			decryptedLogin: { 
				$function: {
					body: function decryptLogin(login, __enc_login) {
						if (__enc_login) {
							return fieldDecrypt(login, "BE")
						} else {
							return login
						}
					},
					args: [ "$login", "$__enc_login"],
					lang: "js"
				}
			},
		}
	},
	{
		$match: { 
			decryptedLogin: req.body.login
		}
	}
  ])*/
  //User.findOne({ login: { $in : [ attemptLogin, req.body.login ] } })
  //User.findOne({ login: attemptLogin })
    .then((users) => {
		console.log("users.length", users.length)
		let decryptedUsers = []
		users.forEach(user => {
			console.log("user._doc", user._doc)
			let decryptedUser = userDecrypt(user._doc)
			console.log("decryptedUser", decryptedUser)
			if (decryptedUser.login === req.body.login) {
				decryptedUsers.push(decryptedUser)
			}
		})
		console.log("decryptedUsers.length", decryptedUsers.length)
		console.log("decryptedUsers[0]", decryptedUsers[0])
		if (users.decryptedUsers !== 1) {
			console.log("auth.signin.error.notfound");
			return res.status(404).json({
				type: "auth.signin.error.notfound",
			});
		} else {
			let user = decryptedUsers[0]
			if (user.state === "anonymous") {
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
					let attemptPassword = fieldDecrypt(req.body.password, "FE")
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
								{ 
									userid: user.userid },
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