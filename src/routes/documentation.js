const express = require("express");
const router = express.Router();

import {documentationGetRecordMap} from "../controllers/documentation/documentationGetRecordMap.js";

router.get("/v1/:documentationpageid",  documentationGetRecordMap);

module.exports = router;