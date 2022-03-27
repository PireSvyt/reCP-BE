const express = require("express");
const router = express.Router();
const ingredientCtrl = require("../controllers/ingredient");

router.post("/", ingredientCtrl.createIngredient);
router.get("/:id", ingredientCtrl.findOneIngredient);
router.get("/", ingredientCtrl.findIngredients);
router.put("/:id", ingredientCtrl.modifyIngredient);
router.delete("/:id", ingredientCtrl.deleteIngredient);

module.exports = router;
