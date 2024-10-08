require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingDelete = (req, res, next) => {
  /*
  
  deletes a shopping
  
  possible response types
  * shopping.delete.success
  * shopping.delete.error.ondeletegames
  * shopping.delete.error.ondeleteshopping
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.delete", req.body);
  }

  Shopping.deleteOne({ shoppingid: req.params.shoppingid, communityid: req.augmented.user.communityid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("shopping.delete.success");
        return res.status(200).json({
          type: "shopping.delete.success",
          data: { outcome: deleteOutcome, shoppingid: req.params.shoppingid },
        });
      } else {
        console.log("shopping.delete.error.outcome");
        return res.status(400).json({
          type: "shopping.delete.error.outcome",
          data: { outcome: deleteOutcome },
        });
      }
    })
    .catch((error) => {
      console.log("shopping.delete.error.ondeleteshopping");
      console.error(error);
      return res.status(400).json({
        type: "shopping.delete.error.ondeleteshopping",
        error: error,
      });
    });
};
