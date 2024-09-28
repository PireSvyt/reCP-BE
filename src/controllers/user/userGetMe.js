require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userGetMe = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.getme.success
  * user.getme.error.onfind
  * user.getme.error.onoutcume
  
  */

  if (process.env.DEBUG) {
    console.log("user.getme");
  }

  User.findOne({ userid: req.augmented.user.userid }, "userid communityid name type")
    .then((user) => {
      if (user === undefined) {
        console.log("user.getme.error.onoutcume");
        return res.status(400).json({
          type: "user.getme.error.onoutcume",
          data: {
            user: undefined,
          },
        });
      } else {
        return res.status(200).json({
          type: "user.getme.success",
          data: {
            user: user,
          },
        });
      }
    })
    .catch((error) => {
      console.log("user.getme.error.onfind");
      console.error(error);
      res.status(400).json({
        type: "user.getme.error.onfind",
        error: error,
      });
    });
};