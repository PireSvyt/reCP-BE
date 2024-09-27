const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const trashCreate = require("../controllers/trash/trashCreate.js");
const trashSave = require("../controllers/trash/trashSave.js");
const trashDelete = require("../controllers/trash/trashDelete.js");
const trashGetList = require("../controllers/trash/trashGetList.js");

router.post("/v1/create", authAuthenticate, trashCreate);
router.post("/v1/save", authAuthenticate, trashSave);
router.delete("/v1/:trashid", authAuthenticate, trashDelete);
router.post("/v1/getlist", authAuthenticate, trashGetList);

module.exports = router;