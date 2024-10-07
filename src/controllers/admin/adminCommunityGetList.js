require("dotenv").config();
const Community = require("../../models/Community.js");

module.exports = adminCommunityGetList = (req, res, next) => {
  /*
  
  sends back the list of communities
  
  possible response types
  * admin.community.getlist.success
  * admin.community.getlist.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("community.getlist");
  }

  Community.aggregate([
		{ $match: {} },
		{
			$lookup: {
				from: "users",
				foreignField: "userid",
				localField: "members.userid",
				as: "augmentingMembers",
				pipeline: [
					{
						// userid communityid name type
						$project: {
							_id: 0,
							userid: 1,
							name: 1,
							state: 1
						},
					},
				],
			},
		},
		{
			// communityid name
			$project: {
				_id: 0,
				communityid: 1,
				name: 1,
				members: 1,
				augmentingMembers: 1,
				deleterequests: 1,
			},
		},
	])
    .then((communities) => {
	    let communitiesToSend = []
	    communities.forEach(community => {
		    communityToSend = {...community}
		    // Augmenting members
				let augmentedMembers = []
				communityToSend.members.forEach(member => {
					let augmentingMember = communityToSend.augmentingMembers
					.filter(am => {return am.userid === member.userid})[0]
					let augmentedMember = {...member}
					if (augmentingMember.name !== undefined) {
						augmentedMember.name = augmentingMember.name
					}
					if (augmentingMember.state !== undefined) {
						augmentedMember.state = augmentingMember.state
					}
					augmentedMembers.push(augmentedMember)
				})
				delete communityToSend.augmentingMembers
				communityToSend.members = augmentedMembers
				// Accounting
		    communitiesToSend.push(communityToSend)
	    })	    
      return res.status(200).json({
        type: "admin.community.getlist.success",
        data: {
          communities: communitiesToSend,
        },
      });
    })
    .catch((error) => {
      console.log("admin.community.getlist.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "admin.community.getlist.error.onfind",
        error: error,
      });
    });
};