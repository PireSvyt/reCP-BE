const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");
const ingredientCtrl = require("../controllers/ingredient");

// Ingredients
router.post("/ingredient/list", ingredientCtrl.getIngredientList);
router.post("/ingredient/item/:id", ingredientCtrl.getIngredientItem);

// Recipies
router.post("/recipe/list", recipeCtrl.getRecipeList);
router.post("/recipe/item/:id", recipeCtrl.getRecipeItem);

module.exports = router;
