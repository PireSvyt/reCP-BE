const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const computeBalance = require("../controllers/compute/computeBalance.js");
const computeCurve = require("../controllers/compute/computeCurve.js");

router.get("/v1/balance", authAuthenticate, computeBalance);
router.post("/v1/curve", authAuthenticate, computeCurve);

module.exports = router;
