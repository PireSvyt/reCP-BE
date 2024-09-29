require("dotenv").config();
const jwt = require("jsonwebtoken");
const userRecordConnection = require("../user/userRecordConnection.js");

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
  if (req.body.token === null || req.body.token === undefined) {
    console.log("auth.assess.error.nulltoken");
    return res.status(401).json({
      type: "auth.assess.error.nulltoken",
    });
  } else {
    jwt.verify(req.body.token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log("auth.assess.error.invalidtoken");
        return res.status(404).json({
          type: "auth.assess.error.invalidtoken",
          error: err,
        });
      }
      // Token is valid
      console.log("auth.assess.success.validtoken");
      // Record connection
      userRecordConnection(req)
        .then(() => {
		      return res.status(200).json({
		        type: "auth.assess.success.validtoken",
		      });
	      })
    });
  }
};