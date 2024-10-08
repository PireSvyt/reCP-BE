require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = adminCommunityUpdateMany = (req, res, next) => {
  /*
  
  edits many users
  
  possible response types
  * admin.community.updatemany.success
  * admin.community.updatemany.error
  
  */

  if (process.env.DEBUG) {
    console.log("admin.admin.community.updatemany");
  }

  Community.updateMany(
	  { communityid: { $in: req.body.communityids } },
	  req.body.edits
  )
    .then((communities) => {
      return res.status(200).json({
        type: "admin.community.updatemany.success",
        data: {
          communities: communities,
        },
      });
    })
    .catch((error) => {
      console.log("admin.community.updatemany.error");
      console.error(error);
      res.status(400).json({
        type: "admin.community.updatemany.error",
        error: error,
      });
    });
};