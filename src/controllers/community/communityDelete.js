require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communityDelete = (req, res, next) => {
/*

Deletes a comunity

possible response types
- community.delete.success
- community.delete.error.ondelete

*/

if (process.env.DEBUG) {
console.log("community.delete", req.params);
}

Community.deleteOne({ communityid: req.params.communityid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("community.delete.success");
return res.status(200).json({
type: "community.delete.success",
data: { outcome: deleteOutcome, communityid: req.params.communityid },
});
} else {
console.log("community.delete.error.outcome");
return res.status(400).json({
type: "community.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("community.delete.error.ondelete");
console.error(error);
return res.status(400).json({
type: "community.delete.error.ondelete",
error: error,
});
});
};