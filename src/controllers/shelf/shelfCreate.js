require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Shelf = require("../../models/Shelf.js");

module.exports = shelfCreate = (req, res, next) => {
  /*
  
  create a shelf
  
  possible response types
  * shelf.create.success
  * shelf.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("shelf.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const shelfToSave = new Shelf({ ...req.body });
  
  // Save
  shelfToSave
    .save()
    .then(() => {
      console.log("shelf.create.success");
      return res.status(201).json({
        type: "shelf.create.success",
        data: {
          shelfid: shelfToSave.shelfid,
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