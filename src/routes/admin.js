const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const adminGetDatabaseLoad = require("../controllers/admin/adminGetDatabaseLoad.js");
const adminCreateUser = require("../controllers/admin/adminCreateUser.js");
const adminCreateCommunity = require("../controllers/admin/adminCreateCommunity.js");
const adminEncryptDatabase = require("../controllers/admin/adminEncryptDatabase.js");

router.get(
    "/v1/databaseload",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminGetDatabaseLoad,
);
router.post(
    "/v1/createcommunity",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminCreateCommunity,
);
router.post(
    "/v1/createuser",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminCreateUser,
);

router.post(
    "/v1/encryptdatabase",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminEncryptDatabase,
);

module.exports = router;