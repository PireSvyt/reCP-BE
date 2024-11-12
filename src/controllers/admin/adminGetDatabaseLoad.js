require("dotenv").config();
const Action = require("../../models/Action.js");
const Budget = require("../../models/Budget.js");
const Category = require("../../models/Category.js");
const Coefficient = require("../../models/Coefficient.js");
const Community = require("../../models/Community.js");
const Recipe = require("../../models/Recipe.js");
const Recurrence = require("../../models/Recurrence.js");
const Shelf = require("../../models/Shelf.js");
const Shopping = require("../../models/Shopping.js");
const Shop = require("../../models/Shop.js");
const Tag = require("../../models/Tag.js");
const Transaction = require("../../models/Transaction.js");
const Trash = require("../../models/Trash.js");
const User = require("../../models/User.js");

module.exports = adminGetDatabaseLoad = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.databaseload.success
  * admin.databaseload.error.oncount
  
  */

  if (process.env.DEBUG) {
    console.log("admin.databaseload");
  }
  
  let outcome = {
	  actions: { state: "pending", count: null, avsize: 276, totsize: 0, share: 0},
	  budgets: { state: "pending", count: null, avsize: 276, totsize: 0, share: 0},
	  categories: { state: "pending", count: null, avsize: 159, totsize: 0, share: 0},
	  coefficients: { state: "pending", count: null, avsize: 357, totsize: 0, share: 0},
	  communities: { state: "pending", count: null, avsize: 259, totsize: 0, share: 0},
	  recipes: { state: "pending", count: null, avsize: 716, totsize: 0, share: 0},
	  recurrences: { state: "pending", count: null, avsize: 262, totsize: 0, share: 0},
	  shelves: { state: "pending", count: null, avsize: 143, totsize: 0, share: 0},
	  shoppings: { state: "pending", count: null, avsize: 251, totsize: 0, share: 0},
	  shops: { state: "pending", count: null, avsize: 128, totsize: 0, share: 0},
	  tags: { state: "pending", count: null, avsize: 130, totsize: 0, share: 0},
	  transactions: { state: "pending", count: null, avsize: 385, totsize: 0, share: 0},
	  trashes: { state: "pending", count: null, avsize: 0, totsize: 0, share: 0},
	  users: { state: "pending", count: null, avsize: 263, totsize: 0, share: 0},
  }
  let totalsize = 0
  
  function updateObject (obj, count) {
	  outcome[obj].state = "done"
	  outcome[obj].count = count
	  outcome[obj].totsize = count * outcome[obj].avsize
    totalsize = totalsize + count * outcome[obj].avsize
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
    Budget.countDocuments()
      .then((count) => {
        updateObject("budgets", count)
      })
      .catch((error) => {
        console.log("budgets error", error);
        errorObject("budgets", error)
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
    Recipe.countDocuments()
      .then((count) => {
        updateObject("recipes", count)
      })
      .catch((error) => {
        errorObject("recipes", error)
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
    Shop.countDocuments()
      .then((count) => {
        updateObject("shops", count)
      })
      .catch((error) => {
        errorObject("shops", error)
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
    // Process counts
    Object.keys(outcome).forEach(obj => {
      if (outcome[obj].state === "done") {
        outcome[obj].share = outcome[obj].totsize / totalsize
      }
    })
    // response
	  console.log('counts outcome ', outcome);
	  res.status(200).json({
      type: "admin.databaseload.success",
      data: { 
        collections: outcome,
        database: {
          totsize: totalsize,
          share: totalsize / 512000000
        }
       },
    });
	}).catch((error) => {
	  console.log('counts error: ', error);
    res.status(400).json({
      type: "admin.databaseload.error.oncount",
      error: error,
    });
	});
};