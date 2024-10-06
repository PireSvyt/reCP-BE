const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const adminGetDatabaseLoad = require("../controllers/admin/adminGetDatabaseLoad.js");
const adminSettingGetList = require("../controllers/admin/adminSettingGetList.js");
const adminSettingSave = require("../controllers/admin/adminSettingSave.js");
const adminCommunityGetList = require("../controllers/admin/adminCommunityGetList.js");

router.get(
    "/v1/databaseload",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminGetDatabaseLoad,
);
router.post(
    "/v1/settingsave",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminSettingSave,
);
router.get(
    "/v1/settings",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminSettingGetList,
);
router.get(
    "/v1/communities",
    authAuthenticate,
    authAuthenticateAsAdmin,
    adminCommunityGetList,
);

module.exports = router;