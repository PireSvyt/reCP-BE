require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = communityGetMine = (req, res, next) => {
/*

sends back the community details and the member list

possible response types
- community.getmine.success
- community.getmine.error.onaggreate
- community.getmine.error.onfind

*/

if (process.env.DEBUG) {
console.log("community.getmine");
}

console.log("community.getmine");
console.log("req.augmented", req.augmented);

Community.aggregate([
{
$match: { communityid: req.augmented.user.communityid }
},
{
$lookup: {
from: "users",
foreignField: "communityid",
localField: "communityid",
as: "members",
pipeline: [
{
// recurrenceid name active recurrence reminder for suspendeddate enddate
$project: {
_id: 0,
communityid: 1,
userid: 1,
name: 1,
},
},
],
},
},
{
// actionid name duedate reminder done for recurrenceid
$project: {
_id: 0,
communityid: 1,
name: 1,
members: 1,
},
},
])
.then((communities) => {
if (communities.length === 1) {
// Response
    return res.status(200).json({
      type: "community.getmine.success",
      data: {
        community: communities[0]
      },
    });

} else {
console.log("community.getmine.error.onfind");
    return res.status(400).json({
      type: "community.getmine.error.onfind",
    });
}
})
  .catch((error) => {
    console.log("community.getmine.error.onaggreate");
    console.error(error);
    return res.status(400).json({
      type: "community.getmine.error.onaggreate",
      error: error,
      data: {
        community: undefined
      },
    });
  });
}