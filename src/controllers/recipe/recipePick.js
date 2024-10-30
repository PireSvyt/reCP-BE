require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");

module.exports = recipePick = (req, res, next) => {
/*

picks a recipe to cook

possible response types
- recipe.pick.error
- recipe.pick.error.onmodify
- recipe.pick.success

inputs
- recipeid to pick specifically a given recipe

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
			if (req.body.recipeid === recipe.recipeid) {
					stillValidRecipes.push(recipe)
			} else {
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
			}
		})
		// Upate expired recipes
		if (expiredRecipes.length > 0) {
			console.log("expiredRecipes", expiredRecipes)
			Recipe.updateMany({
				recipeid: expiredRecipes
			},{
				tocook: false,
				cooked: false
			})
			.then((outcome) => {
				console.log("expiredRecipes outcome", outcome)
			})
			.catch((error) => {
				console.log("recipe.pick.error.onupdatemany");
				console.error(error);
			});
		}

		if (stillValidRecipes.length === 0) {
			console.log("recipe.pick.success no more");
			return res.status(200).json({
			type: "recipe.pick.success",
			more: false
			});
		} else {
			let pickedRecipe
			if (req.body.recipeid !== undefined) {
				pickedRecipe = stillValidRecipes.filter(recipe => { return recipe.recipeid === req.body.recipeid})[0]
			} else {
				pickedRecipe = stillValidRecipes[Math.floor(Math.random() * stillValidRecipes.length)];
			}
			pickedRecipe.tocook = true
			pickedRecipe.cooked = false
			pickedRecipe.scale = pickedRecipe.portions
			// Shopping list update
			let updatedShoppings = []
			Shopping.find({
				communityid: req.augmented.user.communityid,
				shoppingid: pickedRecipe.ingredients.map(ingredient => { return ingredient.shoppingid })
			}, function(err, shoppings) {
          async.each(shoppings, function(shopping, callback) {
              shopping.done = false
              shopping.need = (shopping.need === undefined ? 0 : shopping.need ) + 
	              pickedRecipe.ingredients.filter(ingredient => { 
	                return shopping.shoppingid === ingredient.shoppingid
	              })[0].quantity
              updatedShoppings.push(shopping)
              shopping.save(callback);
          });
      }).then(() => {
				console.log("recipe.pick.updatedshoppings", updatedShoppings);
				// Recipe lit update
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
						more: stillValidRecipes.length > 1 ? true : false,
						shoppings: updatedShoppings
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
			})
			.catch((error) => {
				console.log("recipe.pick.error.onupdateshoppings");
				console.error(error);
					return res.status(400).json({
						type: "recipe.pick.error.onupdateshoppings",
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