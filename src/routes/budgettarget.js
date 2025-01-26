const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const budgettargetCreate = require("../controllers/budget/budgettargetCreate.js");
const budgettargetSave = require("../controllers/budget/budgettargetSave.js");
const budgettargetDelete = require("../controllers/budget/budgettargetDelete.js");
const budgettargetGetList = require("../controllers/budget/budgettargetGetList.js");
const budgettargetCompute = require("../controllers/budgettarget/budgettargetCompute.js");

router.post("/v1/create", authAuthenticate, budgettargetCreate);
router.post("/v1/save", authAuthenticate, budgettargetSave);
router.delete("/v1/:budgettargetid", authAuthenticate, budgettargetDelete);
router.post("/v1/getlist", authAuthenticate, budgettargetGetList);
router.post("/v1/comute", authAuthenticate, budgettargetCompute);

module.exports = router;
