require("dotenv").config();
const User = require("../../models/User.js");
const fieldEncrypt = require("../../utils/fieldEncrypt.js");
const userDecrypt = require("../user/services/userDecrypt.js")

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
      // Encryption check
      let bulkUsers = []
      users.forEach(user => {
        let userToSave = {...user._doc}
        let toSave = false
        if (userToSave.__enc_name !== true) {
          userToSave.name = fieldEncrypt(userToSave.name)
          userToSave.__enc_name = true
          toSave = true
        }
        if (userToSave.__enc_login !== true) {
          userToSave.login = fieldEncrypt(userToSave.login)
          userToSave.__enc_login = true
          toSave = true
        }
        if (userToSave.__enc_loginchange !== true && userToSave.loginchange !== undefined) {
          userToSave.loginchange = fieldEncrypt(userToSave.loginchange)
          userToSave.__enc_loginchange = true
          toSave = true
        }
        if (toSave) {
          bulkUsers.push({
            updateOne: {
              filter: { userid: userToSave.userid },
              update: userToSave
            }
          })
        }
      })
      if (bulkUsers.length > 0) {
        console.log("adminUserGetList encrypting " + bulkUsers.length + " users")
        User.bulkWrite(bulkUsers)
        .then(outcome => {
          console.log("adminUserGetList encrypting outcome", outcome)
        })
        .catch((error) => {
          console.log("adminUserGetList encrypting  error", error);
        });

      }
      // Response
      let usersToSend = []
      users.forEach(user => {
        usersToSend.push(userDecrypt(user._doc))
      })
      return res.status(200).json({
        type: "admin.user.getlist.success",
        data: {
          users: usersToSend,
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