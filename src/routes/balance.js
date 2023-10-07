const express = require("express");
const router = express.Router();

const balanceCtrl = require("../controllers/balance/balance");

router.post("/get", balanceCtrl.get);

module.exports = router;
