module.exports = function computeBudget(budget, transactions) {

    let newBudget = {...budget}
    
    // Capture periods
    let perdiods = {
        current : {
            ongoing: true,
        },
        previous : {
            ongoing: false,
        }
    }
    const nowDate = new Date();
    const currentMonth = nowDate.getMonth()
    const currentYear = nowDate.getYar()
    switch (newBudget.type) {
        case "monthly" :
            perdiods.current.target = getTarget(budget, currentMonth)
            perdiods.current.start = new Date(currentYear, currentMonth, 1)
            perdiods.current.end = new Date(currentYear, currentMonth+1, 0)
            perdiods.current.progress = (perdiods.current.end - nowDate) / 
                (perdiods.current.end - perdiods.current.start)
            perdiods.current.period = "month" + (currentMonth+1)
            perdiods.previous.end = perdiods.current.start
            if (currentMonth === 0) {
                perdiods.previous.target = getTarget(budget, 11)
                perdiods.previous.start = new Date(currentYear-1, 11, 1)
                perdiods.previous.period = "month" + 12
            } else {
                perdiods.previous.target = getTarget(budget, currentMonth-1)
                perdiods.previous.start = new Date(currentYear, currentMonth-1, 1)
                perdiods.previous.period = "month" + currentMonth
            }            
            break
        case "quarterly" :
            const currentQuarter = Math.floor((currentMonth + 3) / 3)
            perdiods.current.target = getTarget(budget, currentQuarter)
            perdiods.current.start = new Date(currentYear, (currentQuarter-1)*3, 1)
            perdiods.current.end = new Date(currentYear, (currentQuarter-1)*3+1, 0)
            perdiods.current.progress = (perdiods.current.end - nowDate) / 
                (perdiods.current.end - perdiods.current.start)
            perdiods.current.period = "quarter" + currentQuarter
            perdiods.previous.end = perdiods.current.start
            if (currentQuarter === 1) {
                perdiods.previous.target = getTarget(budget, 4)
                perdiods.previous.start = new Date(currentYear-1, 9, 1)
                perdiods.previous.period = "quarter" + 4
            } else {
                perdiods.previous.target = getTarget(budget, currentQuarter-1)
                perdiods.previous.start = new Date(currentYear, (currentQuarter-2)*3, 1)
                perdiods.previous.period = "quarter" + (currentQuarter-1)
            }
            break
        case "yearly" :
            perdiods.current.target = getTarget(budget, currentYear)
            perdiods.current.start = new Date(currentYear, 0, 1)
            perdiods.current.end = new Date(currentYear+1, 0, 0)
            perdiods.current.progress = (perdiods.current.end - nowDate) / 
                (perdiods.current.end - perdiods.current.start)
            perdiods.current.period = currentYear
            perdiods.current.target = getTarget(budget, currentYear-1)
            perdiods.previous.end = perdiods.current.start
            perdiods.previous.start = new Date(currentYear-1, 0, 1)
            perdiods.previous.period = currentYear-1
            break
        case "sliding" :
            perdiods.current.target = budget.targets[0].target
            perdiods.current.ongoing = false
            perdiods.current.start = nowDate - budget.slidingDuration * (1000 * 3600 * 24)
            perdiods.current.end = nowDate
            perdiods.current.period = "slidingCurrent"
            perdiods.previous.target = budget.targets[0].target
            perdiods.previous.end = perdiods.current.start
            perdiods.previous.start = nowDate - 2 * budget.slidingDuration * (1000 * 3600 * 24)
            perdiods.previous.period = "slidingPrevious"
            break
        default:
            return newBudget
    }

    // Compute indicators
    newBudget.indicators = [
        computeIndicator(budget, perdiods.current, transactions),
        computeIndicator(budget, perdiods.previous, transactions),
    ]
    
    return newBudget;

};

function getTarget(budget, input) {
    let target = budget.targets[0].target
    budget.targets.forEach(potentialTarget => {
        if (potentialTarget.slots.includes(input)) {
            target = potentialTarget.target
        }
    })
    return target
}
function computeIndicator (budget, period, transactions) {
    let indicator = {...period}
    indicator.current = 0

    // Current
    transactions.forEach(transaction => {
        let passing = true
        // Date filtering
        let transactionDate = Date.parse(transaction.date);
        if (transactionDate < period.start || period.end < transactionDate) {
            passing = false
        }
        // Category filtering
        if (budget.categoryids !== undefined) {
            if (budget.categoryids.length > 0) {
                if (!budget.categoryids.includes(transaction.categoryid)) {
                    passing = false
                }                
            }
        }
        // Accounted in?
        if (passing) {
            indicator.current = indicator.current + transaction.amount
        }
    })

    // Projection
    if (period.ongoing) {
        indicator.projection = indicator.current * (1/period.progress)
    }

    return indicator

}
   