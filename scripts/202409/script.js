const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");

const usersOrigin = require("./origin/test.users.json");
const transactionsOrigin = require("./origin/test.transactions.json");
const balancerulesOrigin = require("./origin/test.balancerules.json");
const categoriesOrigin = require("./origin/test.categories.json");
const tagsOrigin = require("./origin/test.tags.json");
const shelvesOrigin = require("./origin/test.shelves.json");
const shoppingsOrigin = require("./origin/test.shoppings.json");
const actionsOrigin = require("./origin/test.actions.json");
const recurrencesOrigin = require("./origin/test.recurrences.json");

async function script() {
// SCRIPT
console.log("SCRIPT START");

// MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
console.log("\n> MIGRATION DEFINITION" + "\n");

const aliceid = "66d6b3cc832ff2d479791825"
const pierreid = "66d5fa1c3d1f1248161b71ba"

let migrations = [];

migrations.push({
name: "communityids",
collections: ["users", "transactions", "balancerules", "categories", "tags", "shelves", "shoppings", "actions", "recurrences"],
mapping: (item) => {
let mappedItem = { ...item };
// Mapping
delete mappedItem.__v;

/*  0. add a schema reference to original data */
mappedItem.schema = "202409";

/*  1. add the communityid to all items */
mappedItem.communityid = "COMMUNITYID";
// Return
return mappedItem;
},
});

migrations.push({
name: "userids in ratios",
collections: ["balancerules"],
mapping: (item) => {
let mappedItem = { ...item };

/*  1. add the communityid to all items */
let ratios = mappedItem.ratios
let newRatios = []
ratios.forEach(r => {
newRatios.push({
userid: r.user,
ratio: r.ratio
})
})
mappedItem.ratios = newRatios

// Return
return mappedItem;
},
});

migrations.push({
name: "userids in by and for",
collections: ["transactions"],
mapping: (item) => {
let mappedItem = { ...item };

/*  1. adapt the for to user ids */
let fors = mappedItem.for
let newFors = []
fors.forEach(r => {
    if (r === "Alice") {
        newFors.push(aliceid)
    }
    if (r === "Alice") {
        newFors.push(pierreid)
    }
})
mappedItem.for = newFors

/*  2. adapt the by to user ids */
if (mappedItem.by === "Alice") {
    mappedItem.by = aliceid
}
if (mappedItem.by === "Alice") {
    mappedItem.by = pierreid
}

// Return
return mappedItem;
},
});

migrations.push({
name: "userids in for",
collections: ["actions", "recurrences"],
mapping: (item) => {
let mappedItem = { ...item };

/*  1. adapt the for to user ids */
let fors = mappedItem.for
let newFors = []
fors.forEach(r => {
    if (r === "Alice") {
        newFors.push(aliceid)
    }
    if (r === "Alice") {
        newFors.push(pierreid)
    }
})
mappedItem.for = newFors

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
collections: ["users", "transactions", "balancerules", "categories", "tags", "shelves", "shoppings", "actions", "recurrences"],
origin: {
users: usersOrigin,
transactions: transactionsOrigin,
balancerules: balancerulesOrigin,
categories: categoriesOrigin,
tags: tagsOrigin,
shelves: shelvesOrigin,
shoppings: shoppingsOrigin,
actions: actionsOrigin,
recurrences: recurrencesOrigin,
},
destination: {
users: [],
transactions: [],
balancerules: [],
categories: [],
tags: [],
shelves: [],
shoppings: [],
actions: [],
recurrences: [],
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