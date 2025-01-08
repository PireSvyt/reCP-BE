const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const shoppingpriceCreate = require("../controllers/shoppingprice/shoppingpriceCreate.js");
const shoppingpriceSave = require("../controllers/shoppingprice/shoppingpriceSave.js");
const shoppingpriceDelete = require("../controllers/shoppingprice/shoppingpriceDelete.js");

router.post("/v1/create", authAuthenticate, shoppingpriceCreate);
router.post("/v1/save", authAuthenticate, shoppingpriceSave);
router.delete("/v1/:shoppingpriceid", authAuthenticate, shoppingpriceDelete);

module.exports = router;
