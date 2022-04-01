const express = require("express");
const router = express.Router();
const balanceCtrl = require("../controllers/balance");

router.get("/compute", balanceCtrl.computeBalance);

module.exports = router;
