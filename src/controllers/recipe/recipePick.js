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
		"recipeid name portions scale ingredients instructions tocook cooked cookedlaston"
	).then(recipes => {
		// Remove recipes which are expired
		let expiredRecipes = []
		let stillValidRecipes = []
		let nowDate = new Date();
		recipes.forEach(recipe => {
			if (recipe.cooked === true) {
				if (recipe.cookedlaston !== undefined) {
					let cookedDate = new Date(recipe.cookedlaston);
					if (cookedDate  < nowDate - 3 * (1000 * 3600 * 24)) {
						expiredRecipes.push(recipe.recipeid)		
					} else {
						stillValidRecipes.push(recipe)						
					}
				} else {
					expiredRecipes.push(recipe.recipeid)
				}
			} else {
				stillValidRecipes.push(recipe)
			}
		})
		// Upate expired recipes
		console.log("expiredRecipes", expiredRecipes)
		Recipe.updateMany({
			recipeid: expiredRecipes
		},{
			tocook: false,
			cooked: false
		})

		if (stillValidRecipes.length === 0) {
			console.log("recipe.pick.success no more");
			return res.status(200).json({
			type: "recipe.pick.success",
			more: false
			});
		} else {
			let pickedRecipe = stillValidRecipes[Math.floor(Math.random() * stillValidRecipes.length)];
			pickedRecipe.tocook = true
			pickedRecipe.cooked = false
			pickedRecipe.scale = pickedRecipe.portions
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
					more: stillValidRecipes.length > 1 ? true : false
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