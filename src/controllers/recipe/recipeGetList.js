require("dotenv").config();
const Recipe = require("../../models/Recipe.js");

module.exports = recipeGetList = (req, res, next) => {
	/*

	sends back the list of recipes

	possible response types

	- recipe.getlist.success
	- recipe.getlist.error.onfind

	inputs

	- need : list / thisweek
	- recipes
	- - number (for list need only)
	- - lastid (optional)
	- filters (optional)
	- - text
	- - ingredients
	- - tags
	- - tocook
	- - cooked

	*/

	if (process.env.DEBUG) {
	console.log("recipe.getlist");
	}

	// Initialize
	var status = 500;
	var type = "recipe.getlist.error";
	var fields = "";
	var matches = { communityid: req.augmented.user.communityid }

	// Is need input relevant?
	if (!req.body.need) {
		status = 403;
		type = "recipe.getlist.error.noneed";
	} else {
	switch (req.body.need) {
		case "list":
			fields = "recipeid name portions scale ingredients instructions tocook cooked cookedlaston tagids";
			break;
		case "selection":
			fields = "recipeid name portions scale ingredients instructions tocook cooked cookedlaston tagids";
			break;
		default:
			type = "recipe.getlist.error.needmissmatch";
		}
	}

	// Setting up filters
	if (req.body.filters !== undefined) {
		if (req.body.filters.text !== undefined) {
			matches.name = new RegExp(req.body.filters.text, "i");
		}
		if (req.body.filters.ingredients !== undefined) {
			matches['ingredients.shoppingid'] = { "$in": [...req.body.filters.ingredients] }
		}
		if (req.body.filters.tags !== undefined) {
			matches["tagids.tagid"] = { "$in": [...req.body.filters.tags] }
		}
		if (req.body.filters.tocook !== undefined) {
			matches.tocook = req.body.filters.tocook
		}
		if (req.body.filters.cooked !== undefined) {
			matches.cooked = req.body.filters.cooked
		}
	}

	// Is need well captured?
	if (status === 403) {
		res.status(status).json({
			type: type,
		});
	} else {
		Recipe.find(
			matches,
			fields,
		)
		.then((recipes) => {
			// Repackaging
			let recipesToSend = [...recipes];
			let action;
			let more;

			// Map recipe from _doc and sort
			recipesToSend = recipesToSend.map(recipe => {
				return recipe._doc
			}).sort((a, b) => {
				return a.name.localeCompare(b.name)
			});

			// Remove recipes which are expired
			let expiredRecipes = []
			let stillValidRecipes = []
			let selectableRecipes = []
			if ( req.body.need === "selection") {
				let nowDate = new Date();
				recipesToSend.forEach(recipe => {
					console.log("recipesToSend item", recipe)
					if (recipe.cooked === true) {
						if (recipe.cookedlaston !== undefined) {
							let cookedDate = new Date(recipe.cookedlaston);
							if (cookedDate  < nowDate - 3 * (1000 * 3600 * 24)) {
								expiredRecipes.push(recipe.recipeid)		
							} else {
								stillValidRecipes.push(recipe.recipeid)						
							}
						} else {
							expiredRecipes.push(recipe.recipeid)
						}
					} else {
						if (recipe.tocook === true) {
							stillValidRecipes.push(recipe.recipeid)
						} else {
							selectableRecipes.push(recipe.recipeid)
						}
					}
				})

				// Recipes which are not expired
				console.log("stillValidRecipes", stillValidRecipes)
				recipesToSend = recipesToSend.filter(recipe => {
					return stillValidRecipes.includes(recipe.recipeid)
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
						console.log("recipe.getlist.error.onupdatemany");
						console.error(error);
					});
				}

				// Recipes to cook

			} else {

				// Are recipes already loaded
				let lastidpos = 0;
				if (req.body.recipes.lastid !== undefined) {
					// Find last recipe loaded
					lastidpos = recipesToSend.findIndex((recipe) => {
						return recipe.recipeid === req.body.recipes.lastid;
					});
					if (lastidpos === -1) {
						// Last id not found :/
						action = "error";
						lastidpos = 0;
					} else {
						action = "append";
						lastidpos = lastidpos + 1;
					}
				} else {
					action = "new";
				}
	
				// Shorten payload
				recipesToSend = recipesToSend.slice(
					lastidpos, // from N, ex. 0
					lastidpos + req.body.recipes.number + 1 // to N+M, ex. 0+10
				);

			}
			console.log("recipesToSend", recipesToSend)

			// Check if more
			if ( req.body.need === "selection") {
				more = selectableRecipes.filter(recipeid => {					
					return !recipesToSend.map(recipe => { 
						return recipe.recipeid 
					}).includes(recipeid)
				}).length > 0
			} else {
				// transrecipes [ N ... N+M ] length = M+1, ex. 0-10 -> 11 transrecipes
				more = recipesToSend.length > req.body.recipes.number;
				// Shorten to desired length
				if (more === true) {
					recipesToSend.pop();
				}
			}

			// Response
			return res.status(200).json({
				type: "recipe.getlist.success",
				data: {
					recipes: recipesToSend,
					more: more,
					action: action,
				},
			});
		})
		.catch((error) => {
			console.log("recipe.getlist.error.onfind");
			console.error(error);
			return res.status(400).json({
				type: "recipe.getlist.error.onfind",
				error: error,
			});
		});
	}
};