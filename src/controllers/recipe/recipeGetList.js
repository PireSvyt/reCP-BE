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
- - done
- - for
- - date
- - name

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
		fields = "recipeid date name by for amount categoryid tagids";
		break;
	default:
		type = "recipe.getlist.error.needmissmatch";
	}
}

/*
// Setting up filters
if (req.body.filters !== undefined) {
	if (req.body.filters.for !== undefined) {
		filters.for = req.body.filters.for
	}
	if (req.body.filters.done !== undefined) {
		filters.done = req.body.filters.done;
	}
	if (req.body.filters.datemax !== undefined) {
		filters.date = req.body.filters.datemax;
	}
	if (req.body.filters.text !== undefined) {
		filters.name = new RegExp(req.body.filters.text, "i");
	}
}
	*/

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

	// Filtering
	let recipe;
	let more;
	if (req.body.need === "list") {
	  // Sort
	  /*
	  recipesToSend = recipesToSend.sort((a, b) => {
	    if (a.duedate === b.duedate) {
	      return 0;
	    } else if (a.duedate > b.duedate) {
	      return -1;
	    } else {
	      return 1;
	    }
	  });
	  */

	  // Filter
	  /*
	  recipesToSend = recipesToSend.filter((recipe) => {
	    let pass = true;
	    if (filters.for !== undefined) {
	      let passFor = false;
	      filters.for.forEach((f) => {
	        if (recipe.for.map(fm => {return fm.userid}).includes(f)) {
	          passFor = true;
	        }
	      });
	      if (recipe.for.length === 0) {
	        passFor = true;
	      }
	      if (!passFor) {
	        pass = false;
	      }
	    }
	    if (filters.done !== undefined) {
	      if (recipe.done !== filters.done) {
	        pass = false;
	      }
	    }
	    if (filters.date !== undefined) {
	      if (Date.parse(recipe.duedate) > Date.parse(filters.date)) {
	        pass = false;
	      }
	    }
	    if (filters.name !== undefined) {
	      if (!filters.name.test(recipe.name)) {
	        pass = false;
	      }
	    }
	    return pass;
	  });
	  */

	  // Are recipes already loaded
	  let lastidpos = 0;
	  if (req.body.recipes.lastid !== undefined) {
	    // Find last recipe loaded
	    lastidpos = recipesToSend.findIndex((recipe) => {
	      return recipe.recipeid === req.body.recipes.lastid;
	    });
	    if (lastidpos === -1) {
	      // Last id not found :/
	      recipe = "error";
	      lastidpos = 0;
	    } else {
	      recipe = "append";
	      lastidpos = lastidpos + 1;
	    }
	  } else {
	    recipe = "new";
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
	}

	// Response
	return res.status(200).json({
	  type: "recipe.getlist.success",
	  data: {
	    recipes: recipesToSend,
	    more: more,
	    recipe: recipe,
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
				recipe: null,
			},
		});
	});
}
};