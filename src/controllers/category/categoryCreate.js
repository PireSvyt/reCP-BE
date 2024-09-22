require("dotenv").config();
const Category = require("../../models/Category.js");

module.exports = categoryCreate = (req, res, next) => {
  /*
  
  create a category
  
  possible response types
  * category.create.success
  * category.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("category.create");
  }

  let categoryToSave = { ...req.body }
  categoryToSave.communityid = req.augmented.user.communityid
  categoryToSave = new Category(categoryToSave);

  // Save
  categoryToSave
    .save()
    .then(() => {
      console.log("category.create.success");
      return res.status(201).json({
        type: "category.create.success",
        data: {
          category: categoryToSave,
        },
      });
    })
    .catch((error) => {
      console.log("category.create.error");
      console.error(error);
      return res.status(400).json({
        type: "category.create.error",
        error: error,
        data: {
          categoryid: "",
        },
      });
    });
};
