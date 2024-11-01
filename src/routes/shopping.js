const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const shoppingCreate = require("../controllers/shopping/shoppingCreate.js");
const shoppingSave = require("../controllers/shopping/shoppingSave.js");
const shoppingDelete = require("../controllers/shopping/shoppingDelete.js");
const shoppingGetList = require("../controllers/shopping/shoppingGetList.js");
const shoppingDone = require("../controllers/shopping/shoppingDone.js");
const shoppingAvailable = require("../controllers/shopping/shoppingAvailable.js");

router.post("/v1/create", authAuthenticate, shoppingCreate);
router.post("/v1/save", authAuthenticate, shoppingSave);
router.delete("/v1/:shoppingid", authAuthenticate, shoppingDelete);
router.post("/v1/getlist", authAuthenticate, shoppingGetList);
router.post("/v1/done", authAuthenticate, shoppingDone);
router.post("/v1/available", authAuthenticate, shoppingAvailable);

module.exports = router;