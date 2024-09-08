require("dotenv").config();
const Category = require("../../models/Category.js");

module.exports = categoryDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * category.delete.success
  * category.delete.error.ondeletegames
  * category.delete.error.ondeletecategory
  
  */

  if (process.env.DEBUG) {
    console.log("category.delete", req.params);
  }

  Category.deleteOne({ categoryid: req.params.categoryid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("category.delete.success");
        return res.status(200).json({
          type: "category.delete.success",
          data: { outcome: deleteOutcome, categoryid: req.params.categoryid },
        });
      } else {
        console.log("category.delete.error.outcome");
        return res.status(400).json({
          type: "category.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("category.delete.error.ondeletecategory");
      console.error(error);
      return res.status(400).json({
        type: "category.delete.error.ondeletecategory",
        error: error,
      });
    });
};
