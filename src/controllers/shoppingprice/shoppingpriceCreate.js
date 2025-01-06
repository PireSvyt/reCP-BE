require("dotenv").config();
const ShoppingPrice = require("../../models/ShoppingPrice.js");

module.exports = shoppingpriceCreate = (req, res, next) => {
  /*
  
  create a shopping price
  
  possible response types
  * shoppingprice.create.success
  * shoppingprice.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("shoppingprice.create");
  }

  let shoppingpriceToSave = { ...req.body };
  shoppingpriceToSave.communityid = req.augmented.user.communityid;
  shoppingpriceToSave = new ShoppingPrice(shoppingpriceToSave);

  // Save
  shoppingpriceToSave
    .save()
    .then(() => {
      console.log("shoppingprice.create.success");
      return res.status(201).json({
        type: "shoppingprice.create.success",
        data: {
          shoppingprice: shoppingpriceToSave,
        },
      });
    })
    .catch((error) => {
      console.log("shoppingprice.create.error");
      console.error(error);
      return res.status(400).json({
        type: "shoppingprice.create.error",
        error: error,
      });
    });
};
