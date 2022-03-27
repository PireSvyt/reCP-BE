const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");

router.post("/", recipeCtrl.createRecipe);
router.get("/:id", recipeCtrl.findOneRecipe);
router.get("/", recipeCtrl.findRecipes);
router.put("/:id", recipeCtrl.modifyRecipe);
router.delete("/:id", recipeCtrl.deleteRecipe);

module.exports = router;
