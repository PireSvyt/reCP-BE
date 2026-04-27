const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");
const { MongoClient } = require("mongodb");

const addressesOrigin = require("./origin/mapstr.json");
const random_string = require("../../src/utils/random_string");

let tags = {};

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");

  let migrations = [];

  migrations.push({
    name: "import address from mapstr",
    collections: ["addresses"],
    mapping: (item) => {
      let mappedItem = {
        schema: "20260427",
        addressid: random_string(12),
        communityid: "66eff95915e7a3fc0dfc9d84",
        name: item.properties.name,
        address: item.properties.address,
        coordinates: item.geometry.coordinates,
        visited: false,
        icon: item.properties.icon,
        comments: item.properties.userComment,
        tagids: [],
      };

      item.properties.tags.forEach((tag) => {
        if (tag.name == "To Try") {
          mappedItem.visited = true;
        } else {
          if (!Object.keys(tags).includes(tag.name)) {
            tags[tag.name] = random_string(12);
          }
          mappedItem.tagids.push({ tagid: tags[tag.name] });
        }
      });

      // Return
      return mappedItem;
    },
  });

  // MAPPING ----------------------------------------------------------------------------------------------------------
  console.log("\n> MAPPING" + "\n");
  applyMigrations(migrations);

  // MISCELANEOUS -----------------------------------------------------------------------------------------------------
  Object.keys(tags).forEach((tag) => {
    state.destination.tags.push({
      schema: "20260427",
      tagid: tags[tag],
      communityid: "66eff95915e7a3fc0dfc9d84",
      name: tag,
      type: "mapster",
    });
  });

  console.log("addresses ", state.destination.addresses.length);
  console.log("tags ", state.destination.tags.length);

  // DESTINATION EXPORT -----------------------------------------------------------------------------------------------
  console.log("\n> DESTINATION EXPORT" + "\n");
  exportCollections();

  console.log("\nSCRIPT END");
}

let state = {
  collections: ["addresses", "tags"],
  origin: {
    addresses: addressesOrigin,
  },
  destination: {
    addresses: [],
    tags: [],
  },
};
script();

/*async function exportCollections() {
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
  }*/

async function exportCollections() {
  try {
    // Utilisation de for...of pour attendre chaque étape
    for (const collection of state.collections) {
      console.log(`\n==> Exportation de la collection : ${collection}`);

      const collectionFileName = `destination.${collection}.json`;
      const collectionFileLoc = path.join(
        __dirname,
        "destination",
        collectionFileName
      );

      // Assure que le dossier existe
      await fs.ensureDir(path.join(__dirname, "destination"));

      const dataString = JSON.stringify(state.destination[collection], null, 2);

      // Ecriture directe (attend la fin avant de passer à la suivante)
      await fs.writeFile(collectionFileLoc, dataString, "utf8");

      console.log(`✅ Fichier exporté : ${collectionFileLoc}`);
    }

    console.log("\n✨ Export terminé avec succès !");
  } catch (error) {
    console.error("/!\\ Erreur exportCollections : ", error);
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
