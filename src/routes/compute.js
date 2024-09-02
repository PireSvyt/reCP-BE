const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const computeBalance = require("../controllers/compute/computeBalance.js");

router.get(
    "/v1/balance",
    authAuthenticate,
    computeBalance,
);

module.exports = router;