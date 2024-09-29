require("dotenv").config();
const CryptoJS = require("crypto-js");
const Action = require("../../models/Action.js");
const Coefficient = require("../../models/Coefficient.js");
const Recurrence = require("../../models/Recurrence.js");
const Transaction = require("../../models/Transaction.js");
const User = require("../../models/User.js");

module.exports = gdprAccessUserData = (req, res, next) => {
  /*
  
  sends back the user data
  
  possible response types
  * gdpr.accessuserdata.success
  * gdpr.accessuserdata.error
  
  */

  if (process.env.DEBUG) {
    console.log("gdpr.accessuserdata");
  }
  
  let userid = req.augmented.user.userid
  
  let outcome = {
	  actions: { state: "pending", data : {}},
	  coefficients: { state: "pending", data : {}},
	  communities: { state: "pending", data : {}},
	  recurrences: { state: "pending", data : {}},
	  transactions: { state: "pending", data : {}},
	  user: { state: "pending", data : {}},
  }
  
  function updateObject (obj, data) {
	  outcome[obj].state = "done"
	  outcome[obj].data = data
  }
  function errorObject (obj, error) {
    console.log(obj + " error", error);
	  outcome[obj].state = "error"
	  outcome[obj].error = error
  }
  
  Promise.all([
	  Action.find({ $or:[ { doneby : userid }, {"for": userid } ]})
      .then((actions) => {
	      updateObject("actions", actions)
      })
      .catch((error) => {
        console.log("actions error", error);
	      errorObject("actions", error)
      }),
	  Coefficient.find({"userratios.userid": userid })
      .then((coefficients) => {
	      updateObject("coefficients", coefficients)
      })
      .catch((error) => {
	      errorObject("coefficients", error)
      }),
	  Recurrence.find({"for": userid })
      .then((recurrences) => {
	      updateObject("recurrences", recurrences)
      })
      .catch((error) => {
	      errorObject("recurrences", error)
      }),
	  Transaction.find({ $or:[ { by : userid }, {"for": userid } ]})
      .then((transactions) => {
	      updateObject("transactions", transactions)
      })
      .catch((error) => {
	      errorObject("transactions", error)
      }),
	  User.aggregate([
			{
				$match: { userid : userid }
			},
			{
				$lookup: {
					from: "communities",
					foreignField: "communityid",
					localField: "communityid",
					as: "communities",
				},
			},
		])
      .then((users) => {
	      // User
	      let decodedUser = {...users[0]}	      
		    decodedUser.login = CryptoJS.AES.decrypt(
		      decodedUser.login,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);    
		    decodedUser.name = CryptoJS.AES.decrypt(
		      decodedUser.name,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);
		    delete decodedUser.communities
	      updateObject("user", decodedUser)
	      // Communities
	      let decodedCommunity = { ...users[0].community[0] }
	      decodedCommunity.name = CryptoJS.AES.decrypt(
		      decodedCommunity.name,
		      process.env.ENCRYPTION_KEY
		    ).toString(CryptoJS.enc.Utf8);
	      updateObject("communities", [ decodedCommunity ])	      
      })
      .catch((error) => {
	      errorObject("users", error)
      })
	]).then(() => {
		let encryptedOutcome = CryptoJS.AES.encrypt(
        outcome.stringify(),
        process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        // response
        res.status(200).json({
            type: "gdpr.accessuserdata.success",
            data: { 
                encryptedOutcome,
            },
        })
    })
    .catch((error) => {
        console.log("gdpr.accessuserdata.error");
        console.error(error);
        res.status(400).json({
        type: "gdpr.accessuserdata.error",
        error: error,
        });
    });
};