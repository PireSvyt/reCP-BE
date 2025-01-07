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
  var filters = { communityid: req.augmented.user.communityid };

  // Is need input relevant?
  if (!req.body.need) {
    status = 403;
    type = "shopping.getlist.error.noneed";
  } else {
    switch (req.body.need) {
      case "shopping":
        break;
      case "prepping":
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
    Shopping.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "shoppingprices",
          foreignField: "shoppingid",
          localField: "shoppingid",
          as: "prices",
          pipeline: [
            {
              $project: {
                _id: 0,
                shoppingpriceid: 1,
                shopid: 1,
                quantity: 1,
                price: 1,
                unit: 1,
                date: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          shoppingid: 1,
          name: 1,
          unit: 1,
          need: 1,
          available: 1,
          done: 1,
          shelfid: 1,
          prices: 1,
        },
      },
    ])
      .then((shoppings) => {
        // Process prices
        let reducedShoppings = [];
        shoppings.forEach((shopping) => {
          let reducedShopping = { ...shopping };
          let reducedPrices = reducedShopping.prices.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          let uniquePrices = [];
          reducedPrices.forEach((reducedPrice) => {
            if (
              !uniquePrices
                .map((uniquePrice) => {
                  return uniquePrice.shopid;
                })
                .includes(reducedPrice.shopid)
            ) {
              uniquePrices.push(reducedPrice);
            }
          });
          reducedShopping.prices = uniquePrices;
          reducedShoppings.push(reducedShopping);
        });
        // Response
        console.log("shopping.getlist.success");
        return res.status(200).json({
          type: "shopping.getlist.success",
          data: {
            shoppings: reducedShoppings,
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
