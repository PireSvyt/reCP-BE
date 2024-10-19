module.exports = function serviceGetNextAllowedAttempt(failedconnections) {
	let outcome = {
		delayed: false,
		date: Date.now()
	}
	if (failedconnections !== undefined) {
		// Defined failedconnections means careful management
		if (5 <= failedconnections.length) {
			// Above 5 attempts we look at them
			let nowDate = Date.now()
			
			// No more than 5 attemps per minutes
			if (5 <= failedconnections.filter(failedconnection => {				
				let Difference_In_Time = nowDate - Date.parse(failedconnection);
				let Difference_In_Minutes = Difference_In_Time / (1000 * 60);
				return (Difference_In_Minutes < 1)
			}).length) {
				outcome.delayed = true
				outcome.date = failedconnections.filter(failedconnection => {				
					let Difference_In_Time = nowDate - Date.parse(failedconnection);
					let Difference_In_Minutes = Difference_In_Time / (1000 * 60);
					return (Difference_In_Minutes < 1)
					})[0] + 1 * (1000 * 60)
				// No notifications				
			}
			
			// No more than 15 attempts per 15 minutes
			if (15 <= failedconnections.filter(failedconnection => {				
				let Difference_In_Time = nowDate - Date.parse(failedconnection);
				let Difference_In_Minutes = Difference_In_Time / (1000 * 60);
				return (Difference_In_Minutes < 15)
			}).length) {
				outcome.delayed = true
				outcome.date = failedconnections.filter(failedconnection => {				
					let Difference_In_Time = nowDate - Date.parse(failedconnection);
					let Difference_In_Minutes = Difference_In_Time / (1000 * 60);
					return (Difference_In_Minutes < 1)
					})[0] + 15 * (1000 * 60)		
				// Email notification to reset password
				
				
			}			
			
			// Above 30 attempts
			if (30 <= failedconnections.length) {			
				// Email notification to admin (risk of bruce force attack)
				
				
			}
		}
	}
	
	// In all other cases, no delay
	return (outcome)
};