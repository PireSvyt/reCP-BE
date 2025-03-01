require("dotenv").config();
const Action = require("../../models/Action.js");
const Category = require("../../models/Category.js");
const Coefficient = require("../../models/Coefficient.js");
const Community = require("../../models/Community.js");
const Recurrence = require("../../models/Recurrence.js");
const Shelf = require("../../models/Shelf.js");
const Shopping = require("../../models/Shopping.js");
const Tag = require("../../models/Tag.js");
const Transaction = require("../../models/Transaction.js");
const Trash = require("../../models/Trash.js");
const User = require("../../models/User.js");
var random_string = require("../../utils/random_string.js");

module.exports = gdprDeleteCommunityData = (req, res, next) => {
  /*
  
  enables users to delete their community
  all active members shall proceed to this so that the deletion occurs
  
  possible response types
  * gdpr.deletecommunitydata.success.requested
  * gdpr.deletecommunitydata.success.deleted
  * gdpr.deletecommunitydata.error.ondelete
  * gdpr.deletecommunitydata.error.notfound
  * gdpr.deletecommunitydata.error.onfind
  * gdpr.deletecommunitydata.error
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.deletecommunitydata");
  }
  
  let userid = req.augmented.user.userid
  let communityid = req.augmented.user.communityid
  
  Community.aggregate([
		{
			$match: { communityid: communityid }
		},
		{
			$lookup: {
				from: "users",
				foreignField: "userid",
				localField: "members.userid",
				as: "augmentingmembers",
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
                augmentingmembers: 1,
				deleterequests: 1
			},
		},
		])
		.then((communities) => {
			if (communities.length !== 1) {
                // Inexisting community
                console.log("gdpr.deletecommunitydata.error.notfound");
                return res.status(404).json({
                type: "gdpr.deletecommunitydata.error.notfound",
                });
            } else {
                let communityToSave = {...communities[0]}
                // Account for user request
                if (communityToSave.deleterequests === undefined ) {
                    communityToSave.deleterequests = [
                        {
                            userid: userid,
                            date: Date.now()
                        }
                    ]
                } else {
                    if (!communityToSave.deleterequests.map(dr => {return dr.userid}).includes(userid)) {
                        communityToSave.deleterequests.push({
                            userid: userid,
                            date: Date.now()
                        })
                    }
                }
                // Check if all active users from this community are aligned yet
                let allActiveMembersRequestedCommunityDeletion = true
                communityToSave.members.forEach(member => {
                    if (communityToSave.augmentingmembers.filter(am => {return am.userid === member.userid})[0].state !== "anonymous" &&
                    !communityToSave.deleterequests.map(dr => {return dr.userid}).includes(member.userid)) {
                        allActiveMembersRequestedCommunityDeletion = false
                    }
                })
                if (allActiveMembersRequestedCommunityDeletion) {
                    // Delete community and all related data
                    console.log("gdpr.deletecommunitydata all aligned")
                    let outcome = {
                        actions: { state: "pending"},
                        categories: { state: "pending"},
                        coefficients: { state: "pending"},
                        community: { state: "pending"},
                        recurrences: { state: "pending"},
                        shelves: { state: "pending"},
                        shoppings: { state: "pending"},
                        tags: { state: "pending"},
                        transactions: { state: "pending"},
                        trashes: { state: "pending"},
                        users: { state: "pending"},
                    }
                    function updateObject (obj, collectOutcome) {
                        outcome[obj].state = "done"
                        outcome[obj].outcome = collectOutcome
                    }
                    function errorObject (obj, error) {
                        //console.log(obj + " error", error);
                        outcome[obj].state = "error"
                        outcome[obj].error = error
                    }
                    Promise.all([
                        Action.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("actions", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("actions", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Category.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("categories", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("categories", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Coefficient.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("coefficients", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("coefficients", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Community.deleteOne({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("community", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("community", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Recurrence.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("recurrences", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("recurrences", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Shelf.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("shelves", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("shelves", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Shopping.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("shoppings", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("shoppings", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Tag.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("tags", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("tags", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Transaction.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("transactions", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("transactions", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        Trash.deleteMany({communityid: communityid})
                        .then((collectOutcome) => {
                            updateObject("trashes", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("trashes", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        }),
                        User.updateMany({userid: communityToSave.members.map( member => {
                            return member.userid
                        })}, { communityid: "NOCOMMUNITY-" + random_string(24) } )
                        .then((collectOutcome) => {
                            updateObject("users", collectOutcome)
                        })
                        .catch((error) => {
                            errorObject("users", JSON.stringify(error, Object.getOwnPropertyNames(error)))
                        })
                        ]).then(() => {
                            console.log("gdpr.deletecommunitydata.success.delete", outcome);
                            let successfulDeletion = true
                            Object.keys(outcome).forEach(obj => {
                                if (outcome[obj].state === "error") {
                                    successfulDeletion = false
                                }
                            })
                            if (successfulDeletion) {
                                res.status(200).json({
                                    type: "gdpr.deletecommunitydata.success.delete",
                                    //data: outcome,
                                });		
                            } else {
                                res.status(400).json({
                                    type: "gdpr.deletecommunitydata.error.ondelete",
                                    //data: outcome,
                                });		
                            }  
                        })
                    .catch((error) => {
                        console.log("gdpr.deletecommunitydata.error");
                        console.error(error);
                        /*
                        NO RES TO AGGREGATE OUTCOMES IN CASE OF ERRORS
                        res.status(400).json({
                        type: "gdpr.deletecommunitydata.error",
                        error: error,
                        });	 */
                    })
                } else {
                    // Save community untill al users are aligned
                    console.log("gdpr.deletecommunitydata not all aligned")
                    Community.updateOne(
                            { communityid: communityid },
                            communityToSave
                            ).then(() => {
                                // response
                                console.log("gdpr.deletecommunitydata.success.requested");
                                res.status(200)
                                res.json({
                                    type: "gdpr.deletecommunitydata.success.requested",
                                })
                            })
                            .catch((error) => {
                                console.log("gdpr.deletecommunitydata.error");
                                console.error(error);
                                res.status(400)
                                res.json({
                                    type: "gdpr.deletecommunitydata.error",
                                    error: error,
                                });
                            })
                }  
            }
        })
	  .catch((error) => {
		console.log("gdpr.deletecommunitydata.error.onfind");
	    console.error(error);
	    res.status(400)
        res.json({
	      type: "gdpr.deletecommunitydata.error.onfind",
	      error: error,
	    });
	  })
};