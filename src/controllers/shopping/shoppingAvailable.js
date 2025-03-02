require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingAvailable = (req, res, next) => {
  /*
  
  update shoppings available
  
  possible response types
  * shopping.available.success
  * shopping.available.error
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.available");
  }

  // Update
  Shopping.find(
    {
      shoppingid: {
        $in: req.body.shoppings.map((shopping) => {
          return shopping.shoppingid;
        }),
      },
      communityid: req.augmented.user.communityid,
    },
    "shoppingid name shelfid unit need available done prices"
  )
    .then((shoppings) => {
      // Changes
      let bulkShoppings = [];
      let shoppingsToSend = [];
      shoppings.forEach((shopping) => {
        let newShopping = { ...shopping._doc };
        let changedShopping = req.body.shoppings.filter((shopping) => {
          return shopping.shoppingid === newShopping.shoppingid;
        })[0];
        if (changedShopping.done) {
          newShopping.done = false;
        } else {
          newShopping.need = 0;
          newShopping.done = true;
        }
        bulkShoppings.push({
          updateOne: {
            filter: { shoppingid: shopping.shoppingid },
            update: newShopping,
          },
        });
        shoppingsToSend.push(newShopping);
      });

      // Update
      Shopping.bulkWrite(bulkShoppings)
        .then((outcome) => {
          console.log("outcome", outcome);
          if (outcome.modifiedCount === bulkShoppings.length) {
            return res.status(201).json({
              type: "shopping.available.success",
              data: {
                outcome: outcome,
                shoppings: shoppingsToSend,
              },
            });
          } else {
            return res.status(202).json({
              type: "shopping.available.partial",
              data: {
                outcome: outcome,
                shoppings: shoppingsToSend,
              },
            });
          }
        })
        .catch((error) => {
          console.log("shopping.available.bulkwrite");
          console.error(error);
          return res.status(400).json({
            type: "shopping.available.bulkwrite",
            error: error,
            data: {
              outcome: null,
            },
          });
        });
    })
    .catch((error) => {
      console.log("shopping.available.error");
      console.error(error);
      return res.status(400).json({
        type: "shopping.available.error",
        error: error,
        data: {
          outcome: null,
        },
      });
    });
};
