const express = require("express");
const router = express.Router();
const transactionCtrl = require("../controllers/transaction");

router.post("/", transactionCtrl.createTransaction);
router.get("/:id", transactionCtrl.findOneTransaction);
router.get("/", transactionCtrl.findTransactions);
router.put("/:id", transactionCtrl.modifyTransaction);
router.delete("/:id", transactionCtrl.deleteTransaction);

module.exports = router;
