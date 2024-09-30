require("dotenv").config();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

module.exports = gdprEditUserData = (req, res, next) => {
  /*
  
  enables users to edit their data
  
  possible response types
  * gdpr.edituserdata.success
  * gdpr.edituserdata.error.notfound
  * gdpr.edituserdata.error.onfind
  * gdpr.edituserdata.error.onpasswordcompare
  * gdpr.edituserdata.error.invalidpassword
  * gdpr.edituserdata.error
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.edituserdata");
  }
  
  let userid = req.augmented.user.userid
  
  let edits = {}
  let securedEdits = false
  if (req.body.user.name !== undefined) {
	  edits.name = req.body.user.name
	  lastconnexion = Date.now()
  }
  if (req.body.user.login !== undefined) {
	  edits.login = req.body.user.login
	  edits.state = "inactive"
	  lastconnexion = Date.now()
	  securedEdits = true
  }
  if (req.body.user.newpassword !== undefined) {
	  edits.password  = CryptoJS.AES.decrypt(
      req.body.user.newpassword,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
	  lastconnexion = Date.now()
	  securedEdits = true
  }
  
  User.findOne({ userid: userid })
	  .then((user) => {
		  if (!user) {
        // Inexisting user
        console.log("gdpr.edituserdata.error.notfound");
        return res.status(404).json({
          type: "gdpr.edituserdata.error.notfound",
        });
      } else {	      
			  if (securedEdits) {
					// Secured edits (password check)
					let attemptPassword = req.body.user.password;
          attemptPassword = CryptoJS.AES.decrypt(
            attemptPassword,
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);
				  bcrypt
          .compare(attemptPassword, user.password)
          .then((valid) => {
            if (!valid) {
              console.log("gdpr.edituserdata.error.invalidpassword");
					    res.status(404).json({
					      type: "gdpr.edituserdata.error.invalidpassword",
					    });
	          } else {
		          User.updateOne(
                        { userid: userid },
                        edits
                    )
                    .then(() => {
			          let data = {}
			          if (edits.login !== undefined) {
                        data.token = jwt.sign(
                            {
                                userid: user.userid,
                                type: user.type,
                                communityid: user.communityid,
                                login: user.edits.login
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: "365d",
                            }
                        )
			          }
                        // response
                            res.status(200).json({
                            type: "gdpr.edituserdata.success",
                            data: data,
                        })
                    })
                    .catch((error) => {
                        console.log("gdpr.edituserdata.error");
                        console.error(error);
                        res.status(400).json({
                            type: "gdpr.edituserdata.error",
                            error: error,
                        });
                    });
	          }
          })
          .catch((error) => {
				    console.log("gdpr.edituserdata.error.onpasswordcompare");
				    console.error(error);
				    res.status(400).json({
				      type: "gdpr.edituserdata.error.onpasswordcompare",
				      error: error,
				    });
				  });
			  } else {
				  // Unsecured edits (direct update)
				  User.updateOne(
					  { userid: userid },
					  edits
					).then(() => {
				    // response
					  res.status(200).json({
                        type: "gdpr.edituserdata.success",
                        data: edits,
                    })
                })
				  .catch((error) => {
				    console.log("gdpr.edituserdata.error");
				    console.error(error);
				    res.status(400).json({
				      type: "gdpr.edituserdata.error",
				      error: error,
				    });
				  });
			  }		
			}  
	  })
	  .catch((error) => {
		  console.log("gdpr.edituserdata.error.onfind");
	    console.error(error);
	    res.status(400).json({
	      type: "gdpr.edituserdata.error.onfind",
	      error: error,
	    });
	  })
};