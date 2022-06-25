const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.emptyFridge = (req, res, next) => {
  console.log("thisweek.emptyFridge");

  Ingredient.update({}, { selected: false })
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
  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => {
      if (ingredient.available > 0) {
        ingredient.available = 0;
      } else {
        ingredient.available = ingredient.quantity;
      }
      // Modify
      Ingredient.findByIdAndUpdate(ingredient._id, ingredient)
        .then(() => {
          status = 200;
          res.status(status).json({
            status: status,
            message: "ingredient modified",
            id: ingredient._id
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on modify",
            error: error,
            ingredient: ingredient
          });
          console.error(error);
        });
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "ingredient ok",
        ingredient: ingredient
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        ingredient: {},
        error: error
      });
      console.error(error);
    });
};
