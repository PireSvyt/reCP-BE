require("dotenv").config();
const Trash = require("../../models/Trash.js");

module.exports = trashCreate = (req, res, next) => {
/*

create a trash

possible response types
- trash.create.success
- trash.create.error

*/

if (process.env.DEBUG) {
console.log("trash.create");
}

let trashToSave = { ...req.body }
trashToSave.communityid = req.augmented.user.communityid
trashToSave = new Trash({ ...req.body });

// Save
trashToSave
.save()
.then(() => {
console.log("trash.create.success");
return res.status(201).json({
type: "trash.create.success",
data: {
trash: trashToSave,
},
});
})
.catch((error) => {
console.log("trash.create.error");
console.error(error);
return res.status(400).json({
type: "trash.create.error",
error: error,
data: {
trash: null,
},
});
});
}