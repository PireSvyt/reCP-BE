require("dotenv").config();
const Shopping = require("../../models/Shopping.js");
const convert = require("../../utils/convert.js");

module.exports = shoppingInflation = (req, res, next) => {
  /*
  
  sends back the shopping inflation
  
  possible response types
  * shopping.inflation.success
  * shopping.inflation.error.noneed
  * shopping.inflation.error.needmissmatch
  * shopping.inflation.error.onfind
  
  inputs
  * shoppingid

  */

  if (process.env.DEBUG) {
    console.log("shopping.inflation");
  }

  Shopping.aggregate([
    {
      $match: {
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
        available: 1,
        done: 1,
        shelfid: 1,
        prices: 1,
      },
    },
  ])
    .then((shoppings) => {
      let inflations = [];
      shoppings.forEach((shopping) => {
        if (shopping.prices !== undefined) {
          // Build shops
          let shops = {};
          shopping.prices.forEach((price) => {
            if (!Object.keys(shops).includes(price.shopid)) {
              shops[price.shopid] = [price];
            } else {
              shops[price.shopid].push(price);
            }
          });
          // Remove unrelevant shops
          Object.keys(shops).forEach((shop) => {
            if (shops[shop].length <= 1) {
              delete shops[shop];
            } else {
              // Sort prices of that shop
              let inflation = computeInflation(
                shops[shop].sort((a, b) => {
                  return new Date(a.date) - new Date(b.date);
                })
              );
              inflation.shopid = shop;
              inflation.shoppingid = shopping.shoppingid;
              inflation.shelfid = shopping.shelfid;
              inflations.push(inflation);
            }
          });
        }
      });

      // Process inflations
      let processedInflations = processInflations(inflations);

      // Response
      console.log("shopping.inflation.success");
      return res.status(200).json({
        type: "shopping.inflation.success",
        data: {
          inflations: inflations,
          processing: processedInflations,
        },
      });
    })
    .catch((error) => {
      console.log("shopping.inflation.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "shopping.inflation.error.onfind",
        error: error,
      });
    });
};

function processInflations(inflationList) {
  let averageInflationRate;

  if (inflationList.length !== 0) {
    averageInflationRate =
      inflationList
        .map((inflation) => {
          return inflation.regression.slope;
        })
        .reduce((partialSum, a) => partialSum + a, 0) / inflationList.length;
  } else {
    averageInflationRate = 0;
  }

  return {
    average: averageInflationRate,
  };
}

function computeInflation(priceList) {
  // Normalize prices in same unit / quantity referential
  let convertedPriceList = priceList.map((price) => {
    let newPrice = { ...price };
    newPrice.normalizedPrice =
      (price.price * priceList[0].quantity) /
      (convert(price.quantity, price.unit, priceList[0].unit) *
        priceList[0].price);
    return newPrice;
  });

  // Compute linearRegression
  function toYear(date) {
    return Date.parse(date) / (1000 * 3600 * 24 * 365) + 1970; //for a rate in year
  }
  let regression = linearRegression(
    convertedPriceList.map((price) => {
      return price.normalizedPrice;
    }),
    convertedPriceList.map((price) => {
      return toYear(price.date);
    })
  );

  // Offset normalized prices
  let nowDate = new Date();
  let aYearAgo = new Date(
    nowDate.getFullYear() - 1,
    nowDate.getMonth(),
    nowDate.getDate()
  );
  let offset = 1 - regression.intercept - regression.slope * toYear(aYearAgo);
  let curve = { x: [], y: [] };
  convertedPriceList.forEach((price) => {
    curve.x.push(price.date);
    curve.y.push(price.normalizedPrice + offset);
  });

  // Outcome
  return {
    curve: curve,
    regression: regression,
  };
}

function linearRegression(y, x) {
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
    sum_yy += y[i] * y[i];
  }

  lr["slope"] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  lr["intercept"] = (sum_y - lr.slope * sum_x) / n;
  lr["r2"] = Math.pow(
    (n * sum_xy - sum_x * sum_y) /
      Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
    2
  );

  return lr;
}
