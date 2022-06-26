const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.emptyShopping = (req, res, next) => {
  console.log("shopping.emptyShopping");

  Ingredient.update({}, { shopped: 0 })
    .then(() => {
      // Answer
      console.log("shopping empty");
      res.status(200).json({
        status: 200,
        message: "shopping empty"
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
exports.takeIngredient = (req, res, next) => {
  console.log("fridge.takeIngredient");
  // Initialize
  var status = 500;
  const newIngredient = new Ingredient({ ...req.body });
  // Modify
  Ingredient.findByIdAndUpdate(newIngredient._id, { ...req.body })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "ingredient modified",
        id: newIngredient._id
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on modify",
        error: error,
        ingredient: newIngredient
      });
      console.error(error);
    });
};
exports.addToFridge = (req, res, next) => {
  console.log("shopping.addToFridge");
  // Initialize
  var status = 500;

  Ingredient.find({ shopped: { $gt: 0 } })
    .then((ingredients) => {
      ingredients.forEach((ingredient) => {
        ingredient.available =
          (ingredient.available || 0) + (ingredient.shopped || 0);
        ingredient.shopped = 0;
        Ingredient.findByIdAndUpdate(ingredient._id, ingredient).catch(
          (error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on modify",
              error: error,
              ingredient: ingredient
            });
            console.error(error);
          }
        );
      });

      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "list ok"
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        ingredients: [],
        error: error
      });
      console.error(error);
    });
};
