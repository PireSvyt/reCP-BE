const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const budgettargetCreate = require("../controllers/budgettarget/budgettargetCreate.js");
const budgettargetSave = require("../controllers/budgettarget/budgettargetSave.js");
const budgettargetDelete = require("../controllers/budgettarget/budgettargetDelete.js");
const budgettargetGetList = require("../controllers/budgettarget/budgettargetGetList.js");

router.post("/v1/create", authAuthenticate, budgettargetCreate);
router.post("/v1/save", authAuthenticate, budgettargetSave);
router.delete("/v1/:budgettargetid", authAuthenticate, budgettargetDelete);
router.post("/v1/getlist", authAuthenticate, budgettargetGetList);

module.exports = router;
