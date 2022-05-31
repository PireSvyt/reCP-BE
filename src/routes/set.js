const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");
const thisweekCtrl = require("../controllers/thisweek");

router.post("/recipe/save", recipeCtrl.saverecipe);
router.post("/recipe/select/:id", recipeCtrl.selectrecipe);
router.post("/recipe/prepare", recipeCtrl.preparerecipe);

router.post("/thisweek/renew", thisweekCtrl.renewSelection);
router.post("/thisweek/empty", thisweekCtrl.emptySelection);
router.post("/thisweek/add", thisweekCtrl.addRecipe);
router.post("/thisweek/remove/:id", thisweekCtrl.removeRecipe);

module.exports = router;
