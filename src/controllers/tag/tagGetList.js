require("dotenv").config();
const Tag = require("../../models/Tag.js");

module.exports = tagGetList = (req, res, next) => {
  /*
  
  sends back the list of tags
  
  possible response types
  * tag.getlist.success
  * tag.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tag.getlist");
  }

  Tag.find({ communityid: req.augmented.user.communityid  }, 
    "tagid name type color")
    .then((tags) => {
      return res.status(200).json({
        type: "tag.getlist.success",
        data: {
          tags: tags,
        },
      });
    })
    .catch((error) => {
      console.log("tag.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "tag.getlist.error.onfind",
        error: error,
        data: {
          tags: undefined,
        },
      });
    });
};