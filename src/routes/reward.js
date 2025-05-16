const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const rewardCreate = require("../controllers/reward/rewardCreate.js");
const rewardSave = require("../controllers/reward/rewardSave.js");
const rewardDelete = require("../controllers/reward/rewardDelete.js");
const rewardGetList = require("../controllers/reward/rewardGetList.js");
const rewardExpire = require("../controllers/reward/rewardExpire.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticateAsAdmin,
  rewardCreate
);
router.post("/v1/save", authAuthenticate, authAuthenticateAsAdmin, rewardSave);
router.delete(
  "/v1/:rewardid",
  authAuthenticate,
  authAuthenticateAsAdmin,
  rewardDelete
);
router.post(
  "/v1/getlist",
  authAuthenticate,
  authAuthenticateAsAdmin,
  rewardGetList
);
router.post(
  "/v1/expire",
  authAuthenticate,
  authAuthenticateAsAdmin,
  rewardExpire
);

module.exports = router;
