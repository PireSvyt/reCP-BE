require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Category = require("../../models/Category.js");

module.exports = categoryCreate = (req, res, next) => {
  /*
  
  create a category
  
  possible response types
  * category.create.success
  * category.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("category.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const categoryToSave = new Category({ ...req.body });
  
  // Save
  categoryToSave
    .save()
    .then(() => {
      console.log("category.create.success");
      return res.status(201).json({
        type: "category.create.success",
        data: {
          categoryid: categoryToSave.categoryid,
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