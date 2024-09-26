const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const coefficientCreate = require("../controllers/coefficient/coefficientCreate.js");
const coefficientSave = require("../controllers/coefficient/coefficientSave.js");
const coefficientDelete = require("../controllers/coefficient/coefficientDelete.js");
const coefficientGetList = require("../controllers/coefficient/coefficientGetList.js");

router.post("/v1/create", authAuthenticate, coefficientCreate);
router.post("/v1/save", authAuthenticate, coefficientSave);
router.delete("/v1/:coefficientid", authAuthenticate, coefficientDelete);
router.post("/v1/getlist", authAuthenticate, coefficientGetList);

module.exports = router;
