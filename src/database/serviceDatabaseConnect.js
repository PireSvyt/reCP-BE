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
  let key = Buffer.from("436981705942095511472630237914330321492832479872759374403818967252910181129099795680655721739838")
  const keyVaultNamespace = 'client.encryption';
  const kmsProviders = { local: { key } };
  mongoose.createConnection(DB_URL, {
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders
    }
  }).asPromise().then(conn => {
    console.log("connection created")
    new ClientEncryption(conn.client, {
      keyVaultNamespace,
      kmsProviders,
    }).then(encryption => {
      console.log("encryption created")
      encryption.createDataKey('local').then(_key => {
        console.log("_key created")
        mongoose
          .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoEncryption: {
              keyVaultNamespace,
              kmsProviders,
              schemaMap: {
                'mongoose_test.tests': {
                  bsonType: 'object',
                  encryptMetadata: {
                    keyId: [_key]
                  },
                  properties: {
                    pseudo: {
                      encrypt: {
                        bsonType: 'string',
                        algorithm: 'AES_256'
                      }
                    },
                    login: {
                      encrypt: {
                        bsonType: 'string',
                        algorithm: 'AES_256'
                      }
                    }
                  }
                }
              }
            }
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
          });
      })
    })
  })
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
      };
    });*/
};