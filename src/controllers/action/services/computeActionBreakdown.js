module.exports = function computeActionBreakdown(req, actions, need) {
  // Initialize
  let breakdown = {};
  /*
  need includes
  * audience: personal, community
  * graph: breakdownbymember
  * by: count, duration
  * to: date for date range end
  * since: date for date range start
  */

  let track = "";
  let count = "";
  switch (need.graph) {
    case "breakdownbymember":
      track = "doneby";
      break;
  }

  function addToBreakdown(action) {
    if (!Object.keys(breakdown).includes(action[track])) {
      let newBreakdown = {
        track: action[track],
      };
      switch (need.by) {
        case "count":
          newBreakdown.total = 1;
          break;
        case "duration":
          if (action.duration) {
            newBreakdown.total = action.duration;
          } else {
            newBreakdown.total = 0;
          }
          break;
      }
      breakdown[action[track]] = newBreakdown;
    } else {
      switch (need.by) {
        case "count":
          breakdown[action[track]].total += 1;
          break;
        case "duration":
          if (action.duration) {
            breakdown[action[track]].total += action.duration;
          } else {
            breakdown[action[track]].total += 0;
          }
          break;
      }
    }
  }

  // Totalise actions
  actions.forEach((action) => {
    if (
      need.audience === "personal" &&
      action.audience === "personal" &&
      action.doneby === req.augmented.user.userid
    ) {
      addToBreakdown(action);
    }
    if (need.audience === "community" && action.audience === "community") {
      addToBreakdown(action);
    }
  });

  // Sort
  let sortedBreakdown = Object.values(breakdown);
  sortedBreakdown.sort((a, b) => {
    return b.total - a.total;
  });

  return sortedBreakdown;
};
