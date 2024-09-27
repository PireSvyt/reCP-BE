require("dotenv").config();
const Shelf = require("../../models/Shelf.js");

module.exports = shelfCreate = (req, res, next) => {
  /*
  
  create a shelf
  
  possible response types
  * shelf.create.success
  * shelf.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("shelf.create");
  }

  let shelfToSave = { ...req.body }
  shelfToSave.communityid = req.augmented.user.communityid
  shelfToSave = new Shelf(shelfToSave);

  // Save
  shelfToSave
    .save()
    .then(() => {
      console.log("shelf.create.success");
      return res.status(201).json({
        type: "shelf.create.success",
        data: {
          shelf: shelfToSave,
        },
      });
    })
    .catch((error) => {
      console.log("shelf.create.error");
      console.error(error);
      return res.status(400).json({
        type: "shelf.create.error",
        error: error,
        data: {
          shelfid: "",
        },
      });
    });
};
