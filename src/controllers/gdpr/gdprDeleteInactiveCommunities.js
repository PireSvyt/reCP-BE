require("dotenv").config();
const Community = require("../../models/Community.js");
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");

module.exports = gdprDeleteInactiveCommunities = (req, res, next) => {
  /*
  
  deletes communities where there are no active users
  
  possible response types
  * gdpr.deletecommunities.success
  * gdpr.deletecommunities.error.onfind
  * gdpr.deletecommunities.error.ondeletecommunities
  * gdpr.deletecommunities.error.onupdateusers
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.anonymiseusers");
  }

  Community.aggregate([
		{
			$lookup: {
				from: "users",
				foreignField: "userid",
				localField: "members.userid",
				as: "augmentingMembers",
				pipeline: [
					{
						$project: {
							_id: 0,
							userid: 1,
							state: 1
						},
					},
				],
			},
		},
		{
			$project: {
				_id: 0,
				communityid: 1,
				members: 1,
				augmentingMembers: 1,
				deleterequests: 1,
			},
		},
	])
    .then((communities) => {
	    let communitiesToDelete = []
	    communities.forEach(community => {
		    let communityToDelete = true
			if (community.members !== undefined) {
				community.members.forEach(member => {
					if (community.augmentingMembers.filter(am => {return am.userid === member.userid})[0].state === "active") {
						if (community.deleterequests === undefined) {
							communityToDelete = false
						} else {
							if (community.deleterequests.filter(dr => {return dr.userid === member.userid}).length === 0 ) {
								communityToDelete = false
							}
						}
					}
				})
			}
		    if (communityToDelete) {
			    communitiesToDelete.push(community.communityid)
		    }
	    })
		if (communitiesToDelete.length > 0) {
			Community.deleteMany(
				{ communityid: { "$in" : communitiesToDelete } }
			).then(communityoutcome => {
				User.updateMany(
					{ communityid : { "$in" : communitiesToDelete } },
					{ communityid: "NOCOMMUNITY+" + random_string(24)}
				).then(useroutcome => {
					console.log("gdpr.deletecommunities.success");
					res.status(200)
					res.json({
						type: "gdpr.deletecommunities.success",
						outcome: {
							communities: communityoutcome,
							users: useroutcome
						}
					});	
				})
				.catch((error) => {
					console.log("gdpr.deletecommunities.error.onupdateusers");
					console.error(error);
					res.status(400)
					res.json({
					type: "gdpr.deletecommunities.error.onupdateusers",
					error: error,
					});
				})
			})
			.catch((error) => {
				console.log("gdpr.deletecommunities.error.ondeletecommunities");
				console.error(error);
				res.status(400)
				res.json({
				type: "gdpr.deletecommunities.error.ondeletecommunities",
				error: error,
				});
			})
		} else {
			console.log("gdpr.deletecommunities.success");
			res.status(200)
			res.json({
			type: "gdpr.deletecommunities.success",
			outcome: "none to delete"
			});	
		} 	  
	  })
	  .catch((error) => {
		  console.log("gdpr.deletecommunities.error.onfind");
	    console.error(error);
	    res.status(400)
		res.json({
	      type: "gdpr.deletecommunities.error.onfind",
	      error: error,
	    });
	  })
};