require("dotenv").config();
const Tag = require("../../models/Tag.js");

module.exports = tagCreate = (req, res, next) => {
  /*
  
  create a tag
  
  possible response types
  * tag.create.success
  * tag.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("tag.create");
  }

  let tagToSave = { ...req.body }
  tagToSave.communityid = req.augmented.user.communityid
  tagToSave = new Tag(tagToSave);

  // Save
  tagToSave
    .save()
    .then(() => {
      console.log("tag.create.success");
      return res.status(201).json({
        type: "tag.create.success",
        data: {
          tag: tagToSave,
        },
      });
    })
    .catch((error) => {
      console.log("tag.create.error");
      console.error(error);
      return res.status(400).json({
        type: "tag.create.error",
        error: error,
        data: {
          tagid: "",
        },
      });
    });
};
