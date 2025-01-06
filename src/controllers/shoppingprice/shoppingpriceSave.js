require("dotenv").config();
const ShoppingPrice = require("../../models/ShoppingPrice.js");

module.exports = shoppingpriceSave = (req, res, next) => {
  /*
  
  saves a shopping price
  
  possible response types
  * shoppingprice.save.error.shoppingpriceid
  * shoppingprice.save.success.modified
  * shoppingprice.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("shoppingprice.save");
  }

  // Save
  if (
    req.body.shoppingpriceid === "" ||
    req.body.shoppingpriceid === undefined
  ) {
    console.log("shoppingprice.save.error.shoppingpriceid");
    return res.status(503).json({
      type: "shoppingprice.save.error.shoppingpriceid",
      error: error,
    });
  } else {
    // Modify
    let shoppingpriceToSave = { ...req.body };
    delete shoppingpriceToSave.communityid;

    // Save
    ShoppingPrice.updateOne(
      {
        shoppingpriceid: shoppingpriceToSave.shoppingpriceid,
        communityid: req.augmented.user.communityid,
      },
      shoppingpriceToSave
    )
      .then(() => {
        console.log("shoppingprice.save.success.modified");
        return res.status(200).json({
          type: "shoppingprice.save.success.modified",
          shoppingprice: shoppingpriceToSave,
        });
      })
      .catch((error) => {
        console.log("shoppingprice.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "shoppingprice.save.error.onmodify",
          error: error,
        });
      });
  }
};
