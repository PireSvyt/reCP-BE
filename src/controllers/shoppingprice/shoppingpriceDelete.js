require("dotenv").config();
const ShoppingPrice = require("../../models/ShoppingPrice.js");

module.exports = shoppingpriceDelete = (req, res, next) => {
  /*
  
  deletes a shopping price
  
  possible response types
  * shoppingprice.delete.success
  * shoppingprice.delete.error.ondeletegames
  * shoppingprice.delete.error.ondeleteshoppingprice
  
  */

  if (process.env.DEBUG) {
    console.log("shoppingprice.delete", req.body);
  }

  ShoppingPrice.deleteOne({
    shoppingpriceid: req.params.shoppingpriceid,
    communityid: req.augmented.user.communityid,
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("shoppingprice.delete.success");
        return res.status(200).json({
          type: "shoppingprice.delete.success",
          data: {
            outcome: deleteOutcome,
            shoppingpriceid: req.params.shoppingpriceid,
          },
        });
      } else {
        console.log("shoppingprice.delete.error.outcome");
        return res.status(400).json({
          type: "shoppingprice.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("shoppingprice.delete.error.ondeleteshoppingprice");
      console.error(error);
      return res.status(400).json({
        type: "shoppingprice.delete.error.ondeleteshoppingprice",
        error: error,
      });
    });
};
