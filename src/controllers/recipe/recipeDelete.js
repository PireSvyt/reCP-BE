require("dotenv").config();
const Recipe = require("../../models/Recipe.js");

module.exports = recipeDelete = (req, res, next) => {
/*

deletes an recipe

possible response types
- recipe.delete.success
- recipe.delete.error.ondeletegames
- recipe.delete.error.ondeleterecipe

*/

if (process.env.DEBUG) {
console.log("recipe.delete", req.params);
}

Recipe.deleteOne({ recipeid: req.params.recipeid, communityid: req.augmented.user.communityid })
.then((deleteOutcome) => {
if (
deleteOutcome.acknowledged === true &&
deleteOutcome.deletedCount === 1
) {
console.log("recipe.delete.success");
return res.status(200).json({
type: "recipe.delete.success",
data: {
outcome: deleteOutcome,
recipeid: req.params.recipeid,
},
});
} else {
console.log("recipe.delete.error.outcome");
return res.status(400).json({
type: "recipe.delete.error.outcome",
data: { outcome: deleteOutcome },
});
}
})
.catch((error) => {
console.log("recipe.delete.error.ondeleterecipe");
console.error(error);
return res.status(400).json({
type: "recipe.delete.error.ondeleterecipe",
error: error,
});
});
};