const Setting = require("../../models/Setting.js");
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
  
  function updateObject (obj, res) {
	  outcomes[obj].state = "done"
	  outcomes[obj].res = res
  }
  function errorObject (obj, error) {
    console.log("appFireRecurringJobs / error " + obj, error);
	  outcomes[obj].state = "error"
	  outcomes[obj].error = error
  }
  
  Setting.findOne({ name : "Last reccurring job" })
  .then(setting => {
	  if (!setting) {
		  console.log("appFireRecurringJobs / setting not found", "Last reccurring job date")
		  return
	  } else {
		  let nowDate = Date.now();
		  if ((nowDate - Date.parse(setting.value.date)) / (1000 * 3600 * 24) > 1 ) {
			  let outcomes = {
				  //useranonymisations: { state: "pending" },
				  //communitiydeletions: { state: "pending" },
				  recurrences: { state: "pending" },
			  }
			  // Fire
			  Promise.all([
				  recurrenceGenerateActions(
					{ body: { for: 60 } },
					{}
				  )
			      .then((res) => {
				      updateObject("recurrences", JSON.stringify(res, Object.getOwnPropertyNames(res)))
			      })
			      .catch((error) => {
				      errorObject("recurrences", JSON.stringify(error, Object.getOwnPropertyNames(error)))
			      }),
	          ]).then(() => {
				  console.log("appFireRecurringJobs / outcomes ", outcomes);
				  Setting.updateOne(
					  { settingid: setting.settingid }, 
					  { value: 
						  {
							  date: Date.now(),
							  state: "success",
							  outcomes: outcomes,
							  error: {}
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