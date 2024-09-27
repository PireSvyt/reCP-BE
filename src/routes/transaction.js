const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const transactionCreate = require("../controllers/transaction/transactionCreate.js");
const transactionSave = require("../controllers/transaction/transactionSave.js");
const transactionDelete = require("../controllers/transaction/transactionDelete.js");
const transactionGetList = require("../controllers/transaction/transactionGetList.js");
const transactionUpdateMany = require("../controllers/transaction/transactionUpdateMany.js");
const transactionCurve = require("../controllers/transaction/transactionCurve.js");
const transactionBalance = require("../controllers/transaction/transactionBalance.js");

router.post("/v1/create", authAuthenticate, transactionCreate);
router.post("/v1/save", authAuthenticate, transactionSave);
router.delete("/v1/:transactionid", authAuthenticate, transactionDelete);
router.post("/v1/getlist", authAuthenticate, transactionGetList);
router.post("/v1/updatemany", authAuthenticate, transactionUpdateMany);
router.post("/v1/curve", authAuthenticate, transactionCurve);
router.post("/v1/balance", authAuthenticate, transactionBalance);

module.exports = router;