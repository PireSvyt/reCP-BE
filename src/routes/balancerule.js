const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const balanceruleCreate = require("../controllers/balancerule/balanceruleCreate.js");
const balanceruleSave = require("../controllers/balancerule/balanceruleSave.js");
const balanceruleDelete = require("../controllers/balancerule/balanceruleDelete.js");
const balanceruleGetList = require("../controllers/balancerule/balanceruleGetList.js");

router.post("/v1/create", authAuthenticate, balanceruleCreate);
router.post("/v1/save", authAuthenticate, balanceruleSave);
router.delete("/v1/:balanceruleid", authAuthenticate, balanceruleDelete);
router.post("/v1/getlist", authAuthenticate, balanceruleGetList);

module.exports = router;
