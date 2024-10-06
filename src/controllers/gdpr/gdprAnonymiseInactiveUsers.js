require("dotenv").config();
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");

module.exports = gdprAnonymiseInactiveUsers = (req, res, next) => {
  /*
  
  anonymise users which are not active for more than a year
  
  possible response types
  * gdpr.anonymiseusers.success
  * gdpr.anonymiseusers.error.onfind
  * gdpr.anonymiseusers.error.modify
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.anonymiseusers");
  }
  
  let nowDate = Date.now();
  let thresholdDate = new Date(nowDate - (1000 * 3600 * 24) * 365);

  User.find(
	{ 
		lastconnection: {$lt: thresholdDate},
		state: { "$ne": "active" } 
	})
	.then(users => {
		if (users.length > 0) {
			let outcomes = []
			users.forEach(async user => {
				User.updateOne(
					{ userid: user.userid},
					{ "$set": 
						{ 
							schema: "anonymized",
							state: "anonymous",
							name: "NONAME-" + random_string(24),
							login: "NOLOGIN-" + random_string(24),
							password: "NOPASSWORD-" + random_string(24)
						},
						"$unset": {
							loginchange: "NOLOGIN-" + random_string(24),
							passwordtoken: "NOTOKEN-" + random_string(24)
						}
					}
				)
				.then((outcome) => {
					outcomes.push(outcome)	  
				})
			})
			console.log("gdpr.anonymiseusers.success");
			res.status(200)
			res.json({
				type: "gdpr.anonymiseusers.success",
				outcome: outcomes
			});	
		} else {
			console.log("gdpr.anonymiseusers.success");
			res.status(200)
			res.json({
			type: "gdpr.anonymiseusers.success",
			outcome: "no user to anonymise"
			});	
		}
	})
	.catch((error) => {
		console.log("gdpr.anonymiseusers.error.onfind");
	console.error(error);
	res.status(400)
	res.json({
		type: "gdpr.anonymiseusers.error.onfind",
		error: error,
	});
	})
};