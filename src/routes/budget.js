const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const communityAugmentReq = require("../controllers/community/communityAugmentReq.js");
const coefficientAugmentReq = require("../controllers/coefficient/coefficientAugmentReq.js");

const budgetCreate = require("../controllers/budget/budgetCreate.js");
const budgetSave = require("../controllers/budget/budgetSave.js");
const budgetDelete = require("../controllers/budget/budgetDelete.js");
const budgetGetList = require("../controllers/budget/budgetGetList.js");
const budgetCompute = require("../controllers/budget/budgetCompute.js");

const budgettargetCreate = require("../controllers/budget/budgettargetCreate.js");
const budgettargetSave = require("../controllers/budget/budgettargetSave.js");
const budgettargetDelete = require("../controllers/budget/budgettargetDelete.js");

router.post("/v1/create", authAuthenticate, budgetCreate);
router.post("/v1/save", authAuthenticate, budgetSave);
router.delete("/v1/:budgetid", authAuthenticate, budgetDelete);
router.post("/v1/getlist", authAuthenticate, budgetGetList);
router.post(
  "/v1/compute",
  authAuthenticate,
  communityAugmentReq,
  coefficientAugmentReq,
  budgetCompute
);

router.post("/target/v1/create", authAuthenticate, budgettargetCreate);
router.post("/target/v1/save", authAuthenticate, budgettargetSave);
router.delete("/target/v1/delete", authAuthenticate, budgettargetDelete);

module.exports = router;
