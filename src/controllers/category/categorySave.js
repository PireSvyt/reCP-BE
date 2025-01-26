require("dotenv").config();
const Category = require("../../models/Category.js");

module.exports = categorySave = (req, res, next) => {
  /*
  
  saves a category
  
  possible response types
  * category.save.error.categoryid
  * category.save.success.modified
  * category.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("category.save");
  }

  // Save
  if (req.body.categoryid === "" || req.body.categoryid === undefined) {
    console.log("category.save.error.categoryid");
    return res.status(503).json({
      type: "category.save.error.categoryid",
      error: error,
    });
  } else {
    // Modify
    let categoryToSave = { ...req.body };
    delete categoryToSave.communityid;

    // Save
    Category.updateOne(
      {
        categoryid: categoryToSave.categoryid,
        communityid: req.augmented.user.communityid,
      },
      categoryToSave
    )
      .then(() => {
        console.log("category.save.success.modified");
        return res.status(200).json({
          type: "category.save.success.modified",
          category: categoryToSave,
        });
      })
      .catch((error) => {
        console.log("category.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "category.save.error.onmodify",
          error: error,
        });
      });
  }
};
