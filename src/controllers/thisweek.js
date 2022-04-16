const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.findRecipes = (req, res, next) => {
  Recipe.find({ state: { selected: true } })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};
/*
exports.renewRecipes = (req, res, next) => {
  //
};

exports.addRecipe = (req, res, next) => {
  //
};

exports.removeRecipe = (req, res, next) => {
  //
};

exports.removeAllRecipes = (req, res, next) => {
  //
};
*/
