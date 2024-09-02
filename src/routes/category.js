const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const categoryCreate = require("../controllers/category/categoryCreate.js");
const categorySave = require("../controllers/category/categorySave.js");
const categoryDelete = require("../controllers/category/categoryDelete.js");
const categoryGetList = require("../controllers/category/categoryGetList.js");

router.post(
    "/v1/create",
    authAuthenticate,
    categoryCreate,
);
router.post(
    "/v1/save",
    authAuthenticate,
    categorySave,
);
router.post(
    "/v1/delete",
    authAuthenticate,
    categoryDelete
);
router.post(
    "/v1/getlist",
    authAuthenticate,
    categoryGetList
);

module.exports = router;