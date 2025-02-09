const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const recipeCreate = require("../controllers/recipe/recipeCreate.js");
const recipeSave = require("../controllers/recipe/recipeSave.js");
const recipeDelete = require("../controllers/recipe/recipeDelete.js");
const recipeGetList = require("../controllers/recipe/recipeGetList.js");
const recipePick = require("../controllers/recipe/recipePick.js");
const recipeScale = require("../controllers/recipe/recipeScale.js");
const recipeCook = require("../controllers/recipe/recipeCook.js");

router.post("/v1/create", authAuthenticate, recipeCreate);
router.post("/v1/save", authAuthenticate, recipeSave);
router.delete("/v1/:recipeid", authAuthenticate, recipeDelete);
router.post("/v1/getlist", authAuthenticate, recipeGetList);
router.post("/v1/pick", authAuthenticate, recipePick);
router.post("/v1/scale", authAuthenticate, recipeScale);
router.post("/v1/cook", authAuthenticate, recipeCook);

module.exports = router;
