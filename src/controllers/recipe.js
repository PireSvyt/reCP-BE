const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const ingredientCtrl = require("../controllers/ingredient");

exports.createRecipe = (req, res, next) => {
  delete req.body._id;
  const recipe = new Recipe({ ...req.body });
  // Save ingredients
  if (saveIngredients(recipe)) {
    // Save recipe
    recipe
      .save()
      .then(() => {
        res.status(201).json({
          message: "recette enregistré",
          id: recipe._id
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.modifyRecipe = (req, res, next) => {
  Recipe.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "recette modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteRecipe = (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      if (!recipe) {
        return res.status(400).json({ message: "recette introuvable" });
      }
      Recipe.deleteOne({ _id: req.params.id })
        .then((recipe) => res.status(200).json({ message: "recette supprimé" }))
        .catch((error) =>
          res.status(400).json({ message: "recette introuvable" })
        );
    })
    .catch((error) => res.status(404).json({ message: "recette introuvable" }));
};

exports.findOneRecipe = (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(404).json({ message: "recette introuvable" }));
};

exports.findRecipes = (req, res, next) => {
  Recipe.find()
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};

function saveIngredients(recipe) {
  let outcome = true;

  return outcome;
}

// LEVERAGED
exports.getRecipeItem = (req, res, next) => {
  // Initialize
  var status = 500;

  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      // Get ingredient names
      let ingList = [];
      recipe.ingredients.forEach((ingredient) => {
        ingList.push(ingredient._id);
      });
      Ingredient.find({ _id: { $in: ingList } }, "")
        .then((ingredients) => {
          // Swap ingredient id to names in recipe
          for (var i = 0; i < ingredients.length; i++) {
            for (var j = 0; j < recipe.ingredients.length; j++) {
              if (ingredients[i]._id === recipe.ingredients[j]._id) {
                recipe.ingredients[j].name = ingredients[i].name;
                recipe.ingredients[j].unit = ingredients[i].unit;
              }
            }
          }
          // Check
          recipe.ingredients.forEach((ingredient) => {
            if (!ingredient.name || !ingredient.unit) {
              status = 206; // Partial Content
            }
          });
          // Clean
          recipe.ingredients.forEach((ingredient) => {
            delete ingredient._id;
          });
          // Send
          if (status === 206) {
            res.status(status).json({
              status: status,
              message: "partial ingredient list",
              recipe: recipe
            });
          } else {
            status = 200; // OK
            res.status(status).json({
              status: status,
              message: "recipe ok",
              recipe: recipe
            });
          }
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on find ingredients",
            recipe: {},
            error: error
          });
          console.error(error);
        });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        recipe: {},
        error: error
      });
      console.error(error);
    });
};
exports.getRecipeList = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "myrecipies":
        fields = "name selected";
        break;
      case "thisweek":
        where = "this.selected";
        fields = "name portions scale cooked";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json([]);
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    Recipe.find(filters, fields)
      .where(where)
      .exec()
      .then((recipies) => {
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          recipies: recipies
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          recipies: [],
          error: error
        });
        console.error(error);
      });
  }
};
exports.saveRecipe = (req, res, next) => {
  // Initialize
  var status = 500;

  const recipe = new Recipe({ ...req.body });

  Ingredient.find()
    .then((ingredients) => {
      // Swap back ingredient names to id
      recipe.ingredients.forEach((ingredient) => {
        ingredient.saved = false;
        for (var i = 0; i < ingredients.ingredients.length; i++) {
          if (ingredients.ingredients[i].name === ingredient.name) {
            ingredient._id = ingredients.ingredients[i]._id;
            ingredient.saved = true;
          }
        }
      });
      // Check for saving ingredients
      recipe.ingredients.forEach((ingredient) => {
        if (!ingredient.saved) {
          // Save ingredient
          ingredientCtrl
            .saveIngredient(ingredient)
            .then((saveIngredientOutcome) => {
              if (saveIngredientOutcome.status === 201) {
                ingredient._id = saveIngredientOutcome._id;
                ingredient.saved = true;
              } else {
                status = 406; // Not acceptable
                res.status(status).json({
                  status: status,
                  message: "error on ingredient saving"
                });
              }
            })
            .catch((error) => {
              status = 400; // OK
              res.status(status).json({
                status: status,
                message: "error on ingredient saving",
                error: error
              });
              console.error(error);
            });
        }
      });
      // Clean
      recipe.ingredients.forEach((ingredient) => {
        delete ingredient.name;
        delete ingredient.unit;
        delete ingredient.saved;
      });
      // Save
      if (req.body._id === "" || req.body._id === undefined) {
        // Create
        delete recipe._id;
        recipe
          .save()
          .then(() => {
            status = 201;
            res.status(status).json({
              status: status,
              message: "recipe created",
              id: recipe._id
            });
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on create",
              error: error
            });
            console.error(error);
          });
      } else {
        // Modify
        Recipe.findByIdAndUpdate(req.body._id, recipe)
          .then(() => {
            status = 200;
            res.status(status).json({
              status: status,
              message: "recipe modified",
              id: req.params.id
            });
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on modify",
              error: error
            });
            console.error(error);
          });
      }
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on ingredient checks",
        error: error
      });
      console.error(error);
    });
};
exports.selectRecipe = (req, res, next) => {
  // Initialize
  var status = 500;

  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      console.log("recipe before");
      console.log(recipe);
      if (recipe.selected) {
        recipe.selected = !recipe.selected;
      } else {
        recipe.selected = true;
      }
      console.log("recipe after");
      console.log(recipe);
      Recipe.findByIdAndUpdate(req.params.id, recipe)
        .then(() => {
          status = 200;
          res.status(status).json({
            status: status,
            message: "recipe modified to " + recipe.selected
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on modify",
            error: error
          });
          console.error(error);
        });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error
      });
      console.error(error);
    });
};
exports.prepareRecipe = (req, res, next) => {
  // Initialize
  var status = 500;

  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      if (recipe.cooked) {
        recipe.cooked = !recipe.cooked;
      } else {
        recipe.cooked = true;
      }
      Recipe.findByIdAndUpdate(req.params.id, recipe)
        .then(() => {
          status = 200;
          res.status(status).json({
            status: status,
            message: "recipe modified to " + recipe.cooked
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on modify",
            error: error
          });
          console.error(error);
        });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error
      });
      console.error(error);
    });
};
