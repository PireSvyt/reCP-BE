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

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "shopping.updatemany.error.noneed";
  } else {
    switch (req.body.need) {
      case "available":
        filters = { shoppingid: { $in: req.body.shoppings } };
        changes = { available: req.body.newValue };
        break;
      default:
        status = 403;
        type = "shopping.updatemany.error.needmissmatch";
    }
  }

  // Update
  Shopping.updateMany(filters, changes)
    .then((outcome) => {
      if (outcome.nModified === req.body.shoppings.length) {
        console.log("shopping.updatemany.success");
        Shopping.find(filters)
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
