require("dotenv").config();
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("../../utils/random_string.js");
const jwt = require("jsonwebtoken");
const fieldEncrypt = require("../../utils/fieldEncrypt.js");

module.exports = authSendPassword = (req, res, next) => {
  /*
  
  sent reset password email to a user
  
  possible response types
  * auth.sendpassword.success
  * auth.sendpassword.error.accountnotfound
  * auth.sendpassword.error.onfind
  * auth.sendpassword.error.updatingtoken
  * auth.sendpassword.error.sendingemail
  
  */

  if (process.env.DEBUG) {
    console.log("auth.sendpassword");
  }

  User.find({})
  .then((users) => {
		let decryptedUsers = []
		users.forEach(user => {
			let decryptedUser = userDecrypt(user._doc)
			if (decryptedUser.login === req.body.login) {
				decryptedUsers.push(decryptedUser)
			}
		})
		if (decryptedUsers.length !== 1) {
      console.log("auth.sendpassword.error.accountnotfound");
      return res.status(404).json({
        type: "auth.sendpassword.error.accountnotfound",
      });
		} else {
			let user = decryptedUsers[0]      
        let passwordtoken = random_string(20)
        let edits = { 
          passwordtoken: passwordtoken,
          lastconnections: user.lastconnections === undefined ? [] : user.lastconnections
        }
        User.updateOne(
          { userid: user.userid },
          { "$set": 
            edits
          }
        )
          .then(() => {
            serviceMailing("resetpassword", {
              token: jwt.sign(
                {
                  userid: user.userid,
                  login: userDecrypt(user.login),
                  passwordtoken: passwordtoken,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "2d",
                }
              ),
              userlogin: userDecrypt(user.login),
              username: userDecrypt(user.name)
            }).then((mailing) => {
              if (mailing.type === "mail.mailing.success") {
                console.log("auth.sendpassword.success");
                return res.status(200).json({
                  type: "auth.sendpassword.success",
                });
              } else {
                console.log("auth.sendpassword.error.sendingemail");
                return res.status(400).json({
                  type: "auth.sendpassword.error.sendingemail",
                });
              }
            });
          })
          .catch((error) => {
            console.log("auth.sendpassword.error.updatingtoken");
            console.error(error);
            return res.status(400).json({
              type: "auth.sendpassword.error.updatingtoken",
              error: error,
            });
          });
      } 
    })
    .catch((error) => {
      console.log("auth.sendpassword.error.onfind");
      console.error(error);
      return res.status(404).json({
        type: "auth.sendpassword.error.onfind",
        error: error,
      });
    });
};