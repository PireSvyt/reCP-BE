const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const shopCreate = require("../controllers/shop/shopCreate.js");
const shopSave = require("../controllers/shop/shopSave.js");
const shopDelete = require("../controllers/shop/shopDelete.js");
const shopGetList = require("../controllers/shop/shopGetList.js");

router.post("/v1/create", authAuthenticate, shopCreate);
router.post("/v1/save", authAuthenticate, shopSave);
router.delete("/v1/:shopid", authAuthenticate, shopDelete);
router.post("/v1/getlist", authAuthenticate, shopGetList);

module.exports = router;