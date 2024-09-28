const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const adminGetObjectCount = require("../controllers/admin/adminGetObjectCount.js");

router.get(
"/v1/objectcount",
authAuthenticate,
authAuthenticateAsAdmin,
adminGetObjectCount,
);

module.exports = router;