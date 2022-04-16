const express = require("express");
const router = express.Router();
const thisweekCtrl = require("../controllers/thisweek");

router.get("/", thisweekCtrl.findRecipes);
/*
router.get("/renew", thisweekCtrl.renewRecipes);
router.get("/add", thisweekCtrl.addRecipe);
router.get("/remove/:id", thisweekCtrl.removeRecipe);
router.get("/remove", thisweekCtrl.removeAllRecipes);
*/
module.exports = router;
