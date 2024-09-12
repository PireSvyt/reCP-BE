const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const recurrenceCreate = require("../controllers/recurrence/recurrenceCreate.js");
const recurrenceSave = require("../controllers/recurrence/recurrenceSave.js");
const recurrenceDelete = require("../controllers/recurrence/recurrenceDelete.js");
const recurrenceGetList = require("../controllers/recurrence/recurrenceGetList.js");
const recurrenceGenerateActions = require("../controllers/recurrence/recurrenceGenerateActions.js");

router.post("/v1/create", authAuthenticate, recurrenceCreate);
router.post("/v1/save", authAuthenticate, recurrenceSave);
router.delete("/v1/:recurrenceid", authAuthenticate, recurrenceDelete);
router.post("/v1/getlist", authAuthenticate, recurrenceGetList);
router.post("/v1/generateactions", authAuthenticate, recurrenceGenerateActions);

module.exports = router;
