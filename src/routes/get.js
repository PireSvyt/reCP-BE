const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");
const ingredientCtrl = require("../controllers/ingredient");

router.post("/recipe/list", recipeCtrl.getRecipeList);
router.post("/recipe/item/:id", recipeCtrl.getRecipeItem);

router.post("/ingredient/list", ingredientCtrl.getIngredientList);
router.post("/ingredient/item/:id", ingredientCtrl.getIngredientItem);

module.exports = router;
