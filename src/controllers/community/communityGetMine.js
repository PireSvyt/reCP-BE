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

	console.log("req.augmented", req.augmented)
	
	Community.aggregate([
		{
			$match: { communityid: req.augmented.user.communityid }
		},
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
				deleterequests: 1
			},
		},
	])
	.then((communities) => {
	if (communities.length === 1) {
		let mycommunity = {...communities[0]}
		// Augmenting members
		let augmentedMembers = []
		mycommunity.members.forEach(member => {
			let augmentingMember = mycommunity.augmentingMembers
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
		delete mycommunity.augmentingMembers
		mycommunity.members = augmentedMembers
		// Response
	  return res.status(200).json({
	    type: "community.getmine.success",
	    data: {
	      community: mycommunity
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