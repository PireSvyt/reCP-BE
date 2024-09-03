const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const userGetMe = require("../controllers/user/userGetMe.js");

router.post("/v1/getme", authAuthenticate, userGetMe);

module.exports = router;
