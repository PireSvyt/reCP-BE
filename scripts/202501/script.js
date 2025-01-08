const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");
const random_string = require("../../src/utils/random_string.js");

const shoppingsOrigin = require("./origin/test.shoppings.json");

// Seggregation
let shoppingprices = [];

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");

  let migrations = [];

  migrations.push({
    name: "seggregating prices from shopping",
    collections: ["shoppings"],
    mapping: (item) => {
      let mappedItem = { ...item };

      if (mappedItem.prices !== undefined) {
        // Extract price
        mappedItem.prices.forEach((price) => {
          let mappedprice = { ...price };
          delete mappedprice._id;
          mappedprice.date = mappedprice.date.$date;
          mappedprice.communityid = mappedItem.communityid;
          mappedprice.shoppingid = mappedItem.shoppingid;
          mappedprice.shoppingpriceid = random_string(24);
          mappedprice.quantity = Number(mappedprice.quantity);
          shoppingprices.push(mappedprice);
        });

        delete mappedItem.prices;
      }

      // Return
      return mappedItem;
    },
  });

  // MAPPING ----------------------------------------------------------------------------------------------------------
  console.log("\n> MAPPING" + "\n");
  applyMigrations(migrations);

  // SEGGREGATION
  state.destination.shoppingprices = [...shoppingprices];

  // DESTINATION EXPORT -----------------------------------------------------------------------------------------------
  console.log("\n> DESTINATION EXPORT" + "\n");
  exportCollections();

  console.log("\nSCRIPT END");
}

let state = {
  collections: ["shoppings", "shoppingprices"],
  origin: {
    shoppings: shoppingsOrigin,
  },
  destination: {
    shoppings: [],
    shoppingprices: [],
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
