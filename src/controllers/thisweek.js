const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.findRecipes = (req, res, next) => {
  Recipe.find({ state: { selected: true } })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateRecipes = (req, res, next) => {
  const request = new Recipe({ ...req.body });
  let result = { status: 404, message: "Not matching any possibleaction" };
  console.log(request);
  switch (request.type) {
    case "renewSelection":
      result = renewSelection();
      break;
    case "addRecipe":
      break;
    case "removeRecipe":
      break;
    case "removeAllRecipes":
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
  console.log("TODO renewSelection.reset");
  // Random selection
  console.log("TODO renewSelection.selection");
  // Shared setting
  console.log("TODO renewSelection.setting");
  // Answer
  console.log("TODO renewSelection.answer");
  // Return
  return { status: 200, message: "renewSelection effectuée" };
}
