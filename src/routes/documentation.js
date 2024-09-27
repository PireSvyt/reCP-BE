const express = require("express");
const router = express.Router();

const documentationGetRecordMap = require("../controllers/documentation/documentationGetRecordMap.js");

router.get("/v1/:documentationpageid",  documentationGetRecordMap);

module.exports = router;