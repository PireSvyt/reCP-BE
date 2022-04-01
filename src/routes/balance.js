const express = require("express");
const router = express.Router();
const balanceCtrl = require("../controllers/balance");

router.get("/", balanceCtrl.computeBalance);

module.exports = router;
