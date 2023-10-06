const express = require("express");
const router = express.Router();

const transactionCtrl = require("../controllers/transaction/transaction");

router.post("/save", transactionCtrl.saveTransaction);

router.post("/list", transactionCtrl.getTransactionList);
router.post("/item/:id", transactionCtrl.getTransactionItem);

router.delete("", transactionCtrl.deleteTransactions);
