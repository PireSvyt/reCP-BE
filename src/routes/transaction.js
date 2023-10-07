const express = require("express");
const router = express.Router();

const transactionCtrl = require("../controllers/transaction/transaction");

router.post("/save", transactionCtrl.save);

router.post("/list", transactionCtrl.getMany);
router.post("/item/:id", transactionCtrl.getOne);

router.post("/delete/one/:id", transactionCtrl.deleteOne);
router.post("/delete/all", transactionCtrl.deleteAll);

module.exports = router;
