require("dotenv").config();
const Craft = require("../../models/Craft.js");

module.exports = craftGetList = (req, res, next) => {
  /*
  
  sends back the list of crafts
  
  possible response types
  * craft.getlist.success
  * craft.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("craft.getlist");
  }

  // Setting up filters
  var filters = {};
  if (req.body.level !== undefined) {
    filters.level = { $gte: req.body.level };
  }

  Craft.find(filters)
    .then((crafts) => {
      return res.status(200).json({
        type: "craft.getlist.success",
        data: {
          crafts: crafts,
        },
      });
    })
    .catch((error) => {
      console.log("craft.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "craft.getlist.error.onfind",
        error: error,
        data: {
          crafts: undefined,
        },
      });
    });
};
