const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe");
const ingredientCtrl = require("../controllers/ingredient");
const transactionCtrl = require("../controllers/transaction");
const categorytransactionCtrl = require("../controllers/categorytransaction");
const balanceCtrl = require("../controllers/balance");

// Ingredients
router.post("/ingredient/list", ingredientCtrl.getIngredientList);
router.post("/ingredient/item/:id", ingredientCtrl.getIngredientItem);

// Recipies
router.post("/recipe/list", recipeCtrl.getRecipeList);
router.post("/recipe/item/:id", recipeCtrl.getRecipeItem);

// Transactions
router.post("/transaction/list", transactionCtrl.getTransactionList);
router.post("/transaction/item/:id", transactionCtrl.getTransactionItem);

// Transaction categories
router.post(
  "/categorytransaction/list",
  categorytransactionCtrl.getCategorytransactionList
);
router.post(
  "/categorytransaction/item/:id",
  categorytransactionCtrl.getCategorytransactionItem
);

// Balance
router.post("/balance", balanceCtrl.computeBalance);

module.exports = router;
