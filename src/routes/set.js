const express = require("express");
const router = express.Router();

const ingredientCtrl = require("../controllers/ingredient");
const shelfCtrl = require("../controllers/shelf");
const shopCtrl = require("../controllers/shop");
const recipeCtrl = require("../controllers/recipe");
const categoryCtrl = require("../controllers/category");
const thisweekCtrl = require("../controllers/thisweek");
const fridgeCtrl = require("../controllers/fridge");
const shoppingCtrl = require("../controllers/shopping");

// Ingredients
router.post("/ingredient/save", ingredientCtrl.saveIngredient);

// Shelfs
router.post("/shelf/save", shelfCtrl.saveShelf);

// Shops
router.post("/shop/save", shopCtrl.saveShop);

// Recipies
router.post("/recipe/save", recipeCtrl.saveRecipe);
router.post("/recipe/select/:id", recipeCtrl.selectRecipe);
router.post("/recipe/prepare/:id", recipeCtrl.prepareRecipe);
router.post("/recipe/delete/:id", recipeCtrl.deleteRecipe);
router.post("/recipe/replace/:id", recipeCtrl.replaceRecipe);
router.post("/recipe/scaleup/:id", recipeCtrl.scaleupRecipe);
router.post("/recipe/scaledown/:id", recipeCtrl.scaledownRecipe);

// This week
router.post("/thisweek/renew", thisweekCtrl.renewSelection);
router.post("/thisweek/empty", thisweekCtrl.emptySelection);
router.post("/thisweek/add", thisweekCtrl.addRecipe);
router.post("/thisweek/needs", thisweekCtrl.updateIngredientNeeds);

// Fridge
router.post("/fridge/empty", fridgeCtrl.emptyFridge);
router.post("/fridge/have/:id", fridgeCtrl.haveIngredient);

// Shopping
router.post("/shopping/empty", shoppingCtrl.emptyShopping);
router.post("/shopping/take/:id", shoppingCtrl.takeIngredient);
router.post("/shopping/addtofridge", shoppingCtrl.addToFridge);

// Categories
router.post("/category/save", categoryCtrl.saveCategory);
router.post("/category/save", categoryCtrl.deleteCategory);

module.exports = router;
