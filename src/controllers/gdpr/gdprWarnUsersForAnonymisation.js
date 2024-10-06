require("dotenv").config();
const User = require("../../models/User.js");
const serviceMailing = require("../../mails/serviceMailing.js");
const stringifyDate = require("../../utils/stringifyDate.js");

module.exports = gdprWarnUsersForAnonymisation = (req, res, next) => {
  /*
  
  snds an email to users who are inactive prior anonymisation of their account
  
  possible response types
  * gdpr.warnusers.success
  * gdpr.warnusers.error
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.anonymiseusers");
  }
  
  let nowDate = Date.now();
  let threshold60daysDate = nowDate - (1000 * 3600 * 24) * (365-60);

  User.find(
	  { lastconnection: {$lt: threshold60daysDate} },
  )
  .then((users) => {
	  let notifiedUsers = []
	  let outcomes = {}
    if (users.length > 0) {
      users.forEach(user => {
        if (user.lastconnection !== undefined && user.state !== "anonymised") {
          outcomes[user.userid] = {
            state: "pending"
          }
          notifiedUsers.push(
            new Promise((resolve) => {
              serviceMailing("anonymisationnotice", {
                          userid: user.userid,
                              username: user.name,
                              userlogin: user.login,
                              anonymisationdate: stringifyDate(Date.parse(user.lastconnection) + (1000 * 3600 * 24) * 365)
                          }).then((mailing) => {
                              if (mailing.type === "mail.mailing.success") {
                                  // Capture notice
                                  User.updateOne(
                                      { userid: user.userid },
                                      { anonymisationnotice : nowDate}
                                  ).then((outcome) => {
                                      outcomes[user.userid] = {
                                                  state: "done",
                                          mailing: mailing,
                                                  outcome: outcome
                                              }
                                      resolve({
                                          userid: user.userid,
                                          mailing: mailing,
                                          anonymisationnotice: outcome
                                      })						       
                                  })
                              } else {
                                  outcomes[user.userid] = {
                                              state: "error",
                                      mailing: mailing
                                          }
                                  resolve({
                                      userid: user.userid,
                                      mailing: mailing
                                  })
                              }
                    });
                    })
          )
        }
      })
      
      // Fire emails
      Promise.all(notifiedUsers)
        .then((outputs) => {
          console.log("gdprWarnUsersForAnonymisation / outputs ", outputs);
          console.log("gdprWarnUsersForAnonymisation / outcomes ", outcomes);
          let overallSuccess = true
          Object.keys(outcomes).forEach(userid => {
            if (outcomes[userid].state !== "done") {
              overallSuccess = false
            }
          })
          if (overallSuccess) {
            console.log("gdpr.warnusers.success");
            res.status(200)
            res.json({
              type: "gdpr.warnusers.success",
              outcome: outcomes
            });		  
          } else {
            console.log("gdpr.warnusers.error");
            res.status(400)
            res.json({
              type: "gdpr.warnusers.error",
              error: outcomes,
            });
          }
        
        })		
    } else {
      console.log("gdpr.warnusers.success");
      res.status(200)
      res.json({
        type: "gdpr.warnusers.success",
        outcome: "no user to warn",
      });
    }  
  })
  .catch((error) => {
	  console.log("gdpr.warnusers.error");
    console.error(error);
    res.status(400)
    res.json({
      type: "gdpr.warnusers.error",
      error: error,
    });
  })
};