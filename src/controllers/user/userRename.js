require("dotenv").config();
const User = require("../../models/User.js");
const fieldEncrypt = require("../../utils/fieldEncrypt.js");

module.exports = communityRename = (req, res, next) => {
/*

renames a user

possible response types
- user.rename.success
- user.rename.error.inputs
- user.rename.error.onmodify

*/

if (process.env.DEBUG) {
	console.log("user.rename");
}

if (req.body.name === undefined || req.body.name === "") {
  console.log("user.rename.error.inputs");
  return res.status(403).json({
    type: "user.rename.error.inputs",
  });
} else {
	// Save
	let edits = { 
		name: fieldEncrypt(req.body.name, "BE"),
		__enc_name: true
	}
	User.updateOne(
	  {
	    userid: req.augmented.user.userid,
	  },
	  edits
	)
	  .then(() => {
	    console.log("user.rename.success");
	    return res.status(200).json({
	      type: "user.rename.success",
	      data: {name: req.body.name},
	    });
	  })
	  .catch((error) => {
	    console.log("user.rename.error.onmodify");
	    console.error(error);
	    return res.status(400).json({
	      type: "user.rename.error.onmodify",
	      error: error,
	    });
	  });
	}
};