const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const userCreate = require("../controllers/user/userCreate.js");
const userSave = require("../controllers/user/userSave.js");
const userDelete = require("../controllers/user/userDelete.js");
const userGetMe = require("../controllers/user/userGetMe.js");

router.post("/v1/create", authAuthenticate, authAuthenticateAsAdmin, userCreate);
router.post("/v1/save", authAuthenticate, authAuthenticateAsAdmin, userSave);
router.delete("/v1/:userid", authAuthenticate, authAuthenticateAsAdmin, userDelete);
router.get("/v1/getme", authAuthenticate, userGetMe);

module.exports = router;
