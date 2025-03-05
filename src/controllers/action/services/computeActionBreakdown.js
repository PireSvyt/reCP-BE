module.exports = function computeActionBreakdown(req, actions, need) {
  /*
  need includes
  * audience: personal, community
  * graph: breakdownbymember
  * by: count, duration
  * to: date for date range end
  * since: date for date range start
  */

  // Initialize
  let breakdown = {};

  let track = "";
  switch (need.graph) {
    case "breakdownbymember":
      track = "doneby";
      break;
  }
  console.log("track", track);

  function addToBreakdown(action) {
    if (!Object.keys(breakdown).includes(action[track])) {
      console.log("add to breakdown", action[track]);
      let newBreakdown = {
        by: action[track],
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
    addToBreakdown(action);
  });

  // Sort
  let sortedBreakdown = Object.values(breakdown);
  sortedBreakdown.sort((a, b) => {
    return b.total - a.total;
  });

  console.log("sortedBreakdown", sortedBreakdown);

  return sortedBreakdown;
};
