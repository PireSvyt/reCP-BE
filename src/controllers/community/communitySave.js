require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communitySave = (req, res, next) => {
/*

saves a community

possible response types
- community.save.error.communityid
- community.save.success.modified
- community.save.error.onmodify

*/

if (process.env.DEBUG) {
console.log("community.save");
}

// Save
if (req.body.communityid === "" || req.body.communityid === undefined) {
console.log("community.save.error.communityid");
return res.status(503).json({
type: "community.save.error.communityid",
error: error,
});
} else {
// Modify
let communityToSave = { ...req.body };

// Save
Community.updateOne(
  {
    communityid: communityToSave.communityid,
  },
  communityToSave
)
  .then(() => {
    console.log("community.save.success.modified");
    return res.status(200).json({
      type: "community.save.success.modified",
      community: communityToSave,
    });
  })
  .catch((error) => {
    console.log("community.save.error.onmodify");
    console.error(error);
    return res.status(400).json({
      type: "community.save.error.onmodify",
      error: error,
    });
  });
}
};