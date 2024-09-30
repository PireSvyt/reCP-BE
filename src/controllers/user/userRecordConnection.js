require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userRecordConnection = async (userid) => {
  /*
  
  records the connection of a user
  triggered by
  * authAssess
  * authSignIn
  
  */

  if (process.env.DEBUG) {
    console.log("user.recordconnection");
  }

  User.updateOne(
	  { userid: userid },
	  { lastconnection : Date.now() }
  ).then((outcome) => {
      console.log("user.recordconnection.success");
      console.error(outcome);
      return
    })
    .catch((error) => {
      console.log("user.recordconnection.error");
      console.error(error);
      return
    });
};