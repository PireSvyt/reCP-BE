require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");
const convert = require("../../utils/convert.js");

module.exports = recipePick = (req, res, next) => {
  /*
	
	picks a recipe to cook and impacts the ingredient shoppings' need and done
	
	possible response types
	- recipe.pick.error
	- recipe.pick.error.onmodify
	- recipe.pick.success
	
	inputs
	- recipeid to pick specifically a given recipe
	
	*/

  if (process.env.DEBUG) {
    console.log("recipe.pick");
  }

  let matches = {
    communityid: req.augmented.user.communityid,
  };
  if (req.body.recipeids !== undefined) {
    matches.recipeid = req.body.recipeids;
  } // Else random pick

  let nowDate = new Date();

  let expiredRecipes = [];
  let stillValidRecipes = [];
  let selectableRecipes = [];
  let pickedRecipes = [];
  let recipesToSave = [];
  let recipesToSend = [];
  let more = undefined;

  let shoppingsids = [];
  let shoppingsDict = {};
  let shoppingsToSave = [];

  let promises = [];

  Recipe.find(
    matches,
    "recipeid name portions scale ingredients instructions tocook cooked cookedlaston tagids"
  )
    .then((recipes) => {
      //console.log("matching recipes", recipes)

      // Seggregate recipes valid vs expired
      if (req.body.recipeids !== undefined) {
        // Manage specifically those recipes
        stillValidRecipes = [...recipes];
        pickedRecipes = [...recipes];
      } else {
        // Check the recipe for expired and candidates
        recipes.forEach((recipe) => {
          if (recipe._doc.cooked === true) {
            if (recipe._doc.cookedlaston !== undefined) {
              let cookedDate = new Date(recipe._doc.cookedlaston);
              if (cookedDate < nowDate - 3 * (1000 * 3600 * 24)) {
                expiredRecipes.push(recipe);
              } else {
                stillValidRecipes.push(recipe);
              }
            } else {
              expiredRecipes.push(recipe);
            }
          } else {
            if (recipe._doc.tocook === true) {
              stillValidRecipes.push(recipe);
            } else {
              selectableRecipes.push(recipe);
              stillValidRecipes.push(recipe);
            }
          }
        });
        // Pick randomly a recipe
        if (selectableRecipes.length > 0) {
          more = selectableRecipes.length > 1;
          pickedRecipes.push({
            ...selectableRecipes[
              Math.floor(Math.random() * selectableRecipes.length)
            ],
          });
        } else {
          more = false;
        }
      }
      //console.log("expiredRecipes",expiredRecipes)
      //console.log("stillValidRecipes",stillValidRecipes)
      console.log("pickedRecipes", pickedRecipes);

      if (pickedRecipes.length === 0) {
        // No more to pick
        return res.status(200).json({
          type: "recipe.pick.success",
          recipes: [],
          more: false,
          shoppings: [],
        });
      } else {
        // Aggregate ingredients
        pickedRecipes.forEach((recipe) => {
          recipe._doc.ingredients.forEach((ingredient) => {
            shoppingsids.push(ingredient.shoppingid);
          });
        });
        //console.log("shoppingsids",shoppingsids)

        // Find ingredients
        Shopping.find(
          { shoppingid: { $in: shoppingsids } },
          "shoppingid name shelfid unit need available done prices"
        )
          .then((shoppings) => {
            // Set shoppings as a dict for convenience
            shoppings.forEach((shopping) => {
              shoppingsDict[shopping.shoppingid] = { ...shopping._doc };
              if (
                shoppingsDict[shopping.shoppingid].need === null ||
                shoppingsDict[shopping.shoppingid].need === undefined
              ) {
                shoppingsDict[shopping.shoppingid].need = 0;
              }
            });

            // Manage change of picked recipes
            pickedRecipes.forEach((recipe) => {
              let recipeToSave = { ...recipe._doc };
              //console.log("picked recipe", recipeToSave)
              if (recipeToSave.tocook) {
                recipeToSave.tocook = false;
                recipeToSave.cooked = false;
                more = true;
              } else {
                recipeToSave.tocook = true;
                recipeToSave.scale = recipeToSave.portions;
                recipeToSave.ingredients.forEach((ingredient) => {
                  // Add shopping to save list
                  if (
                    Object.keys(shoppingsDict).includes(ingredient.shoppingid)
                  ) {
                    // Add to shoppings to save
                    shoppingsDict[ingredient.shoppingid].need = Math.max(
                      shoppingsDict[ingredient.shoppingid].need +
                        Math.floor(
                          (100 *
                            convert(
                              ingredient.quantity,
                              ingredient.unit,
                              shoppingsDict[ingredient.shoppingid].unit
                            ) *
                            recipeToSave.scale) /
                            recipeToSave.portions
                        ) /
                          100,
                      0
                    );
                    shoppingsDict[ingredient.shoppingid].done = false;
                  }
                });
              }
              recipesToSave.push(recipeToSave);
            });
            //console.log("recipesToSave",recipesToSave)

            // Put back shoppings as a list
            shoppingsToSave = Object.values(shoppingsDict);
            //console.log("shoppingsToSave",shoppingsToSave)

            // Add to recipes to save
            recipesToSend = recipesToSave.map((recipe) => {
              return {
                recipeid: recipe.recipeid,
                name: recipe.name,
                portions: recipe.portions,
                scale: recipe.scale,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                tocook: recipe.tocook,
                cooked: recipe.cooked,
                cookedlaston: recipe.cookedlaston,
                tagids: recipe.tagids,
              };
            });
            //console.log("recipesToSend",recipesToSend)

            // Updates
            let outcome = {
              recipes: { state: "pending", count: null },
              shoppings: { state: "pending", count: null },
            };
            function updateObject(obj, count) {
              outcome[obj].state = "done";
              outcome[obj].count = count;
            }
            function errorObject(obj, error) {
              //console.log(obj + " error", error);
              outcome[obj].state = "error";
              outcome[obj].count = 0;
              outcome[obj].error = error;
            }
            if (recipesToSend.length > 0) {
              // Update recipes
              let bulkRecipes = [];
              recipesToSend.forEach((recipe) => {
                bulkRecipes.push({
                  updateOne: {
                    filter: { recipeid: recipe.recipeid },
                    update: recipe,
                  },
                });
              });
              promises.push(
                Recipe.bulkWrite(bulkRecipes)
                  .then((recipeOutcome) => {
                    updateObject("recipes", recipeOutcome.modifiedCount);
                  })
                  .catch((error) => {
                    //console.log("recipes error", error);
                    errorObject("recipes", error);
                  })
              );
            }
            if (shoppingsToSave.length > 0) {
              // Update shoppings
              let bulkShoppings = [];
              shoppingsToSave.forEach((shopping) => {
                bulkShoppings.push({
                  updateOne: {
                    filter: { shoppingid: shopping.shoppingid },
                    update: shopping,
                  },
                });
              });
              promises.push(
                Shopping.bulkWrite(bulkShoppings)
                  .then((shoppingOutcome) => {
                    updateObject("shoppings", shoppingOutcome.modifiedCount);
                  })
                  .catch((error) => {
                    //console.log("shoppings error", error);
                    errorObject("shoppings", error);
                  })
              );
            }
            //console.log("promises",promises)
            // Fire promises
            if (promises.length === 0) {
              return res.status(200).json({
                type: "recipe.pick.success",
                recipes: [],
                more: false,
                shoppings: [],
              });
            } else {
              Promise.all(promises)
                .then(() => {
                  console.log("recipe.pick.success");
                  return res.status(200).json({
                    type: "recipe.pick.success",
                    recipes: recipesToSend,
                    more: more,
                    shoppings: shoppingsToSave,
                    outcome: outcome,
                  });
                })
                .catch((error) => {
                  console.log("recipe.pick.error.onupdate");
                  console.error(error);
                  return res.status(400).json({
                    type: "recipe.pick.erroronupdate",
                    error: error,
                  });
                });
            }
          })
          .catch((error) => {
            console.log("recipe.pick.error");
            console.error(error);
            return res.status(400).json({
              type: "recipe.pick.error",
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      console.log("recipe.pick.error");
      console.error(error);
      return res.status(400).json({
        type: "recipe.pick.error",
        error: error,
      });
    });
};
