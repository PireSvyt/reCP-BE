const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const adminGetDatabaseLoad = require("../controllers/admin/adminGetDatabaseLoad.js");

router.get(
    "/v1/databaseload",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminGetDatabaseLoad,
);

module.exports = router;