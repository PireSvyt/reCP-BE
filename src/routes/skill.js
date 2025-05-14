const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const skillCreate = require("../controllers/skill/skillCreate.js");
const skillSave = require("../controllers/skill/skillSave.js");
const skillDelete = require("../controllers/skill/skillDelete.js");
const skillGetList = require("../controllers/skill/skillGetList.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticateAsAdmin,
  skillCreate
);
router.post("/v1/save", authAuthenticate, authAuthenticateAsAdmin, skillSave);
router.delete(
  "/v1/:skillid",
  authAuthenticate,
  authAuthenticateAsAdmin,
  skillDelete
);
router.post(
  "/v1/getlist",
  authAuthenticate,
  authAuthenticateAsAdmin,
  skillGetList
);

module.exports = router;
