require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Transaction = require("../../models/Transaction.js");

module.exports = transactionCreate = (req, res, next) => {
  /*
  
  create a transaction
  
  possible response types
  * transaction.create.success
  * transaction.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("transaction.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  const transactionToSave = new Transaction({ ...req.body });
  if (transactionToSave.author === undefined) {
    transactionToSave.author = decodedToken.userid;
  }
  
  // Save
  transactionToSave
    .save()
    .then(() => {
      console.log("transaction.create.success");
      return res.status(201).json({
        type: "transaction.create.success",
        data: {
          transactionid: transactionToSave.transactionid,
        },
      });
    })
    .catch((error) => {
      console.log("transaction.create.error");
      console.error(error);
      return res.status(400).json({
        type: "transaction.create.error",
        error: error,
        data: {
          transactionid: "",
        },
      });
    });
};