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
  let key = process.env.ENCRYPTION_KEY
  const keyVaultNamespace = 'client.encryption';
  const kmsProviders = { local: { key } };
  mongoose.createConnection(DB_URL, {
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders
    }
  }).asPromise().then(conn => {
    new ClientEncryption(conn.client, {
      keyVaultNamespace,
      kmsProviders,
    }).then(encryption => {
      encryption.createDataKey('local').then(_key => {
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