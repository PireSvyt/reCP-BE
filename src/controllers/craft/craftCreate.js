require("dotenv").config();
const Craft = require("../../models/Craft.js");

module.exports = craftCreate = (req, res, next) => {
  /*
  
  create a craft
  
  possible response types
  * craft.create.success
  * craft.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("craft.create");
  }

  let craftToSave = { ...req.body };
  craftToSave = new Craft(craftToSave);

  // Save
  craftToSave
    .save()
    .then(() => {
      console.log("craft.create.success");
      return res.status(201).json({
        type: "craft.create.success",
        data: {
          craft: craftToSave,
        },
      });
    })
    .catch((error) => {
      console.log("craft.create.error");
      console.error(error);
      return res.status(400).json({
        type: "craft.create.error",
        error: error,
        data: {
          craftid: "",
        },
      });
    });
};
