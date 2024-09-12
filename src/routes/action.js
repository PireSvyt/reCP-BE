const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const actionCreate = require("../controllers/action/actionCreate.js");
const actionSave = require("../controllers/action/actionSave.js");
const actionDelete = require("../controllers/action/actionDelete.js");
const actionGetList = require("../controllers/action/actionGetList.js");

router.post("/v1/create", authAuthenticate, actionCreate);
router.post("/v1/save", authAuthenticate, actionSave);
router.delete("/v1/:actionid", authAuthenticate, actionDelete);
router.post("/v1/getlist", authAuthenticate, actionGetList);

module.exports = router;
