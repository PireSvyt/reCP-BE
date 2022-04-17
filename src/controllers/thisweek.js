const recipeAPI = require("./recipe");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

// https://restfulapi.net/http-status-codes/

exports.findRecipes = (req, res, next) => {
  Recipe.find()
    .then((recipies) => {
      let filteredRecipies = recipies.filter(function (value, index, arr) {
        return value.selected === true;
      });
      res.status(200).json(filteredRecipies);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.updateRecipes = (req, res, next) => {
  const request = { ...req.body };

  //let result = {};

  switch (request.type) {
    case "renewSelection":
      //console.log("PST -- updateRecipes renewSelection");
      renewSelection().then((result) => {
        //console.log("PST -- updateRecipes renewSelection result :");
        //console.log(result);
        res.status(result.status).json({
          message: result.message
        });
      });
      break;
    case "addRecipe":
      //console.log("PST -- updateRecipes addRecipe");
      addRecipe().then((result) => {
        //console.log("PST -- updateRecipes addRecipe result :");
        console.log(result);
        res.status(result.status).json({
          message: result.message
        });
      });
      break;
    case "removeRecipe":
      //console.log("PST -- updateRecipes removeRecipe");
      removeRecipe(request.id).then((result) => {
        //console.log("PST -- updateRecipes removeRecipe result :");
        //console.log(result);
        res.status(result.status).json({
          message: result.message
        });
      });
      break;
    default:
      res.status(433).json({
        message: "Not matching any possibleaction"
      });
  }
};

async function renewSelection() {
  //console.log("ASYNC renewSelection");
  // Reset all to false
  Recipe.find()
    .then((recipies) => {
      let filteredRecipies = recipies.filter(function (value, index, arr) {
        return value.selected === true;
      });
      filteredRecipies.forEach((recipe) => {
        recipe.selected = false;
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
      Recipe.find()
        .then((recipies) => {
          filteredRecipies = recipies.filter(function (value, index, arr) {
            return value.selected === true;
          });
          return {
            status: 200,
            body: filteredRecipies
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
async function addRecipe() {
  // Get list of recipies
  console.log("ASYNC addRecipe");
  Recipe.find()
    .then((recipies) => {
      let filteredRecipies = recipies.filter(function (value, index, arr) {
        return value.selected === false;
      });
      console.log("unselected list");
      // Select among remaining keys
      if (filteredRecipies.length > 0) {
        console.log("some unselected available");
        // Select
        let recipe =
          filteredRecipies[(filteredRecipies.length * Math.random()) << 0];
        console.log("preselected recipe");
        console.log(recipe);
        // Modify
        recipe.selected = true;
        console.log("selected recipe");
        console.log(recipe);
        //req, res, next
        let req = {
          body: recipe
        };
        recipeAPI
          .modifyRecipe(req)
          .then(() => {
            console.log("recipe selection update");
            return {
              status: 200,
              message: "addRecipe effectuée " + recipe._id
            };
          })
          .catch((error) => {
            return { status: 400, error };
          });

        /*
        Recipe.updateOne({ _id: recipe._id }, { recipe })
          .then(() => {
            console.log("recipe selection update");
            return {
              status: 200,
              message: "addRecipe effectuée " + recipe._id
            };
          })
          .catch((error) => {
            return { status: 400, error };
          });
          */
      } else {
        //console.log("no unselected available");
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
