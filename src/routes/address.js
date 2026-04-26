const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const addressCreate = require("../controllers/address/addressCreate.js");
const addressSave = require("../controllers/address/addressSave.js");
const addressDelete = require("../controllers/address/addressDelete.js");
const addressGetList = require("../controllers/address/addressGetList.js");

router.post("/v1/create", authAuthenticate, addressCreate);
router.post("/v1/save", authAuthenticate, addressSave);
router.delete("/v1/:addressid", authAuthenticate, addressDelete);
router.post("/v1/getlist", authAuthenticate, addressGetList);

module.exports = router;
