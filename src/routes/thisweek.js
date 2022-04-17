const express = require("express");
const router = express.Router();
const thisweekCtrl = require("../controllers/thisweek");

router.get("/", thisweekCtrl.findRecipes);
router.post("/", thisweekCtrl.updateRecipes);

module.exports = router;
