const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const shelfCreate = require("../controllers/shelf/shelfCreate.js");
const shelfSave = require("../controllers/shelf/shelfSave.js");
const shelfDelete = require("../controllers/shelf/shelfDelete.js");
const shelfGetList = require("../controllers/shelf/shelfGetList.js");

router.post("/v1/create", authAuthenticate, shelfCreate);
router.post("/v1/save", authAuthenticate, shelfSave);
router.delete("/v1/:shelfid", authAuthenticate, shelfDelete);
router.post("/v1/getlist", authAuthenticate, shelfGetList);

module.exports = router;
