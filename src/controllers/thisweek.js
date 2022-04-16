const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.findRecipes = (req, res, next) => {
  Recipe.find({ state: { selected: true } })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateRecipes = (req, res, next) => {
  const request = new Recipe({ ...req.body });
  switch (request.type) {
    case "renewSelection":
      renewSelection();
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
  /*recipe
    .save()
    .then(() => {
      res.status(201).json({
        message: "recette enregistré",
        id: recipe._id
      });
    })
    .catch((error) => res.status(400).json({ error }));*/
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
}
