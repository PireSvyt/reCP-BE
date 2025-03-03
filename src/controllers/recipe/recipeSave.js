require("dotenv").config();
const Recipe = require("../../models/Recipe.js");

module.exports = recipeSave = (req, res, next) => {
  /*

saves a recipe

possible response types
- recipe.save.error.recipeid
- recipe.save.success.modified
- recipe.save.error.onmodify

*/

  if (process.env.DEBUG) {
    console.log("recipe.save");
  }

  // Save
  if (req.body.recipeid === "" || req.body.recipeid === undefined) {
    console.log("recipe.save.error.recipeid");
    return res.status(503).json({
      type: "recipe.save.error.recipeid",
      error: error,
    });
  } else {
    // Modify
    let recipeToSave = { ...req.body };
    delete recipeToSave.communityid;

    // Save
    Recipe.updateOne(
      {
        recipeid: recipeToSave.recipeid,
        communityid: req.augmented.user.communityid,
      },
      recipeToSave
    )
      .then(() => {
        console.log("recipe.save.success.modified");
        return res.status(200).json({
          type: "recipe.save.success.modified",
          recipe: recipeToSave,
        });
      })
      .catch((error) => {
        console.log("recipe.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "recipe.save.error.onmodify",
          error: error,
        });
      });
  }
};
