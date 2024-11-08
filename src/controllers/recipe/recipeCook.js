require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");
const convert = require ("../../utils/convert.js")

module.exports = recipeCook = (req, res, next) => {
	/*
	
	cooks a recipe and impacts the ingredient shoppings' need and done
	
	possible response types
	- recipe.cook.error
	- recipe.cook.error.onmodify
	- recipe.cook.success
	
	inputs
	- recipeid to pick specifically a given recipe
	
	*/
	
	if (process.env.DEBUG) {
	console.log("recipe.cook");
	}
	
	let matches = {
		communityid: req.augmented.user.communityid,
		recipeid: req.body.recipeids
	}
		
	let recipesToSave = []
	let recipesToSend = []

	let shoppingsids = []
	let shoppingsDict = {}
	let shoppingsToSave = []

	let promises = []

	Recipe.find(
		matches,
		"recipeid name portions scale ingredients instructions tocook cooked cookedlaston tagids"
	)
	.then((pickedRecipes) => {

		// Aggregate ingredients
		pickedRecipes.forEach(recipe => {
			recipe._doc.ingredients.forEach(ingredient => {
				shoppingsids.push(ingredient.shoppingid)
			})
		})
		//console.log("shoppingsids",shoppingsids)

		// Find ingredients
		Shopping.find(
			{ shoppingid : { $in : shoppingsids }},
			"shoppingid name shelfid unit need available done prices"
		)
		.then(shoppings => {

			// Set shoppings as a dict for convenience
			shoppings.forEach(shopping => {
				shoppingsDict[shopping.shoppingid] = {...shopping._doc}
				if (shoppingsDict[shopping.shoppingid].need === null ||shoppingsDict[shopping.shoppingid].need === undefined) {
					shoppingsDict[shopping.shoppingid].need = 0
				}
			})

			// Manage change of picked recipes
			pickedRecipes.forEach(recipe => {
				let recipeToSave = {...recipe._doc}
				if (recipeToSave.cooked) {
					recipeToSave.cooked = false
					recipeToSave.ingredients.forEach(ingredient => {
						if (Object.keys(shoppingsDict).includes(ingredient.shoppingid)) {
							let delta = Math.floor( 100 * 
								convert(ingredient.quantity, ingredient.unit, shoppingsDict[ingredient.shoppingid].unit) * 
								recipeToSave.scale / recipeToSave.portions) / 100
							shoppingsDict[ingredient.shoppingid].available = 
								Math.max(shoppingsDict[ingredient.shoppingid].available + delta, 0)
							shoppingsDict[ingredient.shoppingid].need = 
								Math.max(shoppingsDict[ingredient.shoppingid].need + delta, 0)
						}
					})			
				} else {
					recipeToSave.cooked = true
					recipeToSave.cookedlaston = new Date()
					recipeToSave.ingredients.forEach(ingredient => {
						if (Object.keys(shoppingsDict).includes(ingredient.shoppingid)) {
							let delta = Math.floor( 100 * 
								convert(ingredient.quantity, ingredient.unit, shoppingsDict[ingredient.shoppingid].unit) * 
								recipeToSave.scale / recipeToSave.portions) / 100
							shoppingsDict[ingredient.shoppingid].available = 
								Math.max(shoppingsDict[ingredient.shoppingid].available - delta, 0)
							shoppingsDict[ingredient.shoppingid].need = 
								Math.max(shoppingsDict[ingredient.shoppingid].need - delta, 0)
						}
					})
				}
				recipesToSave.push(recipeToSave)
			})

			// Capture the shoppings to save
			shoppingsToSave = Object.values (shoppingsDict)

			// Add to recipes to save
			recipesToSend = recipesToSave.map(recipe => {
				return {
					recipeid: recipe.recipeid,
					name: recipe.name,
					portions: recipe.portions,
					scale: recipe.scale,
					ingredients: recipe.ingredients,
					instructions: recipe.instructions,
					tocook: recipe.tocook,
					cooked: recipe.cooked,
					cookedlaston: recipe.cookedlaston,
					tagids: recipe.tagids
				}
			})
			
			// Updates
			let outcome = {
				recipes: { state: "pending", count: null},
				shoppings: { state: "pending", count: null},
			}
			function updateObject (obj, count) {
				outcome[obj].state = "done"
				outcome[obj].count = count
			}
			function errorObject (obj, error) {
				//console.log(obj + " error", error);
				outcome[obj].state = "error"
				outcome[obj].count = 0
				outcome[obj].error = error
			}
			if (recipesToSend.length > 0) {
				// Update recipes		  
				let bulkRecipes = []	  
				recipesToSend.forEach(recipe => {
					bulkRecipes.push({
						updateOne: {
						filter: { recipeid: recipe.recipeid },
						update: recipe
						}
					})
				})
				promises.push(
					Recipe.bulkWrite(bulkRecipes)
					.then((recipeOutcome) => {
						updateObject("recipes", recipeOutcome.modifiedCount)
					})
					.catch((error) => {
						//console.log("recipes error", error);
						errorObject("recipes", error)
					})
				)
			}
			if (shoppingsToSave.length > 0) {
				// Update shoppings
				let bulkShoppings = []	  
				shoppingsToSave.forEach(shopping => {
					bulkShoppings.push({
						updateOne: {
						filter: { shoppingid: shopping.shoppingid },
						update: shopping
						}
					})
				})
				promises.push(
					Shopping.bulkWrite(bulkShoppings)
					.then((shoppingOutcome) => {
						updateObject("shoppings", shoppingOutcome.modifiedCount)
					})
					.catch((error) => {
						//console.log("shoppings error", error);
						errorObject("shoppings", error)
					})
				)
			}
			// Fire promises
			if (promises.length === 0) {
				return res.status(200).json({
					type: "recipe.cook.success",
					recipes: [],
					shoppings: [],
				});	
			} else {
				Promise.all(promises)
				.then(() => {
					console.log("recipe.cook.success");
					return res.status(200).json({
						type: "recipe.cook.success",
						recipes: recipesToSend,
						shoppings: shoppingsToSave,
						outcome: outcome
					});	
				})	 
				.catch((error) => {
					console.log("recipe.cook.error.onupdate");
					console.error(error);
					return res.status(400).json({
						type: "recipe.cook.erroronupdate",
						error: error,
					});
				}); 
			}	
		})
		.catch((error) => {
			console.log("recipe.cook.error");
			console.error(error);
			return res.status(400).json({
				type: "recipe.cook.error",
				error: error,
			});
		});		
	})
	.catch((error) => {
		console.log("recipe.cook.error");
		console.error(error);
		return res.status(400).json({
			type: "recipe.cook.error",
			error: error,
		});
	});
}



		
	