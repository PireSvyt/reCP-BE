require("dotenv").config();
const Community = require("../../models/Community.js");
const random_string = require("../../utils/random_string.js");

module.exports = adminCommunityCreate = (req, res, next) => {
  /*

create a community

possible response types
- admin.community.create.success
- admin.community.create.error

*/

  if (process.env.DEBUG) {
    console.log("admin.community.create");
  }

  let communityToSave = { ...req.body }
  communityToSave.communityid = random_string(24), 
  communityToSave = new Community(communityToSave);
  
  // Save
  communityToSave.save()
    .then(() => {
      console.log("admin.community.create.success");
      return res.status(201).json({
        type: "admin.community.create.success",
        data: {
          community: communityToSave,
        },
      });
    })
    .catch((error) => {
      console.log("admin.community.create.error");
      console.error(error);
      return res.status(400).json({
        type: "admin.community.create.error",
        error: error,
      });
    });
};