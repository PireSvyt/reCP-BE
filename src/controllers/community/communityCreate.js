require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communityCreate = (req, res, next) => {
/*

create a community

possible response types
- community.create.success
- community.create.error

*/

if (process.env.DEBUG) {
console.log("community.create");
}

const communityToSave = new Community({ ...req.body });

// Save
communityToSave
.save()
.then(() => {
console.log("community.create.success");
return res.status(201).json({
type: "community.create.success",
data: {
community: communityToSave,
},
});
})
.catch((error) => {
console.log("community.create.error");
console.error(error);
return res.status(400).json({
type: "community.create.error",
error: error,
data: {
community: undefined,
},
});
});
};