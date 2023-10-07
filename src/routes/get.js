const express = require("express");
const router = express.Router();

const recipeCtrl = require("../controllers/recipe");
const ingredientCtrl = require("../controllers/ingredient");
const shelfCtrl = require("../controllers/shelf");
const shopCtrl = require("../controllers/shop");
const categoryCtrl = require("../controllers/category");

// Ingredients
router.post("/ingredient/list", ingredientCtrl.getIngredientList);
router.post("/ingredient/item/:id", ingredientCtrl.getIngredientItem);

// Shelfs
router.post("/shelf/list", shelfCtrl.getShelfList);
router.post("/shelf/item/:id", shelfCtrl.getShelfItem);

// Shops
router.post("/shop/list", shopCtrl.getShopList);
router.post("/shop/item/:id", shopCtrl.getShopItem);

// Recipies
router.post("/recipe/list", recipeCtrl.getRecipeList);
router.post("/recipe/item/:id", recipeCtrl.getRecipeItem);

// Categories
router.post("/category/list", categoryCtrl.getCategoryList);
router.post("/category/item/:id", categoryCtrl.getCategoryItem);

module.exports = router;
