require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");

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
	
	Recipe.aggregate([
		{ $match: matches },
		{
			$lookup: {
				from: "shoppings",
				foreignField: "shoppingid",
				localField: "ingredients.shoppingid",
				as: "shoppings",
				pipeline: [
					{
                        //"shoppingid name shelfid unit need available done prices"
                        $project: {
                            _id: 0,
                            shoppingid: 1,
                            name: 1,
                            shelfid: 1,
                            unit: 1,
                            need: 1,
                            available: 1,
                            done: 1,
                            prices: 1,
                        },
                    },
                ],
            },
        },
		// recipeid name portions scale ingredients instructions tocook cooked cookedlaston
		{ $project: 
            {
                _id: 0,
                recipeid: 1,
                name: 1,
                portions: 1,
                scale: 1,
                ingredients: 1,
                instructions: 1,
                tocook: 1,
                cooked: 1,
                cookedlaston: 1,
				shoppings: 1
            },
        }
	])
	.then((recipes) => {
		
		let recipesToSave = []
		let shoppingsDict = {}
		let shoppingsToSave = []
		let recipesToSend = []
		let promises = []
	
		// Manage change of picked recipes
		recipes.forEach(recipe => {
			let recipeToSave = {...recipe}
			if (recipe.cooked) {
				recipeToSave.cooked = false
				recipeToSave.tocook = true
				recipeToSave.ingredients.forEach(ingredient => {
					// Add shopping to save list
					if (!Object.keys(shoppingsDict).includes(ingredient.shoppingid)) {
						shoppingsDict[ingredient.shoppingid] = recipeToSave.shoppings.filter(shopping => {
							return shopping.shoppingid === ingredient.shoppingid
						})[0]
					}
					// Account for change
					shoppingsDict[ingredient.shoppingid].need = shoppingsDict[ingredient.shoppingid].need + 
						Math.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100
						shoppingsDict[ingredient.shoppingid].availabe = shoppingsDict[ingredient.shoppingid].availabe + 
						Math.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100
				})			
			} else {
				recipeToSave.cooked = true
				recipeToSave.tocook = true
				recipeToSave.ingredients.forEach(ingredient => {
					// Add shopping to save list
					if (!Object.keys(shoppingsDict).includes(ingredient.shoppingid)) {
						shoppingsDict[ingredient.shoppingid] = recipeToSave.shoppings.filter(shopping => {
							return shopping.shoppingid === ingredient.shoppingid
						})[0]
					}
					// Add to shoppings to save
					shoppingsDict[ingredient.shoppingid].need = Math.max(shoppingsDict[ingredient.shoppingid].need - 
						Math.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100, 0)
					shoppingsDict[ingredient.shoppingid].availabe = Math.max(shoppingsDict[ingredient.shoppingid].availabe - 
						Math.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100, 0)
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
			console.log(obj + " error", error);
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
					console.log("recipes error", error);
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
					console.log("shoppings error", error);
					errorObject("shoppings", error)
				})
			)
		}
		// Fire promises
		if (promises.length === 0) {
			return res.status(200).json({
				type: "recipe.cook.success",
				recipes: [],
				more: false,
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
}