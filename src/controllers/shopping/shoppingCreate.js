require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingCreate = (req, res, next) => {
  /*
  
  create a shopping
  
  possible response types
  * shopping.create.success
  * shopping.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const shoppingToSave = new Shopping({ ...req.body });

  if (shoppingToSave.available === undefined) {
    shoppingToSave.available = false;
  }

  // Save
  shoppingToSave
    .save()
    .then(() => {
      console.log("shopping.create.success");
      return res.status(201).json({
        type: "shopping.create.success",
        data: {
          shoppingid: shoppingToSave.shoppingid,
        },
      });
    })
    .catch((error) => {
      console.log("shopping.create.error");
      console.error(error);
      return res.status(400).json({
        type: "shopping.create.error",
        error: error,
        data: {
          shoppingid: "",
        },
      });
    });
};
