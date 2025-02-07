const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const settingCreate = require("../controllers/setting/settingCreate.js");
const settingSave = require("../controllers/setting/settingSave.js");
const settingDelete = require("../controllers/setting/settingDelete.js");
const settingGetList = require("../controllers/setting/settingGetList.js");

router.post("/v1/create", authAuthenticate, settingCreate);
router.post("/v1/save", authAuthenticate, settingSave);
router.delete("/v1/:settingid", authAuthenticate, settingDelete);
router.post("/v1/getlist", authAuthenticate, settingGetList);

module.exports = router;
