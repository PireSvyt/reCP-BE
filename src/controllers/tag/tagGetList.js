require("dotenv").config();
const Tag = require("../../models/Tag.js");

module.exports = tagGetList = (req, res, next) => {
  /*
  
  sends back the list of categories
  
  possible response types
  * tag.getlist.success
  * tag.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("tag.getlist");
  }

  Tag.find({}, "tagid name")
    .then((categories) => {
      return res.status(200).json({
        type: "tag.getlist.success",
        data: {
          categories: categories,
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
          categories: undefined,
        },
      });
    });
};
