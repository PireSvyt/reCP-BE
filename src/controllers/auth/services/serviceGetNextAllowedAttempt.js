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
			let failedconnections1min = failedconnections.filter(failedconnection => {
				return (nowDate - failedconnection < (1 * 1000 * 60))
			})
			if (5 <= failedconnections1min.length) {
				outcome.delayed = true
				let oldestAttempt = failedconnections1min[0]
				oldestAttempt.setMinutes(oldestAttempt.getMinutes() + 1)
				outcome.date = oldestAttempt
				// No notifications				
			}
			
			// No more than 15 attempts per 15 minutes
			let failedconnections15min = failedconnections.filter(failedconnection => {		
				return (nowDate - failedconnection < (15 * 1000 * 60))
			})
			if (15 <= failedconnections15min.length) {
				outcome.delayed = true
				let oldestAttempt = failedconnections15min[0]
				oldestAttempt.setMinutes(oldestAttempt.getMinutes() + 15)
				outcome.date = oldestAttempt
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