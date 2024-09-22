require("dotenv").config();
const Trash = require("../../models/Trash.js");

module.exports = trashDelete = (req, res, next) => {
/*

...

possible response types
- trash.delete.success
- trash.delete.error.ondelete

*/

if (process.env.DEBUG) {
console.log("trash.delete", req.params);
}

Trash.deleteOne({ trashid: req.params.trashid, communityid: req.augmented.user.communityid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("trash.delete.success");
return res.status(200).json({
type: "trash.delete.success",
data: { outcome: deleteOutcome, trashid: req.params.trashid },
});
} else {
console.log("trash.delete.error.outcome");
return res.status(400).json({
type: "trash.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("trash.delete.error.ondelete");
console.error(error);
return res.status(400).json({
type: "trash.delete.error.ondelete",
error: error,
});
});
};