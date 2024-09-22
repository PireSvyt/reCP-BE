require("dotenv").config();
const Tag = require("../../models/Tag.js");

module.exports = tagDelete = (req, res, next) => {
  /*
  
  deletes a tag
  
  possible response types
  * tag.delete.success
  * tag.delete.error.ondeletegames
  * tag.delete.error.ondeletetag
  
  */

  if (process.env.DEBUG) {
    console.log("tag.delete", req.params);
  }

  Tag.deleteOne({ tagid: req.params.tagid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("tag.delete.success");
        return res.status(200).json({
          type: "tag.delete.success",
          data: { outcome: deleteOutcome, tagid: req.params.tagid },
        });
      } else {
        console.log("tag.delete.error.outcome");
        return res.status(400).json({
          type: "tag.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("tag.delete.error.ondeletetag");
      console.error(error);
      return res.status(400).json({
        type: "tag.delete.error.ondeletetag",
        error: error,
      });
    });
};
