const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.emptyFridge = (req, res, next) => {
  console.log("thisweek.emptyFridge");

  Ingredient.update({}, { available: 0 })
    .then(() => {
      // Answer
      console.log("fridge empty");
      res.status(200).json({
        status: 200,
        message: "fridge empty"
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
exports.haveIngredient = (req, res, next) => {
  console.log("fridge.haveIngredient");
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
