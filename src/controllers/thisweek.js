const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

// https://restfulapi.net/http-status-codes/

exports.findRecipes = (req, res, next) => {
  Recipe.find({ state: { selected: true } })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateRecipes = (req, res, next) => {
  const request = { ...req.body };
  let result = { status: 433, message: "Not matching any possibleaction" };
  switch (request.type) {
    case "renewSelection":
      result = renewSelection();
      break;
    case "addRecipe":
      result = addRecipe();
      break;
    case "removeRecipe":
      result = removeRecipe(request.id);
      break;
    default:
      console.log("ERROR IN updateRecipes REQUEST");
  }
  // Return result
  res.status(result.status).json({
    message: result.message
  });
};

function renewSelection() {
  // Reset all to false
  Recipe.find({ state: { selected: true } })
    .then((recipies) => {
      recipies.forEach((recipe) => {
        recipe.state.selected = false;
      });
      // Random selection
      let target = 5;
      for (var i = 0; i < target; i++) {
        var outcomes = addRecipe();
        if (outcomes.status !== 200) {
          break;
        }
      }
      // Answer
      Recipe.find({ state: { selected: true } })
        .then((recipies) => {
          return {
            status: 200,
            body: recipies
          };
        })
        .catch((error) => {
          return { status: 400, error };
        });
    })
    .catch((error) => {
      return { status: 400, error };
    });
}
function addRecipe() {
  // Get list of recipies
  Recipe.find({ state: { selected: false } })
    .then((recipies) => {
      console.log("SELECT RECIPE");
      // Select among remaining keys
      if (recipies.length > 0) {
        recipies[(recipies.length * Math.random()) << 0].state.selected = true;
        return { status: 200, message: "addRecipe effectuée" };
      } else {
        return {
          status: 304,
          message: "addRecipe no more unselected recipies"
        };
      }
    })
    .catch((error) => {
      return { status: 400, error };
    });
}
function removeRecipe(id) {
  Recipe.findOne({ _id: id })
    .then((recipe) => {
      recipe.state.selected = false;
      return { status: 200, message: "removeRecipe effectuée" };
    })
    .catch((error) => {
      return { status: 400, error };
    });
}
