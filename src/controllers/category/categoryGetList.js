require("dotenv").config();
const Category = require("../../models/Category.js");

module.exports = categoryGetList = (req, res, next) => {
  /*
  
  sends back the list of categories
  
  possible response types
  * category.getlist.success
  * category.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("category.getlist");
  }

  Category.find({}, "categoryid name color")
    .then((categories) => {
      return res.status(200).json({
        type: "category.getlist.success",
        data: {
          categories: categories,
        },
      });
    })
    .catch((error) => {
      console.log("category.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "category.getlist.error.onfind",
        error: error,
        data: {
          categories: undefined,
        },
      });
    });
};
