require("dotenv").config();
const Shelf = require("../../models/Shelf.js");

module.exports = shelfSave = (req, res, next) => {
  /*
  
  saves a shelf
  
  possible response types
  * shelf.save.error.shelfid
  * shelf.save.success.modified
  * shelf.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("shelf.save");
  }

  // Save
  if (req.body.shelfid === "" || req.body.shelfid === undefined) {
    console.log("shelf.save.error.shelfid");
    return res.status(503).json({
      type: "shelf.save.error.shelfid",
      error: error,
    });
  } else {
    // Modify
    let shelfToSave = { ...req.body };
    shelfToSave.communityid = req.augmented.user.communityid

    // Save
    Shelf.updateOne(
      {
        shelfid: shelfToSave.shelfid,
        communityid: req.augmented.user.communityid 
      },
      shelfToSave
    )
      .then(() => {
        console.log("shelf.save.success.modified");
        return res.status(200).json({
          type: "shelf.save.success.modified",
          shelf: shelfToSave,
        });
      })
      .catch((error) => {
        console.log("shelf.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "shelf.save.error.onmodify",
          error: error,
        });
      });
  }
};
