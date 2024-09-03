const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");

const categoryOrigin = require("./origin/myFirstDatabase.categorytransactions.json");
const transactionOrigin = require("./origin/myFirstDatabase.transactions.json");

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");

  let migrations = [];

  /*  0. add a schema reference to original data
          - schema : "original" as tag would be enough
  */

  // Users
  migrations.push({
    name: "original",
    collections: ["categorys", "transactions"],
    mapping: (item) => {
      let mappedItem = { ...item };
      // Mapping
      delete mappedItem.__v;
      // Return
      mappedItem.schema = "original";
      return mappedItem;
    },
  });

  /*  1. the mapping of existing ids to ITEMIDs
          - the creation of ITEMID for all items
          - the update of existing reference id to ITEMID
          - schema : "itemids"
  */

  // Categories
  migrations.push({
    name: "itemids",
    collections: ["categorys"],
    mapping: (item) => {
      let mappedItem = { ...item };
      // Mapping
      if (mappedItem.categoryid === undefined) {
        mappedItem.categoryid = mappedItem._id.$oid;
      }
      // Return
      mappedItem.schema = "itemids";
      return mappedItem;
    },
  });

  // Transactions
  migrations.push({
    name: "itemids",
    collections: ["transactions"],
    mapping: (item) => {
      let mappedItem = { ...item };
      // Mapping
      if (mappedItem.transactionid === undefined) {
        mappedItem.transactionid = mappedItem._id.$oid;
      }
      if (mappedItem.author === undefined) {
        if (mappedItem.by === "Alice") {
          mappedItem.author = "66d6b3cc832ff2d479791825";
        }
        if (mappedItem.by === "Pierre") {
          mappedItem.author = "66d5fdc33d1f1248161b71bb";
        }
      }
      if (mappedItem.categoryid === undefined) {
        mappedItem.categoryid = mappedItem.category;
      }
      delete mappedItem.id;
      delete mappedItem.category;
      // Return
      mappedItem.schema = "itemids";
      return mappedItem;
    },
  });

  // MAPPING ----------------------------------------------------------------------------------------------------------
  console.log("\n> MAPPING" + "\n");
  applyMigrations(migrations);

  // DESTINATION EXPORT -----------------------------------------------------------------------------------------------
  console.log("\n> DESTINATION EXPORT" + "\n");
  exportCollections();

  console.log("\nSCRIPT END");
}

let state = {
  collections: ["categorys", "transactions"],
  origin: {
    categorys: categoryOrigin,
    transactions: transactionOrigin,
  },
  destination: {
    categorys: [],
    transactions: [],
  },
};
script();

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
  state.collections.forEach((collection) => {
    console.log("\n==> collection : " + collection);
    if (state.origin[collection] !== undefined) {
      state.origin[collection].forEach((item) => {
        let migratedItem = { ...item };
        migrations
          .filter((migration) => {
            //console.log("migration", migration)
            return (
              migration.collections.filter((migrationCollection) => {
                return migrationCollection === collection;
              }).length > 0
            );
          })
          .forEach((migration) => {
            //console.log("    migration : " + migration.name);
            migratedItem = migration.mapping(migratedItem);
          });
        // Adding destination collection
        state.destination[collection].push(migratedItem);
      });
      // Comparison
      console.log(
        "\n====> state.origin." + collection + "[0]" + "\n",
        state.origin[collection][0]
      );
      console.log(
        "\n====> state.destination." + collection + "[0]" + "\n",
        state.destination[collection][0]
      );
    }
  });
}
