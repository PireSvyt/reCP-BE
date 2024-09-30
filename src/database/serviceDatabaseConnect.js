require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async function serviceConnectMongoDB() {
  /*
  
  connects the mongo database
  
  possible response types
  * database.connectmongodb.success
  * database.connectmongodb.error
  
  */

  if (process.env.DEBUG) {
    console.log("database.connectMongoDB");
  }

  let DB_URL =
    "mongodb+srv://" +
    process.env.DB_PW +
    "@" +
    process.env.DB_CLUSTER +
    "?retryWrites=true&w=majority&appName=" + 
    process.env.DB_APPNAME;
    
  // Connect
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connexion à MongoDB réussie");
      return {
        type: "database.connectmongodb.success",
      };
    })
    .catch((err) => {
      console.log("Connexion à MongoDB échouée");
      console.log(err);
      return {
        type: "database.connectmongodb.error",
        error: err,
      };
    })
};