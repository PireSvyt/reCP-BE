require("dotenv").config();
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");

module.exports = gdprEditUserData = (req, res, next) => {
  /*
  
  enables users to edit their data
  
  possible response types
  * gdpr.edituserdata.success
  * gdpr.edituserdata.error.notfound
  * gdpr.edituserdata.error.onfind
  * gdpr.edituserdata.error.onpasswordcompare
  * gdpr.edituserdata.error.invalidpassword
  * gdpr.edituserdata.error.sendingemail
  * gdpr.edituserdata.error
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.edituserdata");
  }
  
  let userid = req.augmented.user.userid
  let attemptPassword = undefined
  
  let edits = {}
  let securedEdits = false
  if (req.body.user.name !== undefined) {
	  edits.name = req.body.user.name
    if (req.body.encryption === true) {
      edits.name  = CryptoJS.AES.decrypt(
        edits.name,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
	  lastconnexion = Date.now()
  }
  if (req.body.user.login !== undefined) {
	  edits.loginchange = req.body.user.login
    if (req.body.encryption === true) {
      edits.loginchange  = CryptoJS.AES.decrypt(
        edits.loginchange,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
	  securedEdits = true
	  attemptPassword = req.body.user.password;
	  if (req.body.encryption === true) {
      attemptPassword  = CryptoJS.AES.decrypt(
        attemptPassword,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
	  lastconnexion = Date.now()
  }
  if (req.body.user.newpassword !== undefined) {
    edits.password = req.body.user.newpassword
    if (req.body.encryption === true) {
      edits.password  = CryptoJS.AES.decrypt(
        edits.password,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
	  securedEdits = true
	  attemptPassword = req.body.user.password;
	  if (req.body.encryption === true) {
      attemptPassword  = CryptoJS.AES.decrypt(
        attemptPassword,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    }
	  lastconnexion = Date.now()
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
			          if (edits.loginchange !== undefined) {
                  // Provide back email candidate
                  data.loginchange = edits.loginchange
                  // Send email for change
                  serviceMailing("changelogin", {
                    token: jwt.sign(
                      {
                        userid: user.userid,
                        login: user.login,
                        loginchange: edits.loginchange,
                      },
                      process.env.JWT_SECRET,
                      {
                        expiresIn: "2d",
                      }
                    ),
                    userlogin: edits.loginchange,
                    username: user.name
                  }).then((mailing) => {
                    if (mailing.type === "mail.mailing.success") {
                      console.log("gdpr.edituserdata.success");
                      return res.status(200).json({
                        type: "gdpr.edituserdata.success",
                        data: data,
                      });
                    } else {
                      console.log("gdpr.edituserdata.error.sendingemail");
                      return res.status(400).json({
                        type: "gdpr.edituserdata.error.sendingemail"
                      });
                    }
                  });
			          } else {
                  // response
                  res.status(200).json({
                    type: "gdpr.edituserdata.success",
                  })
                }
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