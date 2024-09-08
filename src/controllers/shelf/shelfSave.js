require("dotenv").config();
const jwt_decode = require("jwt-decode");
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

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

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

    // Save
    Shelf.updateOne(
      {
        shelfid: shelfToSave.shelfid,
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
