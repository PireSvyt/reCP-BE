require("dotenv").config();
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");

module.exports = adminUserCreate = (req, res, next) => {
  /*

create a user

possible response types
- admin.user.create.success
- admin.user.create.error
- admin.user.create.invaid

defaults if not provided
- type: user
- state: inactive

assumptions
- existing community with provided communityid
- password is to reset

*/

  if (process.env.DEBUG) {
    console.log("admin.user.create");
  }

  let userToSave = { ...req.body }
  userToSave.userid = random_string(24)
  if (userToSave.type === undefined) {
	  userToSave.type = "user"
  }
  if (userToSave.state === undefined) {
	  userToSave.state = "inactive"
  }  
  userToSave.password = "TO RESET"
  userToSave = new User(userToSave);
  
  if (userToSave.login === undefined || userToSave.login === "" ||
	  userToSave.name === undefined || userToSave.name === "" ||
	  userToSave.communityid === undefined || userToSave.communityid === "" ) {
	  console.log("admin.user.create.invaid");
    return res.status(400).json({
      type: "admin.user.create.invaid",
    });
  } else {
	  // Save
	  userToSave.save()
	    .then(() => {
	      console.log("admin.user.create.success");
	      return res.status(201).json({
	        type: "admin.user.create.success",
	        data: {
	          user: userToSave,
	        },
	      });
	    })
	    .catch((error) => {
	      console.log("admin.user.create.error");
	      console.error(error);
	      return res.status(400).json({
	        type: "admin.user.create.error",
	        error: error,
	      });
	    });
  }
  
};