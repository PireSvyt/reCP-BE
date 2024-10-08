require("dotenv").config();
const User = require("../../models/User.js");

module.exports = adminUserUpdateMany = (req, res, next) => {
  /*
  
  edits many users
  
  possible response types
  * admin.user.updatemany.success
  * admin.user.updatemany.error
  
  */

  if (process.env.DEBUG) {
    console.log("admin.admin.user.updatemany");
  }

  User.updateMany(
	  { userid: { $in: req.body.userids } },
	  req.body.edits
  )
    .then((users) => {
      return res.status(200).json({
        type: "admin.user.updatemany.success",
        data: {
          users: users,
        },
      });
    })
    .catch((error) => {
      console.log("admin.user.updatemany.error");
      console.error(error);
      res.status(400).json({
        type: "admin.user.updatemany.error",
        error: error,
      });
    });
};