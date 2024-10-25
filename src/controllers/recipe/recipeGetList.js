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
- - selected
- - cooked

*/

if (process.env.DEBUG) {
console.log("recipe.getlist");
}

// Initialize
var status = 500;
var type = "recipe.getlist.error";
var fields = "";
var filters = {};
var matches = { communityid: req.augmented.user.communityid }

// Is need input relevant?
if (!req.body.need) {
	status = 403;
	type = "recipe.getlist.error.noneed";
} else {
switch (req.body.need) {
	case "list":
		fields = "recipeid name portions scale ingredients instructions selected cooked";
		break;
	case "selection":
		fields = "recipeid name portions scale ingredients instructions selected cooked";
		matches.selected = true
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
		matches.ingredients = { shoppingid: req.body.filters.ingredients }
	}
	if (req.body.filters.selected !== undefined) {
		matches.selected = req.body.filters.selected
	}
	if (req.body.filters.cooked !== undefined) {
		matches.cooked = req.body.filters.cooked
	}
}

// Is need well captured?
if (status === 403) {
	res.status(status).json({
		type: type,
		data: {
			recipes: [],
			more: null,
			recipe: null,
		},
	});
} else {
	Recipe.aggregate([
		{
			$match: matches
		},
		{
			$project: {
				_id: 0,
				recipeid: 1,
				name: 1,
				portions: 1,
				scale: 1,
				ingredients: 1,
				instructions: 1,
				selected: 1,
				cooked: 1,
			},
		},
])
.then((recipes) => {
	// Repackaging
	let recipesToSend = [...recipes];
	let action;
	let more;
  
  // Sort	  
  recipesToSend = recipesToSend.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });	  

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

  // Check if more
  // transrecipes [ N ... N+M ] length = M+1, ex. 0-10 -> 11 transrecipes
  more = recipesToSend.length > req.body.recipes.number;
  // Shorten to desired length
  if (more === true) {
    recipes.pop();
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
			data: {
				recipes: undefined,
				more: null,
				action: null,
			},
		});
	});
}
};