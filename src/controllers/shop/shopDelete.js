require("dotenv").config();
const Shop = require("../../models/Shop.js");

module.exports = shopDelete = (req, res, next) => {
  /*
  
  deletes a shop
  
  possible response types
  * shop.delete.success
  * shop.delete.error.ondeletegames
  * shop.delete.error.ondeleteshop
  
  */

  if (process.env.DEBUG) {
    console.log("shop.delete", req.params);
  }

  Shop.deleteOne({ shopid: req.params.shopid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("shop.delete.success");
        return res.status(200).json({
          type: "shop.delete.success",
          data: { outcome: deleteOutcome, shopid: req.params.shopid },
        });
      } else {
        console.log("shop.delete.error.outcome");
        return res.status(400).json({
          type: "shop.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("shop.delete.error.ondeleteshop");
      console.error(error);
      return res.status(400).json({
        type: "shop.delete.error.ondeleteshop",
        error: error,
      });
    });
};