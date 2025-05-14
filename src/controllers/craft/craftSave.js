require("dotenv").config();
const Craft = require("../../models/Craft.js");

module.exports = craftSave = (req, res, next) => {
  /*
  
  saves a craft
  
  possible response types
  * craft.save.error.craftid
  * craft.save.success.modified
  * craft.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("craft.save");
  }

  // Save
  if (req.body.craftid === "" || req.body.craftid === undefined) {
    console.log("craft.save.error.craftid");
    return res.status(503).json({
      type: "craft.save.error.craftid",
      error: error,
    });
  } else {
    // Modify
    let craftToSave = { ...req.body };

    // Save
    Craft.updateOne(
      {
        craftid: craftToSave.craftid,
      },
      craftToSave
    )
      .then(() => {
        console.log("craft.save.success.modified");
        return res.status(200).json({
          type: "craft.save.success.modified",
          craft: craftToSave,
        });
      })
      .catch((error) => {
        console.log("craft.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "craft.save.error.onmodify",
          error: error,
        });
      });
  }
};
