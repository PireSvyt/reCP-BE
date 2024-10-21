require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const Community = require("../../models/Community.js");

module.exports = userChangeCommunity = (req, res, next) => {
  /*

  changes the communityid of a user

  possible response types
  - user.changecommunity.success
  - user.changecommunity.error.inputs
  - user.changecommunity.error.denied
  - user.changecommunity.error.onchange

  */

  if (process.env.DEBUG) {
	  console.log("user.changecommunity");
  }

  // Save
  if (req.augmented.user.userid === "" || req.augmented.user.userid === undefined ||
	  req.body.communityid === "" || req.body.communityid === undefined) {
    console.log("user.changecommunity.error.inputs");
    return res.status(503).json({
      type: "user.changecommunity.error.inputs",
      error: error,
    });
  } else {
	  // Check community id open to user
	  Community.findOne({communityid: req.body.communityid})
	  .Then((community) => {
		  if (!community) {
			  console.log("user.changecommunity.error.denied");
        return res.status(403).json({
          type: "user.changecommunity.error.denied",
        });
		  } else {
			  let recordedMember = community.members.filter(member => {return member.userid})[0]
			  if (!recordedMember) {
				  console.log("user.changecommunity.error.denied");
	        return res.status(403).json({
	          type: "user.changecommunity.error.denied",
	        });
        } else {
	        if (recordedMember.access !== "valid") {
					  console.log("user.changecommunity.error.denied");
		        return res.status(403).json({
		          type: "user.changecommunity.error.denied",
		        });
	        } else {
		        // Update community
					let edits = {
					    communityid: community.communityid
					}
				    User.updateOne(
				      {
				        userid: req.augmented.user.userid,
				      },
				      edits
				    )
				      .then(() => {
				        console.log("user.changecommunity.success");
				        return res.status(200).json({
				          type: "user.changecommunity.success",
				          data: {
                    token: jwt.sign(
                      {
                        userid: req.augmented.user.userid,
                        type: req.augmented.user.type,
                        communityid: community.communityid
                      },
                      process.env.JWT_SECRET,
                      {
                        expiresIn: "365d",
                      }
                    ),
                  },
				        });
				      })
				      .catch((error) => {
				        console.log("user.changecommunity.error.onchange");
				        console.error(error);
				        return res.status(400).json({
				          type: "user.changecommunity.error.onchange",
				          error: error,
				        });
				      });
	        }
        }
		  }
	  })
	  .catch((error) => {
      console.log("user.changecommunity.error.denied");
      console.error(error);
      return res.status(400).json({
        type: "user.changecommunity.error.denied",
        error: error,
      });
    });
  }
};