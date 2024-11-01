require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingGetList = (req, res, next) => {
  /*
  
  sends back the shopping list
  
  possible response types
  * shopping.getlist.success
  * shopping.getlist.error.noneed
  * shopping.getlist.error.needmissmatch
  * shopping.getlist.error.onfind
  
  inputs
  * need
  * filters (optional)
  * - shelfs (shelfid)
  * - text

  */

  if (process.env.DEBUG) {
    console.log("shopping.getlist");
  }

  // Initialize
  var status = 500;
  var type = "shopping.getlist.error";
  var fields = "";
  var filters = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "shopping.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "shopping":
        fields = "shoppingid name shelfid unit need available done prices";
        break;
      case "prepping":
        fields = "shoppingid name shelfid unit need available done prices";
        break;
      default:
        status = 403;
        type = "shopping.getlist.error.needmissmatch";
    }
  }

  // Setting up filters
  if (req.body.need === "shopping") {
    filters.available = false;
  }
  if (req.body.filters !== undefined) {
    if (req.body.filters.shelfs !== undefined) {
      filters.shelfid = { $in: req.body.filters.shelfs };
    }
    if (req.body.filters.text !== undefined) {
      filters.name = new RegExp(req.body.filters.text, "i");
    }
  }

  // Is need well captured?
  if (status === 403) {
    res.status(status).json({
      type: type,
      data: {
        shoppings: [],
      },
    });
  } else {
    Shopping.find(filters, fields)
      .then((shoppings) => {
        // Response
        console.log("shopping.getlist.success");
        return res.status(200).json({
          type: "shopping.getlist.success",
          data: {
            shoppings: shoppings,
          },
        });
      })
      .catch((error) => {
        console.log("shopping.getlist.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "shopping.getlist.error.onfind",
          error: error,
          data: {
            shoppings: undefined,
          },
        });
      });
  }
};