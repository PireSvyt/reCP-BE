const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");

const shoppingsOrigin = require("./origin/test.shoppings.json");

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");

  let migrations = [];

  migrations.push({
    name: "removale of available",
    collections: ["shoppings"],
    mapping: (item) => {
      let mappedItem = { ...item };

      delete mappedItem.available;
      if (mappedItem.done) {
        delete mappedItem.need;
      }

      // Return
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
  collections: ["shoppings"],
  origin: {
    shoppings: shoppingsOrigin,
  },
  destination: {
    shoppings: [],
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
