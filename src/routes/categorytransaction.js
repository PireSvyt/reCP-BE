const express = require("express");
const router = express.Router();
const categorytransactionCtrl = require("../controllers/categorytransaction");

router.post("/", categorytransactionCtrl.createCategoryTransaction);
router.get("/:id", categorytransactionCtrl.findOneCategoryTransaction);
router.get("/", categorytransactionCtrl.findCategoryTransactions);
router.put("/:id", categorytransactionCtrl.modifyCategoryTransaction);
router.delete("/:id", categorytransactionCtrl.deleteCategoryTransaction);

module.exports = router;
