const computeActionBreakdown = require("./computeActionBalance");

module.exports = function computeActionBreakdown(req, actions, need) {
  // Initialize
  let breakdown = {};

  let by = "";
  let count = "";
  switch (need.by) {
    case "member":
      by = "doneby";
      break;
    case "audience":
      by = "doneby";
      break;
  }

  function addToBreakdown(action, share) {
    if (!Object.keys(breakdown).includes(action[by])) {
      breakdown[action[by]] = {
        by: action[by],
        duration: share === undefined ? action.duration : share,
        count: 1,
      };
    } else {
      breakdown[action[by]].duration =
        breakdown[action[by]].duration +
        (share === undefined ? action.duration : share);
      breakdown[action[by]].count += 1;
    }
  }

  // Totalise actions
  actions.forEach((action) => {
    if (
      need.by === "audience" &&
      need.audience === "personal" &&
      action.audience === "personal" &&
      action.doneby === req.augmented.user.userid
    ) {
      addToBreakdown(action);
    }
    if (
      need.by === "member" &&
      need.audience === "community" &&
      action.audience === "community"
    ) {
      addToBreakdown(action);
    }
  });

  // Sort
  let sortedBreakdown = Object.values(breakdown);
  sortedBreakdown.sort((a, b) => {
    return b.count - a.count;
  });

  return sortedBreakdown;
};
