require("dotenv").config();
const User = require("../../models/User.js");
var random_string = require("../../utils/random_string.js");

module.exports = gdprDeleteUserData = (req, res, next) => {
  /*
  
  enables users to delete their data
  they become anonymous users to preserve communities' usage
  
  possible response types
  * gdpr.deleteuserdata.success
  * gdpr.deleteuserdata.error
  * gdpr.deleteuserdata.error.notfound
  * gdpr.deleteuserdata.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.deleteuserdata");
  }
  
  let userid = req.augmented.user.userid
  
  User.findOne({ userid: userid })
	  .then((user) => {
		  if (!user) {
        // Inexisting user
        console.log("gdpr.deleteuserdata.error.notfound");
        return res.status(404).json({
          type: "gdpr.deleteuserdata.error.notfound",
        });
      } else {	   
	      User.replaceOne(
				  { userid: userid },
				  { 
					  schema: "anonymized",
					  userid: userid,
					  state: "anonymous",
					  communityid: user.communityid,
					  name: random_string(24),
					  login: random_string(24),
					  password: random_string(24)
				  }
				).then(() => {
			    // response
				  res.status(200).json({
			        type: "gdpr.deleteuserdata.success",
			      })
                })
			  .catch((error) => {
			    console.log("gdpr.deleteuserdata.error");
			    console.error(error);
			    res.status(400).json({
			      type: "gdpr.deleteuserdata.error",
			      error: error,
			    });
			  });
        }
    })
    .catch((error) => {
		  console.log("gdpr.deleteuserdata.error.onfind");
	    console.error(error);
	    res.status(400).json({
	      type: "gdpr.deleteuserdata.error.onfind",
	      error: error,
	    });
	  })
};