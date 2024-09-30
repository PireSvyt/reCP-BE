require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userDelete = (req, res, next) => {
/*

Deletes a comunity

possible response types
- user.delete.success
- user.delete.error.ondelete

*/

if (process.env.DEBUG) {
console.log("user.delete", req.params);
}

User.deleteOne({ userid: req.params.userid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("user.delete.success");
return res.status(200).json({
type: "user.delete.success",
data: { outcome: deleteOutcome, userid: req.params.userid },
});
} else {
console.log("user.delete.error.outcome");
return res.status(400).json({
type: "user.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("user.delete.error.ondelete");
console.error(error);
return res.status(400).json({
type: "user.delete.error.ondelete",
error: error,
});
});
};