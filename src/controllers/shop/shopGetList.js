require("dotenv").config();
const Shop = require("../../models/Shop.js");

module.exports = shopGetList = (req, res, next) => {
  /*
  
  sends back the list of shops
  
  possible response types
  * shop.getlist.success
  * shop.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("shop.getlist");
  }

  Shop.find({ communityid: req.augmented.user.communityid },
     "shopid name")
    .then((shops) => {
      return res.status(200).json({
        type: "shop.getlist.success",
        data: {
          shops: shops,
        },
      });
    })
    .catch((error) => {
      console.log("shop.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "shop.getlist.error.onfind",
        error: error
      });
    });
};