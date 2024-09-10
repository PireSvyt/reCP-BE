require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingGetOne = (req, res, next) => {
  /*
  
  sends back the shopping value
  
  possible response types
  * shopping.get.success
  * shopping.get.error.notfound
  * shopping.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.getone");
  }

  Shopping.findOne(
    {
      shoppingid: req.params.shoppingid,
    },
    "shoppingid name shelfid unit quantity available"
  )
    .then((shopping) => {
      if (shopping !== undefined) {
        console.log("shopping.get.success");
        console.log("shopping", shopping);
        // Response
        return res.status(200).json({
          type: "shopping.get.success",
          data: {
            shopping: shopping,
          },
        });
      } else {
        console.log("shopping.get.error.undefined");
        return res.status(101).json({
          type: "shopping.get.error.undefined",
          data: {
            shopping: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("shopping.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "shopping.get.error.onfind",
        error: error,
        data: {
          shopping: undefined,
        },
      });
    });
};
