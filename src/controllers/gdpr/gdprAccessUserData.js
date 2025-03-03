require("dotenv").config();
const Action = require("../../models/Action.js");
const Budget = require("../../models/Budget.js");
const Category = require("../../models/Category.js");
const Coefficient = require("../../models/Coefficient.js");
const Recipe = require("../../models/Recipe.js");
const Recurrence = require("../../models/Recurrence.js");
const Setting = require("../../models/Setting.js");
const Shelf = require("../../models/Shelf.js");
const Shop = require("../../models/Shop.js");
const Shopping = require("../../models/Shopping.js");
const ShoppingPrice = require("../../models/ShoppingPrice.js");
const Tag = require("../../models/Tag.js");
const Transaction = require("../../models/Transaction.js");
const User = require("../../models/User.js");

module.exports = gdprAccessUserData = (req, res, next) => {
  /*
  
  sends back the user data
  
  possible response types
  * gdpr.accessuserdata.success
  * gdpr.accessuserdata.error
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.accessuserdata");
  }

  let userid = req.augmented.user.userid;

  let outcome = {
    user: { state: "pending", data: {} },
    budgets: { state: "pending", data: {} },
    categories: { state: "pending", data: {} },
    community: { state: "pending", data: {} },
    coefficients: { state: "pending", data: {} },
    recipes: { state: "pending", data: {} },
    settings: { state: "pending", data: {} },
    shelves: { state: "pending", data: {} },
    shops: { state: "pending", data: {} },
    shopings: { state: "pending", data: {} },
    shoppingprices: { state: "pending", data: {} },
    tags: { state: "pending", data: {} },
    transactions: { state: "pending", data: {} },
    recurrences: { state: "pending", data: {} },
    actions: { state: "pending", data: {} },
  };

  function updateObject(obj, data) {
    //console.log(obj + " data", data);
    outcome[obj].state = "done";
    outcome[obj].data = data;
  }
  function errorObject(obj, error) {
    console.log(obj + " error", error);
    outcome[obj].state = "error";
    outcome[obj].error = error;
  }

  Promise.all([
    Action.find({ $or: [{ doneby: userid }, { "for.userid": userid }] })
      .then((actions) => {
        updateObject("actions", actions);
      })
      .catch((error) => {
        errorObject(
          "actions",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Budget.find({ userid: userid })
      .then((budgets) => {
        updateObject("budgets", budgets);
      })
      .catch((error) => {
        errorObject(
          "budgets",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Category.find({ communityid: req.augmented.user.communityid })
      .then((categories) => {
        updateObject("categories", categories);
      })
      .catch((error) => {
        errorObject(
          "categories",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Coefficient.find({ "userratios.userid": userid })
      .then((coefficients) => {
        updateObject("coefficients", coefficients);
      })
      .catch((error) => {
        errorObject(
          "coefficients",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Recipe.find({ communityid: req.augmented.user.communityid })
      .then((recipes) => {
        updateObject("recipes", recipes);
      })
      .catch((error) => {
        errorObject(
          "recipes",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Recurrence.find({ "for.userid": userid })
      .then((recurrences) => {
        updateObject("recurrences", recurrences);
      })
      .catch((error) => {
        errorObject(
          "recurrences",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Setting.find({ userid: req.augmented.user.userid })
      .then((settings) => {
        updateObject("settings", settings);
      })
      .catch((error) => {
        errorObject(
          "settings",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Shelf.find({ communityid: req.augmented.user.communityid })
      .then((shelves) => {
        updateObject("shelves", shelves);
      })
      .catch((error) => {
        errorObject(
          "shelves",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Shop.find({ communityid: req.augmented.user.communityid })
      .then((shops) => {
        updateObject("shops", shops);
      })
      .catch((error) => {
        errorObject(
          "shops",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Shopping.find({ communityid: req.augmented.user.communityid })
      .then((shoppings) => {
        updateObject("shoppings", shoppings);
      })
      .catch((error) => {
        errorObject(
          "shoppings",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    ShoppingPrice.find({ communityid: req.augmented.user.communityid })
      .then((shoppingprices) => {
        updateObject("shoppingprices", shoppingprices);
      })
      .catch((error) => {
        errorObject(
          "shoppingprices",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Tag.find({ communityid: req.augmented.user.communityid })
      .then((tags) => {
        updateObject("tags", tags);
      })
      .catch((error) => {
        errorObject(
          "tags",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    Transaction.find({ $or: [{ by: userid }, { "for.userid": userid }] })
      .then((transactions) => {
        updateObject("transactions", transactions);
      })
      .catch((error) => {
        errorObject(
          "transactions",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
    User.aggregate([
      {
        $match: { userid: userid },
      },
      {
        $lookup: {
          from: "communities",
          foreignField: "communityid",
          localField: "communityid",
          as: "communities",
        },
      },
    ])
      .then((users) => {
        // User
        let decodedUser = { ...users[0] };
        /*decodedUser.login = CryptoJS.AES.decrypt(
		      decodedUser.login,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);    
		    decodedUser.name = CryptoJS.AES.decrypt(
		      decodedUser.name,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);*/
        // Communities
        let decodedCommunity = { ...decodedUser.communities[0] };
        /*decodedCommunity.name = CryptoJS.AES.decrypt(
		      decodedCommunity.name,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);*/
        updateObject("community", decodedCommunity);
        delete decodedUser.communities;
        updateObject("user", decodedUser);
      })
      .catch((error) => {
        errorObject(
          "user",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        errorObject(
          "community",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }),
  ])
    .then(() => {
      // response
      res.status(200).json({
        type: "gdpr.accessuserdata.success",
        //CryptoJS.AES.encrypt(
        data: JSON.stringify(outcome, null, 2),
        //  process.env.ENCRYPTION_KEY
        //).toString(CryptoJS.enc.Utf8),
      });
    })
    .catch((error) => {
      console.log("gdpr.accessuserdata.error");
      console.error(error);
      res.status(400).json({
        type: "gdpr.accessuserdata.error",
        error: error,
      });
    });
};
