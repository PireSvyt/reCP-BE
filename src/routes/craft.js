const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const craftCreate = require("../controllers/craft/craftCreate.js");
const craftSave = require("../controllers/craft/craftSave.js");
const craftDelete = require("../controllers/craft/craftDelete.js");
const craftGetList = require("../controllers/craft/craftGetList.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticateAsAdmin,
  craftCreate
);
router.post("/v1/save", authAuthenticate, authAuthenticateAsAdmin, craftSave);
router.delete(
  "/v1/:craftid",
  authAuthenticate,
  authAuthenticateAsAdmin,
  craftDelete
);
router.post(
  "/v1/getlist",
  authAuthenticate,
  authAuthenticateAsAdmin,
  craftGetList
);

module.exports = router;
