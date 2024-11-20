require("dotenv").config();
const User = require("../../models/User.js");

module.exports = adminUserGetList = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * admin.user.getlist.success
  * admin.user.getlist.error
  
  */

  if (process.env.DEBUG) {
    console.log("admin.admin.user.getlist");
  }

  User.find({})
    .then((users) => {
      let usersToSend = []
      users.forEach(user => {
        let userToSend = {...user}
        userToSend.decryptFieldsSync()
        userToSend.stripEncryptionFieldMarkers()
        usersToSend.push(userToSend)
      })
      return res.status(200).json({
        type: "admin.user.getlist.success",
        data: {
          users: users,
        },
      });
    })
    .catch((error) => {
      console.log("admin.user.getlist.error");
      console.error(error);
      res.status(400).json({
        type: "admin.user.getlist.error",
        error: error,
      });
    });
};