const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const transactionCreate = require("../controllers/transaction/transactionCreate.js");
const transactionSave = require("../controllers/transaction/transactionSave.js");
const transactionDelete = require("../controllers/transaction/transactionDelete.js");
const transactionGetOne = require("../controllers/transaction/transactionGetOne.js");
const transactionGetList = require("../controllers/transaction/transactionGetList.js");
const transactionUpdateMany = require("../controllers/transaction/transactionUpdateMany.js");

router.post("/v1/create", authAuthenticate, transactionCreate);
router.post("/v1/save", authAuthenticate, transactionSave);
router.delete("/v1/:transactionid", authAuthenticate, transactionDelete);
router.get("/v1/:transactionid", authAuthenticate, transactionGetOne);
router.post("/v1/getlist", authAuthenticate, transactionGetList);
router.post("/v1/updatemany", authAuthenticate, transactionUpdateMany);

module.exports = router;
1ffc0527c34fd
