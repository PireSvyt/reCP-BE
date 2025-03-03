const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");

const budgetsOrigin = require("./origin/test.budgets.json");
const budgettargetsOrigin = require("./origin/test.budgettargets.json");

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");

  let migrations = [];

  migrations.push({
    name: "combination of budget and budget targets",
    collections: ["budgets"],
    mapping: (item) => {
      let mappedItem = { ...item };

      let budgettargets = [];

      let budgettargetcandidates = budgettargetsOrigin.filter(
        (budgettarget) => {
          return budgettarget.budgetid === mappedItem.budgetid;
        }
      );
      budgettargetcandidates.forEach((budgettargetcandidate) => {
        budgettargets.push({
          targetid: budgettargetcandidate.budgettargetid,
          startdate: budgettargetcandidate.startdate,
          enddate: budgettargetcandidate.enddate,
          target: budgettargetcandidate.target,
          audience: budgettargetcandidate.audience,
        });
      });

      mappedItem.targets = budgettargets;

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
  collections: ["budgets"],
  origin: {
    budgets: budgetsOrigin,
  },
  destination: {
    budgets: [],
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
