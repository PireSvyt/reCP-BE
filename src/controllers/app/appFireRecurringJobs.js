const Setting = require("../../models/Setting.js");
const gdprWarnUsersForAnonymisation = require("../gdpr/gdprWarnUsersForAnonymisation.js");
const gdprAnonymiseInactiveUsers = require("../gdpr/gdprAnonymiseInactiveUsers.js");
const gdprDeleteInactiveCommunities = require("../gdpr/gdprDeleteInactiveCommunities.js");
const recurrenceGenerateActions = require("../recurrence/recurrenceGenerateActions.js");


module.exports = appFireRecurringJobs = (req, res, next) => {
/*

fires the recurring jobs including
- user anonymisations
- community deletions
- action creation from recurrences

accounts for setting "Last reccurring job" to run only once a day

*/
	
  if (process.env.DEBUG) {
    console.log("app.fireRecurringJobs");
  }
  
  let outcomes = {
		userwarnings: { state: "pending" },
		useranonymisations: { state: "pending" },
		communitiydeletions: { state: "pending" },
		recurrences: { state: "pending" },
  }
  function updateObject (obj, what, res) {
	return new Promise((resolve) => {
		console.log("appFireRecurringJobs / done " + obj + " " + what, res);
		outcomes[obj].state = "done"
		outcomes[obj][what] = res
		resolve(outcomes)
	});
  }
  
  Setting.findOne({ name : "Last reccurring job" })
  .then(setting => {
	  if (!setting) {
		  console.log("appFireRecurringJobs / setting not found", "Last reccurring job date")
		  return
	  } else {
		  let nowDate = Date.now();
		  if ((nowDate - Date.parse(setting.value.date)) / (1000 * 3600 * 24) > 1 ) {
			  Promise.all([
					new Promise((resolve) => {
						gdprWarnUsersForAnonymisation(
							{ body: {} },
							{
								status: (val) => {
									return new Promise(() => {
										updateObject("userwarnings", "status", val)
									})
								},
								json: (val) => {
									return new Promise(() => {
										updateObject("userwarnings", "json", val)
										resolve({
											"userwarnings": val
										})
									})
								}
							}
						)
					}),
					new Promise((resolve) => {
						gdprAnonymiseInactiveUsers(
							{ body: {} },
							{
								status: (val) => {
									return new Promise(() => {
										updateObject("useranonymisations", "status", val)
									})
								},
								json: (val) => {
									return new Promise(() => {
										updateObject("useranonymisations", "json", val)
										resolve({
											"useranonymisations": val
										})
									})
								}
							}
						)
					}),
					new Promise((resolve) => {
						gdprDeleteInactiveCommunities(
							{ body: {} },
							{
								status: (val) => {
									return new Promise(() => {
										updateObject("communitiydeletions", "status", val)
									})
								},
								json: (val) => {
									return new Promise(() => {
										updateObject("communitiydeletions", "json", val)
										resolve({
											"communitiydeletions": val
										})
									})
								}
							}
						)
					}),
					new Promise((resolve) => {
						recurrenceGenerateActions(
							{ body: { for: 60 } },
							{
								status: (val) => {
									return new Promise(() => {
										updateObject("recurrences", "status", val)
									})
								},
								json: (val) => {
									return new Promise(() => {
										updateObject("recurrences", "json", val)
										resolve({
											"recurrences": val
										})
									})
								}
							}
						)
					})
        ]).then((outputs) => {
				  console.log("appFireRecurringJobs / outputs ", outputs);
				  console.log("appFireRecurringJobs / outcomes ", outcomes);
				  Setting.updateOne(
					  { settingid: setting.settingid }, 
					  { value: 
						  {
							  date: Date.now(),
							  state: "success",
							  outcomes: outcomes,
							  error: outputs
						  }
					  }
				  ).then (() => {
					  console.log("appFireRecurringJobs / last run recorded");
					  return			  
				  }).catch ((error) => {
					  console.log("appFireRecurringJobs / error on recoridng last run ", error);
					  return
				  })
				  return
				}).catch((error) => {
				  console.log("appFireRecurringJobs / error ", error);
				  Setting.updateOne(
					  { settingid: setting.settingid }, 
					  { value: 
						  {
							  date: Date.now(),
							  state: "error",
							  outcomes: {},
							  error: error
						  }
					  }
				  ).then (() => {
					  console.log("appFireRecurringJobs / last run recorded with error");
					  return			  
				  }).catch ((error) => {
					  console.log("appFireRecurringJobs / error on recoridng last run with error", error);
					  return
				  })
				  return
				});
		  } else {
			  console.log("appFireRecurringJobs / already run during the last 24h")
			  return
		  }
	  }
  })
  
};