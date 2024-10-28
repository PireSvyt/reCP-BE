require("dotenv").config();
const Recipe = require("../../models/Recipe.js");

module.exports = recipeCreate = (req, res, next) => {
/*

create a recipe

possible response types
- recipe.create.success
- recipe.create.error

*/

if (process.env.DEBUG) {
console.log("recipe.create");
}

let recipeToSave = { ...req.body }
recipeToSave.communityid = req.augmented.user.communityid
recipeToSave = new Recipe(recipeToSave);

// Save
recipeToSave
.save()
.then(() => {
console.log("recipe.create.success");
return res.status(201).json({
type: "recipe.create.success",
data: {
recipe: recipeToSave,
},
});
})
.catch((error) => {
console.log("recipe.create.error");
console.error(error);
return res.status(400).json({
type: "recipe.create.error",
error: error,
data: {
recipe: undefined,
},
});
});
};