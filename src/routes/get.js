const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");
const ingredientCtrl = require("../controllers/ingredient");

router.post("/recipe/list", recipeCtrl.getRecipeList); // Preped
router.post("/recipe/item/:id", recipeCtrl.findOneRecipe); // OK

router.post("/ingredient/list", ingredientCtrl.getIngredientList); // Preped
router.post("/ingredient/item/:id", ingredientCtrl.findOneIngredient); // OK

module.exports = router;
