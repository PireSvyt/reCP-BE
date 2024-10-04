require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communityRename = (req, res, next) => {
/*

renames a community

possible response types
- community.rename.success
- community.rename.error.inputs
- community.rename.error.onmodify

*/

if (process.env.DEBUG) {
	console.log("community.rename");
}

if (req.body.name === undefined || req.body.name === "") {
  console.log("community.rename.error.inputs");
  return res.status(403).json({
    type: "community.rename.error.inputs",
  });
} else {
	// Save
	Community.updateOne(
	  {
	    communityid: req.augmented.user.communityid,
	  },
	  { name: req.body.name}
	)
	  .then(() => {
	    console.log("community.rename.success");
	    return res.status(200).json({
	      type: "community.rename.success",
	      data: {name: req.body.name},
	    });
	  })
	  .catch((error) => {
	    console.log("community.rename.error.onmodify");
	    console.error(error);
	    return res.status(400).json({
	      type: "community.rename.error.onmodify",
	      error: error,
	    });
	  });
	}
};