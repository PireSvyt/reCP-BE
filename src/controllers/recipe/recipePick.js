require("dotenv").config();
const Recipe = require("../../models/Recipe.js");

module.exports = recipePick = (req, res, next) => {
/*

picks a recipe to cook

possible response types
- recipe.pick.error
- recipe.pick.error.onmodify
- recipe.pick.success

*/

if (process.env.DEBUG) {
console.log("recipe.pick");
}

Recipe
	.find(
		{
			communityid: req.augmented.user.communityid,
			tocook: false
		},
		"recipeid name portions scale ingredients instructions tocook cooked"
	).then(recipes => {
		if (recipes.length === 0) {
	    console.log("recipe.pick.success no more");
	    return res.status(200).json({
	      type: "recipe.pick.success",
	      more: false
	    });
		} else {
			let pickedRecipe = recipes[Math.floor(Math.random() * recipes.length)];
			pickedRecipe.tocook = true
			Recipe.updateOne(
				{
				recipeid: pickedRecipe.recipeid,
				communityid: req.augmented.user.communityid
				},
				pickedRecipe
			).then(() => {
				console.log("recipe.pick.success");
				return res.status(200).json({
					type: "recipe.pick.success",
					recipe: pickedRecipe,
					more: recipes.length > 1 ? true : false
				});	
			})
			.catch((error) => {
				console.log("recipe.pick.error.onmodify");
				console.error(error);
				return res.status(400).json({
				type: "recipe.pick.error.onmodify",
				error: error,
				});
			});
		}
	})
	.catch((error) => {
	  console.log("recipe.pick.error");
	  console.error(error);
	  return res.status(400).json({
	    type: "recipe.pick.error",
	    error: error,
	  });
	});
}