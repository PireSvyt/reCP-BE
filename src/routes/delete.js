const express = require("express");
const router = express.Router();

const ingredientCtrl = require("../controllers/ingredient");
const shelfCtrl = require("../controllers/shelf");
const shopCtrl = require("../controllers/shop");
const recipeCtrl = require("../controllers/recipe");
const transactionCtrl = require("../controllers/transaction/transaction");
const categoryCtrl = require("../controllers/category");
const thisweekCtrl = require("../controllers/thisweek");
const fridgeCtrl = require("../controllers/fridge");
const shoppingCtrl = require("../controllers/shopping");

// Transactions
router.delete("/transaction/:id", transactionCtrl.deleteTransaction);
router.delete("/transactions", transactionCtrl.deleteTransactions);
