require("dotenv").config();
const jwt_decode = require("jwt-decode");
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

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

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

    // Save
    Category.updateOne(
      {
        categoryid: categoryToSave.categoryid,
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
