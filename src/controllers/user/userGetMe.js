require("dotenv").config();
const User = require("../../models/User.js");
const fieldEncryption = require('mongoose-field-encryption');

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

  const defaultSaltGenerator = (secret) => crypto.randomBytes(16);
  const _hash = (secret) => crypto.createHash("sha256").update(secret).digest("hex").substring(0, 32);

  User.find({ userid: req.augmented.user.userid }, "userid communityid name login loginchange type __enc_name __enc_login __enc_loginchange")
    .then((users) => {
      if (users.length === 0) {
        console.log("user.getme.error.onoutcume");
        return res.status(400).json({
          type: "user.getme.error.onoutcume"
        });
      } else {
	      let userToSend = {...users[0]._doc}
        // Decryption
        if (userToSend.__enc_name) {
          userToSend.name = fieldEncryption.decrypt(userToSend.name, _hash(process.env.ENCRYPTION_KEY))
          delete userToSend.__enc_name
        }
        if (userToSend.__enc_login) {
          userToSend.login = fieldEncryption.decrypt(userToSend.login, _hash(process.env.ENCRYPTION_KEY))
          delete userToSend.__enc_login
        }
        if (userToSend.__enc_loginchange) {
          userToSend.loginchange = fieldEncryption.decrypt(userToSend.loginchange, _hash(process.env.ENCRYPTION_KEY))
          delete userToSend.__enc_loginchange
        }
        console.log("userToSend", userToSend)
        if (userToSend.communityid !== undefined) {
          if (userToSend.communityid.includes("NOCOMMUNITY")) {
            delete userToSend.communityid
          }
        }
        return res.status(200).json({
          type: "user.getme.success",
          data: {
            user: userToSend,
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