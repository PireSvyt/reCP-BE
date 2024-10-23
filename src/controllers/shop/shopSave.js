require("dotenv").config();
const Shop = require("../../models/Shop.js");

module.exports = shopSave = (req, res, next) => {
  /*
  
  saves a shop
  
  possible response types
  * shop.save.error.shopid
  * shop.save.success.modified
  * shop.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("shop.save");
  }

  // Save
  if (req.body.shopid === "" || req.body.shopid === undefined) {
    console.log("shop.save.error.shopid");
    return res.status(503).json({
      type: "shop.save.error.shopid",
      error: error,
    });
  } else {
    // Modify
    let shopToSave = { ...req.body };
    shopToSave.communityid = req.augmented.user.communityid

    // Save
    Shop.updateOne(
      {
        shopid: shopToSave.shopid,
        communityid: req.augmented.user.communityid 
      },
      shopToSave
    )
      .then(() => {
        console.log("shop.save.success.modified");
        return res.status(200).json({
          type: "shop.save.success.modified",
          shop: shopToSave,
        });
      })
      .catch((error) => {
        console.log("shop.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "shop.save.error.onmodify",
          error: error,
        });
      });
  }
};