const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsAdmin = require("../controllers/auth/authAuthenticateAsAdmin.js");

const communityCreate = require("../controllers/community/communityCreate.js");
const communitySave = require("../controllers/community/communitySave.js");
const communityDelete = require("../controllers/community/communityDelete.js");
const communityGetMine = require("../controllers/community/communityGetMine.js");

router.post("/v1/create", authAuthenticate, authAuthenticateAsAdmin, communityCreate);
router.post("/v1/save", authAuthenticate, authAuthenticateAsAdmin, communitySave);
router.delete("/v1/:communityid", authAuthenticate, authAuthenticateAsAdmin, communityDelete);
router.get("/v1/getmine", authAuthenticate, communityGetMine);

module.exports = router;