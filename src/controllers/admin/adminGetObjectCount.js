require("dotenv").config();
const Action = require("../../models/Action.js");
const Category = require("../../models/Category.js");
const Coefficient = require("../../models/Coefficient.js");
const Community = require("../../models/Community.js");
const Recurrence = require("../../models/Recurrence.js");
const Shelf = require("../../models/Shelf.js");
const Shopping = require("../../models/Shopping.js");
const Tag = require("../../models/Tag.js");
const Transaction = require("../../models/Transaction.js");
const Trash = require("../../models/Trash.js");
const User = require("../../models/User.js");

module.exports = adminGetObjectCount = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.objectcount.success
  * admin.objectcount.error.oncount
  
  */

  if (process.env.DEBUG) {
    console.log("admin.objectcount");
  }
  
  let outcome = {
	  actions: { state: "pending", count: null},
	  categories: { state: "pending", count: null},
	  coefficients: { state: "pending", count: null},
	  communities: { state: "pending", count: null},
	  recurrences: { state: "pending", count: null},
	  shelves: { state: "pending", count: null},
	  shoppings: { state: "pending", count: null},
	  tags: { state: "pending", count: null},
	  transactions: { state: "pending", count: null},
	  trashes: { state: "pending", count: null},
	  users: { state: "pending", count: null},
  }
  
  function updateObject (obj, count) {
	  outcome[obj].state = "done"
	  outcome[obj].count = count
  }
  function errorObject (obj, error) {
    console.log(obj + " error", error);
	  outcome[obj].state = "error"
	  outcome[obj].count = 0
	  outcome[obj].error = error
  }
  
  Promise.all([
	  Action.countDocuments()
      .then((count) => {
	      updateObject("actions", count)
      })
      .catch((error) => {
        console.log("actions error", error);
	      errorObject("actions", error)
      }),
	  Category.countDocuments()
      .then((count) => {
	      updateObject("categories", count)
      })
      .catch((error) => {
	      errorObject("categories", error)
      }),
	  Coefficient.countDocuments()
      .then((count) => {
	      updateObject("coefficients", count)
      })
      .catch((error) => {
	      errorObject("coefficients", error)
      }),
	  Community.countDocuments()
      .then((count) => {
	      updateObject("communities", count)
      })
      .catch((error) => {
	      errorObject("communities", error)
      }),
	  Recurrence.countDocuments()
      .then((count) => {
	      updateObject("recurrences", count)
      })
      .catch((error) => {
	      errorObject("recurrences", error)
      }),
	  Shelf.countDocuments()
      .then((count) => {
	      updateObject("shelves", count)
      })
      .catch((error) => {
	      errorObject("shelves", error)
      }),
	  Shopping.countDocuments()
      .then((count) => {
	      updateObject("shoppings", count)
      })
      .catch((error) => {
	      errorObject("shoppings", error)
      }),
	  Tag.countDocuments()
      .then((count) => {
	      updateObject("tags", count)
      })
      .catch((error) => {
	      errorObject("tags", error)
      }),
	  Transaction.countDocuments()
      .then((count) => {
	      updateObject("transactions", count)
      })
      .catch((error) => {
	      errorObject("transactions", error)
      }),
	  Trash.countDocuments()
      .then((count) => {
	      updateObject("trashes", count)
      })
      .catch((error) => {
	      errorObject("trashes", error)
      }),
	  User.countDocuments()
      .then((count) => {
	      updateObject("users", count)
      })
      .catch((error) => {
	      errorObject("users", error)
      })
	]).then(() => {
	  console.log('counts outcome ', outcome);
	  res.status(200).json({
      type: "admin.objectcount.success",
      data: { counts: outcome },
    });
	}).catch((error) => {
	  console.log('counts error: ', error);
    res.status(400).json({
      type: "admin.objectcount.error.oncount",
      error: error,
    });
	});
};