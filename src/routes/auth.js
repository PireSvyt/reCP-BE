const express = require("express");
const router = express.Router();

//const authSignUp = require("../controllers/auth/authSignUp.js");
//const authActivate = require("../controllers/auth/authActivate.js");
const authSignIn = require("../controllers/auth/authSignIn.js");
const authAssess = require("../controllers/auth/authAssess.js");
//const authExistingPseudo = require("../controllers/auth/authExistingPseudo.js");
//const authSendActivation = require("../controllers/auth/authSendActivation.js");
const authSendPassword = require("../controllers/auth/authSendPassword.js");
const authPasswordReset = require("../controllers/auth/authPasswordReset.js");

//router.post("/v1/signup", authSignUp);
//router.post("/v1/activate", authActivate);
router.post("/v1/signin", authSignIn);
router.post("/v1/assess", authAssess);
//router.post("/v1/existingpseudo", authExistingPseudo);
//router.post("/v1/sendactivation", authSendActivation);
router.post("/v1/sendpassword", authSendPassword);
router.post("/v1/passwordreset", authPasswordReset);

module.exports = router;