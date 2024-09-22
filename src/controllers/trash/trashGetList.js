require("dotenv").config();
const Trash = require("../../models/Trash.js");

module.exports = trashGetList = (req, res, next) => {
/*

sends back the list of trashes

possible response types

- trash.getlist.success
- trash.getlist.error.onfind
*/

if (process.env.DEBUG) {
console.log("trash.getlist");
}

Trash.find({communityid: req.augmented.user.communityid}, "trashid colorname day slot")
.then((trashes) => {
return res.status(200).json({
type: "trash.getlist.success",
data: {
trashes: trashes,
},
});
})
.catch((error) => {
console.log("trash.getlist.error.onfind");
console.error(error);
return res.status(400).json({
type: "trash.getlist.error.onfind",
error: error,
data: {
trashes: undefined,
},
});
});
};