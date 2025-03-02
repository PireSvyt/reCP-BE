require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingGetPrices = (req, res, next) => {
  /*
  
  sends back the shopping prices list
  
  possible response types
  * shopping.getprices.success
  * shopping.getprices.error.noneed
  * shopping.getprices.error.needmissmatch
  * shopping.getprices.error.onfind
  
  inputs
  * shoppingid

  */

  if (process.env.DEBUG) {
    console.log("shopping.getprices");
  }

  Shopping.aggregate([
    {
      $match: {
        shoppingid: req.params.shoppingid,
        communityid: req.augmented.user.communityid,
      },
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
        done: 1,
        shelfid: 1,
        prices: 1,
      },
    },
  ])
    .then((shoppings) => {
      if (shoppings.length !== 1) {
        console.log("shopping.getprices.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "shopping.getprices.error.onfind",
          error: error,
        });
      } else {
        let prices = [...shoppings[0].prices];
        prices = prices.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        // Response
        console.log("shopping.getprices.success");
        return res.status(200).json({
          type: "shopping.getprices.success",
          data: {
            prices: prices,
          },
        });
      }
    })
    .catch((error) => {
      console.log("shopping.getprices.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "shopping.getprices.error.onfind",
        error: error,
      });
    });
};
