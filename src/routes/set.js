const express = require("express");
const router = express.Router();
const ingredientCtrl = require("../controllers/ingredient");
const recipeCtrl = require("../controllers/recipe");
const transactionCtrl = require("../controllers/transaction");
const categoryCtrl = require("../controllers/categorytransaction");
const thisweekCtrl = require("../controllers/thisweek");

// Ingredients
router.post("/ingredient/save", ingredientCtrl.saveIngredient);

// Recipies
router.post("/recipe/save", recipeCtrl.saveRecipe);
router.post("/recipe/select/:id", recipeCtrl.selectRecipe);
router.post("/recipe/prepare/:id", recipeCtrl.prepareRecipe);
router.post("/recipe/delete/:id", recipeCtrl.deleteRecipe);

// This week TODO
router.post("/thisweek/renew", thisweekCtrl.renewSelection);
router.post("/thisweek/empty", thisweekCtrl.emptySelection);
router.post("/thisweek/add", thisweekCtrl.addRecipe);

// Fridge TODO
router.post("/fridge/renew", thisweekCtrl.renewSelection);
router.post("/fridge/reset/:id", thisweekCtrl.removeRecipe);
router.post("/fridge/set/:id", thisweekCtrl.removeRecipe);

// Shop TODO
router.post("/shop/renew", thisweekCtrl.renewSelection);
router.post("/shop/reset/:id", thisweekCtrl.removeRecipe);
router.post("/shop/set/:id", thisweekCtrl.removeRecipe);

// Transactions
router.post("/transaction/save", transactionCtrl.saveTransaction);
router.post("/transaction/delete/:id", transactionCtrl.deleteTransaction);

// Categories
router.post("/category/save", categoryCtrl.saveCategorytransaction);

module.exports = router;
