require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
var random_string = require("../../utils/random_string.js");
const jwt = require("jsonwebtoken");

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

  let attemptLogin = req.body.login
  if (req.body.encryption === true) {
	attemptLogin = CryptoJS.AES.decrypt(
		attemptLogin,
		process.env.ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8);
  }

  User.findOne({ login: attemptLogin })
    .then((user) => {
      if (user) {
        User.updateOne(
          { userid: user.userid },
          { "$set": { 
            passwordtoken : random_string(20)
            }
          }
        )
          .then(() => {
			      /*let decodedLogin = CryptoJS.AES.decrypt(
			          user.login,
			          process.env.ENCRYPTION_KEY,
			      ).toString(CryptoJS.enc.Utf8);*/
            serviceMailing("resetpassword", {
              token: jwt.sign(
                {
                  userid: user.userid,
                  login: user.login,
                  passwordtoken: user.passwordtoken,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "2d",
                }
              ),
              //userlogin: decodedLogin
              userlogin: user.login,
              username: user.name
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
      } else {
        console.log("auth.sendpassword.error.accountnotfound");
        return res.status(404).json({
          type: "auth.sendpassword.error.accountnotfound",
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