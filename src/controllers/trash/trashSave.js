require("dotenv").config();
const Trash = require("../../models/Trash.js");

module.exports = trashSave = (req, res, next) => {
/*

saves a trash

possible response types
- trash.save.error.shelfid
- trash.save.success.modified
- trash.save.error.onmodify

*/

if (process.env.DEBUG) {
console.log("trash.save");
}

// Save
if (req.body.trashid === "" || req.body.trashid === undefined) {
console.log("trash.save.error.trashid");
return res.status(503).json({
type: "trash.save.error.trashid",
error: error,
});
} else {
// Modify
let trashToSave = { ...req.body };
delete trashToSave.communityid

// Save
Trash.updateOne(
  {
    trashid: trashToSave.trashid,
    communityid: req.augmented.user.communityid
  },
  trashToSave
)
  .then(() => {
    console.log("trash.save.success.modified");
    return res.status(200).json({
      type: "trash.save.success.modified",
      shelf: trashToSave,
    });
  })
  .catch((error) => {
    console.log("trash.save.error.onmodify");
    console.error(error);
    return res.status(400).json({
      type: "trash.save.error.onmodify",
      error: error,
    });
  });
}
};