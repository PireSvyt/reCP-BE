require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");
const appFireRecurringJobs = require("../app/appFireRecurringJobs.js");

module.exports = authAssess = (req, res, next) => {
  /*
  
  assess the data in a jwt
  
  possible response types
  * auth.assess.success.validtoken
  * auth.assess.error.invalidtoken
  * auth.assess.error.nulltoken
  
  */

  if (process.env.DEBUG) {
    console.log("auth.assess");
  }

  // Assess
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null || token === undefined) {
    console.log("auth.assess.error.nulltoken");
    return res.status(401).json({
      type: "auth.assess.error.nulltoken",
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log("auth.assess.error.invalidtoken");
        return res.status(404).json({
          type: "auth.assess.error.invalidtoken",
          error: err,
        });
      }
      // Token is valid
      console.log("auth.assess.success.validtoken");
      const decodedToken = jwt_decode(token);
      // Record connection
      User.updateOne(
        { userid: decodedToken.userid },
        { lastconnection : Date.now() }
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
		      return res.status(200).json({
		        type: "auth.assess.success.validtoken",
		      });
	      })
	    // Fire recurring jobs
	    appFireRecurringJobs()
	    .then(() => {
        console.log("seems appFireRecurringJobs succeeded");		    
      })
      .catch((error) => {
        console.log("seems appFireRecurringJobs failed", error);
      })
    });
  }
};