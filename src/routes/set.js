const express = require("express");
const router = express.Router();
const ingredientCtrl = require("../controllers/ingredient");
const recipeCtrl = require("../controllers/recipe");
const thisweekCtrl = require("../controllers/thisweek");

router.post("/ingredient/save", ingredientCtrl.saveIngredient);

router.post("/recipe/save", recipeCtrl.saveRecipe);
router.post("/recipe/select/:id", recipeCtrl.selectRecipe);
router.post("/recipe/prepare", recipeCtrl.prepareRecipe);

router.post("/thisweek/renew", thisweekCtrl.renewSelection);
router.post("/thisweek/empty", thisweekCtrl.emptySelection);
router.post("/thisweek/add", thisweekCtrl.addRecipe);
router.post("/thisweek/remove/:id", thisweekCtrl.removeRecipe);

router.post("/fridge/renew", thisweekCtrl.renewSelection);
router.post("/fridge/reset/:id", thisweekCtrl.removeRecipe);
router.post("/fridge/set/:id", thisweekCtrl.removeRecipe);

router.post("/shop/renew", thisweekCtrl.renewSelection);
router.post("/shop/reset/:id", thisweekCtrl.removeRecipe);
router.post("/shop/set/:id", thisweekCtrl.removeRecipe);

module.exports = router;
