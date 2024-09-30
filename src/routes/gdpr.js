const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const gdprAccessUserData = require("../controllers/gdpr/gdprAccessUserData.js");
const gdprEditUserData = require("../controllers/gdpr/gdprEditUserData.js");
const gdprDeleteUserData = require("../controllers/gdpr/gdprDeleteUserData.js");
const gdprDeleteCommunityData = require("../controllers/gdpr/gdprDeleteCommunityData.js");

router.post("/v1/accessuserdata", authAuthenticate, gdprAccessUserData);
router.post("/v1/edituserdata", authAuthenticate, gdprEditUserData);
router.post("/v1/deleteuserdata", authAuthenticate, gdprDeleteUserData);
router.post("/v1/deletecommunitydata", authAuthenticate, gdprDeleteCommunityData);

module.exports = router;