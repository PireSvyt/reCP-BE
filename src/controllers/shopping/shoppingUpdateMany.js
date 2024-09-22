require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingUpdateMany = (req, res, next) => {
  /*
  
  update shoppings
  
  possible response types
  * shopping.updatemany.success
  * shopping.updatemany.error
  
  possible edits
  * - available
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.updatemany");
  }

  // Initialize
  var status = 500;
  var type = "shopping.updatemany.error";
  var filters = {};
  var changes = {};
  var fields = ""

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "shopping.updatemany.error.noneed";
  } else {
    switch (req.body.need) {
      case "available":
        filters = { 
          shoppingid: { $in: req.body.shoppingids },
          communityid: req.augmented.user.communityid
        };
        fields = "shoppingid name shelfid unit quantity available";
        changes = { available: req.body.newValue };
        break;
      default:
        return res.status(403).json({
          type: "shopping.updatemany.needmissmatch",
          error: error,
          data: {
            outcome: null,
          },
        });
    }
  }

  // Update
  Shopping.updateMany(filters, changes)
    .then((outcome) => {
      if (outcome.nModified === req.body.shoppingids.length) {
        console.log("shopping.updatemany.success");
        Shopping.find(filters, fields)
          .then((shoppings) => {
            return res.status(201).json({
              type: "shopping.updatemany.success",
              data: {
                outcome: outcome,
                shoppings: shoppings,
              },
            });
          })
          .catch((error) => {
            console.log("shopping.updatemany.erroronfind");
            console.error(error);
            return res.status(400).json({
              type: "shopping.updatemany.erroronfind",
              error: error,
              data: {
                outcome: null,
              },
            });
          });
      } else {
        console.log("shopping.updatemany.partial");
        Shopping.find(filters)
          .then((shoppings) => {
            return res.status(201).json({
              type: "shopping.updatemany.partial",
              data: {
                outcome: outcome,
                shoppings: shoppings,
              },
            });
          })
          .catch((error) => {
            console.log("shopping.updatemany.erroronfind");
            console.error(error);
            return res.status(400).json({
              type: "shopping.updatemany.erroronfind",
              error: error,
              data: {
                outcome: null,
              },
            });
          });
      }
    })
    .catch((error) => {
      console.log("shopping.updatemany.error");
      console.error(error);
      return res.status(400).json({
        type: "shopping.updatemany.error",
        error: error,
        data: {
          outcome: null,
        },
      });
    });
};
