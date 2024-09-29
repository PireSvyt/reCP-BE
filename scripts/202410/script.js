const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");
const CryptoJS = require("crypto-js");

const usersOrigin = require("./origin/test.users.json");

const inputs = require("./inputs.json");

let migrations = [];

migrations.push({
  name: "encryption users",
  collections: ["users"],
  mapping: async (item) => {
    return await new Promise ((resolve, reject) => {

      let mappedItem = { ...item };
      console.log("userid", mappedItem.userid)

      // Mapping
      delete mappedItem.__v;
      delete mappedItem.login;
      delete mappedItem.name;

      /*  0. add a schema reference to original data */
      mappedItem.schema = "202410";

      /*  1. encrypt login and name for all items */
      mappedItem.state = "active"
      let encryptedLogin = CryptoJS.AES.encrypt(
        item.login,
        inputs.ENCRYPTION_KEY
      )
      console.log("encryptedLogin", encryptedLogin.toString(CryptoJS.enc.Utf8))
      mappedItem.login = encryptedLogin.toString(CryptoJS.enc.Utf8)
      encryptedName = CryptoJS.AES.encrypt(
        item.name,
        inputs.ENCRYPTION_KEY
      )
      console.log("encryptedName", encryptedName.toString(CryptoJS.enc.Utf8))
      mappedItem.name = encryptedName.toString(CryptoJS.enc.Utf8)

      // Return
      //return mappedItem;
      resolve(mappedItem);
      
    })
  }
});


let state = {
  collections: ["users"],
  origin: {
    users: usersOrigin,
  },
  destination: {
    users: [],
  },
};



async function script() {
  // SCRIPT
  console.log("SCRIPT START");
  
  // MAPPING ----------------------------------------------------------------------------------------------------------
  console.log("\n> MAPPING" + "\n");
  let foo = await applyMigrations(migrations)
  
  // DESTINATION EXPORT -----------------------------------------------------------------------------------------------
  console.log("\n> DESTINATION EXPORT" + "\n");
  foo = await exportCollections()
  
  console.log("\nSCRIPT END");
   
}

async function exportCollections() {
  try {
    state.collections.forEach(async (collection) => {
      console.log("\n==> collection : " + collection);
      let collectionFileName = "destination." + collection + ".json";
      let collectionFileLoc = path.join(
        __dirname,
        "/destination/",
        collectionFileName
      );
      console.log("collectionFileLoc", collectionFileLoc);
      await fs.ensureFile(collectionFileLoc).catch((err) => console.log);
      let collectionStream = fs.createWriteStream(collectionFileLoc, {
        encoding: "binary",
        flags: "w",
      });
      let collectionBuffer = Buffer.from(
        JSON.stringify(state.destination[collection], undefined, 2)
      );
      collectionStream.write(
        collectionBuffer,
        "binary"
        //e=>console.log('script mapped object ' + fileName.split(".")[0] + ' in ' + objectFileName + '\n')
      );
    });
  } catch (error) {
    console.error(error);
    console.log("/!\\  exportCollections : ", error);
  }
}

async function applyMigrations(migrations) {
  state.collections.forEach(async (collection) => {
    console.log("\n==> collection : " + collection);
    if (state.origin[collection] !== undefined) {
      state.origin[collection].forEach(async (item) => {
        let migratedItem = { ...item };
        
        migrations.filter((migration) => {
          //console.log("migration", migration)
          return (
            migration.collections.filter((migrationCollection) => {
              return migrationCollection === collection;
            }).length > 0
          );
        }).forEach(async (migration) =>  {
          migration.mapping(migratedItem).then((newItem) => {
            // Adding destination collection
            state.destination[collection].push(newItem);
          })
        })
      });
    // Comparison
    /*console.log(
      "\n====> state.origin." + collection + "[0]" + "\n",
      state.origin[collection][0]
    );*/
    console.log(
      "\n====> state.destination." + collection + "[0]" + "\n",
      state.destination[collection][0]
    );
    }
  });
}

script();