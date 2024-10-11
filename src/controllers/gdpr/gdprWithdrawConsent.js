require("dotenv").config();
const User = require("../../models/User.js");

module.exports = gdprWithdrawConsent = (req, res, next) => {
  /*
  
  enables users to withdraw their consent for data processing
  
  possible response types
  * gdpr.withdrawconsent.success
  * gdpr.withdrawconsent.error
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.withdrawconsent");
  }
  
  let userid = req.augmented.user.userid
  
  User.findOne({ userid: userid })
	  .then((user) => {
		  if (!user) {
        // Inexisting user
        console.log("gdpr.withdrawconsent.error");
        return res.status(404).json({
          type: "gdpr.withdrawconsent.error",
        });
      } else {	      			  
			  User.updateOne(
				  { userid: userid },
				  { state: "anonymous" }
				).then(() => {
			    // response
				  res.status(200).json({
            type: "gdpr.withdrawconsent.success",
          })
        })
			  .catch((error) => {
			    console.log("gdpr.withdrawconsent.error");
			    console.error(error);
			    res.status(401).json({
			      type: "gdpr.withdrawconsent.error",
			      error: error,
			    });
			  });
			}  
	  })
	  .catch((error) => {
		  console.log("gdpr.withdrawconsent.error");
	    console.error(error);
	    res.status(400).json({
	      type: "gdpr.withdrawconsent.error",
	      error: error,
	    });
	  })
};