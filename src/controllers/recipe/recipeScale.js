require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");

module.exports = recipeScale = (req, res, next) => {
	/*
	
	scales a recipe and impacts the ingredient shoppings' need and done
	
	possible response types
	- recipe.scale.error
	- recipe.scale.error.onmodify
	- recipe.scale.success
	
	inputs
	- recipeid to pick specifically a given recipe
	
	*/
	
	if (process.env.DEBUG) {
	console.log("recipe.scale");
	}
	
	let matches = {
		communityid: req.augmented.user.communityid,
		recipeid: req.body.recipes.map(recipe => {
			return recipe.recipeid
		})
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
        {   
            $project: {
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
		let shoppingsToSave = {}
	
		// Manage change of picked recipes
		recipes.forEach(recipe => {
			let recipeToSave = {...recipe}
			let recipeChanges = req.body.recipes.filter(r => { return r.recipeid === recipe.recipeid })[0]
			if (recipe.scale !== recipeChanges.scale) {
				recipeToSave.scale = recipeChanges.scale
				recipeToSave.ingredients.forEach(ingredient => {
					// Add shopping to save list
					if (!Object.keys(shoppingsToSave).includes(ingredient.shoppingid)) {
						shoppingsToSave[ingredient.shoppingid] = recipeToSave.shoppings.filter(shopping => {
							return shopping.shoppingid === ingredient.shoppingid
						})[0]
					}
					// Add to shoppings to save
					shoppingsToSave[ingredient.shoppingid].need = Math.max(shoppingsToSave[ingredient.shoppingid].need + 
						Math.floor( 100 * ingredient.quantity * (recipeChanges.scale - recipe.scale) / recipe.portions) / 100, 0)
					if (shoppingsToSave[ingredient.shoppingid].need > shoppingsToSave[ingredient.shoppingid].available) {
						shoppingsToSave[ingredient.shoppingid].done = false
					}
				})
				recipesToSave.push(recipeToSave)
			}
		})
		// Add to recipes to save
		let recipesToSend = recipesToSave.map(recipe => {
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
	  let promises = []
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
				type: "recipe.scale.success",
				recipes: [],
				more: false,
				shoppings: [],
			});	
	  } else {
		  Promise.all(promises)
		  .then(() => {
				console.log("recipe.scale.success");
				return res.status(200).json({
					type: "recipe.scale.success",
					recipes: recipesToSend,
					shoppings: shoppingsToSave,
					outcome: outcome
				});	
			})	 
			.catch((error) => {
			  console.log("recipe.scale.error.onupdate");
			  console.error(error);
			  return res.status(400).json({
			    type: "recipe.scale.erroronupdate",
			    error: error,
			  });
			}); 
	  }				
	})
	.catch((error) => {
	  console.log("recipe.scale.error");
	  console.error(error);
	  return res.status(400).json({
	    type: "recipe.scale.error",
	    error: error,
	  });
	});
}