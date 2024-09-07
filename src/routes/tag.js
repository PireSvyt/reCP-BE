const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const tagCreate = require("../controllers/tag/tagCreate.js");
const tagSave = require("../controllers/tag/tagSave.js");
const tagDelete = require("../controllers/tag/tagDelete.js");
const tagGetList = require("../controllers/tag/tagGetList.js");

router.post("/v1/create", authAuthenticate, tagCreate);
router.post("/v1/save", authAuthenticate, tagSave);
router.delete("/v1/:tagid", authAuthenticate, tagDelete);
router.post("/v1/getlist", authAuthenticate, tagGetList);

module.exports = router;
