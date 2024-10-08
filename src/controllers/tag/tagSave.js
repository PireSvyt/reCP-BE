require("dotenv").config();
const Tag = require("../../models/Tag.js");

module.exports = tagSave = (req, res, next) => {
  /*
  
  saves a tag
  
  possible response types
  * tag.save.error.tagid
  * tag.save.success.modified
  * tag.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("tag.save");
  }

  // Save
  if (req.body.tagid === "" || req.body.tagid === undefined) {
    console.log("tag.save.error.tagid");
    return res.status(503).json({
      type: "tag.save.error.tagid",
      error: error,
    });
  } else {
    // Modify
    let tagToSave = { ...req.body };
    delete tagToSave.communityid

    // Save
    Tag.updateOne(
      {
        tagid: tagToSave.tagid,
        communityid: req.augmented.user.communityid 
      },
      tagToSave
    )
      .then(() => {
        console.log("tag.save.success.modified");
        return res.status(200).json({
          type: "tag.save.success.modified",
          tag: tagToSave,
        });
      })
      .catch((error) => {
        console.log("tag.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "tag.save.error.onmodify",
          error: error,
        });
      });
  }
};
