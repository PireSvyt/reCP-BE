const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

// https://restfulapi.net/http-status-codes/

exports.renewSelection = (req, res, next) => {
  console.log("thisweek.renewSelection");

  Recipe.find()
    .then((recipies) => {
      // Reset all to false
      let filteredRecipies = recipies.filter(function (value, index, arr) {
        return value.selected === true;
      });
      filteredRecipies.forEach((recipe) => {
        recipe.selected = false;
      });
      console.log("selection emptied");
      // Random selection
      let target = 5;
      var intres = { status: 0, message: "", error: undefined };
      let selectedRecipies = [];
      for (var i = 0; i < target; i++) {
        // Select among remaining keys
        if (filteredRecipies.length > 0) {
          console.log("some unselected available");
          // Select among possibilities
          let recipe =
            filteredRecipies[(filteredRecipies.length * Math.random()) << 0];
          recipe.selected = true;
          recipe.scale = recipe.portions;
          Recipe.updateOne({ _id: recipe._id }, recipe)
            .then(() => {
              selectedRecipies.push(recipe);
              console.log("recipe selection updated");
              console.log("selectedRecipies");
              console.log(selectedRecipies);
              intres.status = 200;
              intres.message = "recipe selection updated";
            })
            .catch((error) => {
              res.status(400).json({
                error
              });
            });
        } else {
          console.log("no unselected available");
          intres.status = 304;
          intres.message = "addRecipe no more unselected recipies";
        }
        if (intres.status !== 200) {
          console.log("selection renew loop break since " + intres.status);
          break;
        } else {
          console.log("selection renew looping");
          intres.message = "selection renewed";
        }
      }
      // Answer
      console.log("selection renewed status " + intres.status);
      res.status(intres.status).json({
        status: intres.status,
        message: intres.message,
        recipies: selectedRecipies
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
exports.addRecipe = (req, res, next) => {
  console.log("thisweek.addRecipe");

  Recipe.find({
    selected: false
  })
    .then((recipies) => {
      // Select among remaining keys
      if (recipies.length > 0) {
        console.log("some unselected available");
        // Select
        let recipe = recipies[(recipies.length * Math.random()) << 0];
        recipe.selected = true;
        recipe.scale = recipe.portions;
        Recipe.updateOne({ _id: recipe._id }, recipe)
          .then(() => {
            console.log("recipe selection update");
            res.status(200).json({
              status: 200,
              message: "addRecipe effectuée " + recipe._id,
              recipe: recipe
            });
          })
          .catch((error) => {
            res.status(400).json({
              status: 400,
              error
            });
          });
      } else {
        console.log("no unselected available");
        res.status(208).json({
          status: 208,
          message: "addRecipe no more unselected recipies"
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
exports.removeRecipe = (req, res, next) => {
  console.log("thisweek.removeRecipe");
  removeRecipe(req.params.id)
    .then((status, details) => {
      res.status(status).json({ details });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
async function removeRecipe(id) {
  //console.log("ASYNC removeRecipe " + id);
  Recipe.findOne({ _id: id })
    .then((recipe) => {
      recipe.selected = false;
      return { status: 200, message: "removeRecipe effectuée" };
    })
    .catch((error) => {
      return { status: 400, error };
    });
}
exports.emptySelection = (req, res, next) => {
  console.log("thisweek.emptySelection");

  Recipe.update(
    {
      selected: true
    },
    { selected: false }
  )
    .then(() => {
      // Answer
      console.log("selection empty");
      res.status(200).json({
        status: 200,
        message: "selection empty"
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
exports.updateIngredientNeeds = (req, res, next) => {
  console.log("thisweek.updateIngredientNeeds");

  // useful
  function compare(a, b) {
    if (a.name.localeCompare(b.name, "en", { sensitivity: "base" }) === 1) {
      return 1;
    } else {
      return -1;
    }
  }

  let selectedIngredients = {};

  // Totalize needs and availabilities
  console.log("Totalize needs and availabilities");
  Recipe.find({ selected: true })
    .then((recipies) => {
      //console.log("selected recipies :");
      //console.log(recipies);
      recipies.forEach((recipe) => {
        console.log("  . recipe : " + recipe.name);
        console.log("    . scale factor : " + recipe.scale / recipe.portions);
        recipe.ingredients.forEach((ingredient) => {
          if (ingredient._id in selectedIngredients) {
            console.log(
              "    . ingredient need+ : " +
                ingredient.quantity +
                " / " +
                ingredient._id
            );
            selectedIngredients[ingredient._id] +=
              (ingredient.quantity * recipe.scale) / recipe.portions;
          } else {
            console.log(
              "    . ingredient needs : " +
                ingredient.quantity +
                " / " +
                ingredient._id
            );
            //console.log("ingredient");
            //console.log(ingredient);
            selectedIngredients[ingredient._id] =
              (ingredient.quantity * recipe.scale) / recipe.portions;
            //console.log("selectedIngredients");
            //console.log(selectedIngredients);
          }
        });
      });

      //console.log("selectedIngredients");
      //console.log(selectedIngredients);
      // Reset needed and gather name and unit
      let finalSelection = [];
      //console.log("Reset needed and gather name and unit");
      Ingredient.find()
        .then((ingredients) => {
          //console.log("ingredients");
          //console.log(ingredients);
          ingredients.forEach((ingredient) => {
            if (ingredient._id in selectedIngredients) {
              //console.log("  . ingredient : ");
              //console.log(ingredient);
              //console.log("  . selectedIngredients[ingredient._id] : ");
              //console.log(selectedIngredients[ingredient._id]);
              let tempIngredient = {
                _id: ingredient._id,
                name: ingredient.name,
                unit: ingredient.unit,
                quantity: selectedIngredients[ingredient._id],
                available: ingredient.available,
                shopped: ingredient.shopped,
                shops: ingredient.shops,
                category: ingredient.category
              };
              finalSelection.push(tempIngredient);
              //console.log("  . tempIngredient");
              //console.log(tempIngredient);
            }
          });

          //console.log("finalSelection");
          //console.log(finalSelection);

          finalSelection.sort(compare);

          // Answer
          //console.log("ingredient needs updated");
          res.status(200).json({
            status: 200,
            message: "ingredient needs up to date",
            ingredients: finalSelection
          });
        })
        .catch((error) => {
          res.status(400).json({
            status: 400,
            error
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        error
      });
    });
};
