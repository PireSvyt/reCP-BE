require("dotenv").config();
const Shop = require("../../models/Shop.js");

module.exports = shopCreate = (req, res, next) => {
  /*
  
  create a shop
  
  possible response types
  * shop.create.success
  * shop.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("shop.create");
  }

  let shopToSave = { ...req.body }
  shopToSave.communityid = req.augmented.user.communityid
  shopToSave = new Shop(shopToSave);

  // Save
  shopToSave
    .save()
    .then(() => {
      console.log("shop.create.success");
      return res.status(201).json({
        type: "shop.create.success",
        data: {
          shop: shopToSave,
        },
      });
    })
    .catch((error) => {
      console.log("shop.create.error");
      console.error(error);
      return res.status(400).json({
        type: "shop.create.error",
        error: error,
        data: {
          shopid: "",
        },
      });
    });
};