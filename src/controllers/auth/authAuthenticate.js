require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

module.exports = authAuthenticate = (req, res, next) => {
  /*
  
  authenticate the data in a jwt
  
  possible response types
  * auth.authenticate.error.invalidtoken
  * auth.authenticate.error.nulltoken
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticate");
  }

  // Prep
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  if (token === null) {
    console.log("auth.authenticate.error.nulltoken");
    return res.status(403).json({
      type: "auth.authenticate.error.nulltoken",
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("auth.authenticate.error.invalidtoken");
        return res.status(403).json({
          type: "auth.authenticate.error.invalidtoken",
          error: err,
        });
      }
      req.augmented = {
        user: {
          userid: decodedToken.userid,
          type: decodedToken.type,
          communityid: decodedToken.communityid
        }
      }
      next();
    });
  }
};