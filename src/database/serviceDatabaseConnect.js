require("dotenv").config();
const mongoose = require("mongoose");
const { ClientEncryption } = require('mongodb-client-encryption');
const { Binary } = require('mongodb');

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

  // Generate encryption key
  const arr = [];
  for (let i = 0; i < 96; ++i) {
    arr.push(i);
  }
  const key = Buffer.from(arr);

  const keyVaultNamespace = 'client.encryption';
  const kmsProviders = { local: { key } };

  const conn = await mongoose.createConnection(DB_URL, {
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders
    }
  }).asPromise();
  console.log("conn", conn)
  const encryption = new ClientEncryption(conn.client, {
    keyVaultNamespace,
    kmsProviders,
  });
  console.log("encryption", encryption)

  const _key = await encryption.createDataKey('local');
  console.log("_key", _key)
  /*
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
      };*/
  });
};