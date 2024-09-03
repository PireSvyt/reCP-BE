module.exports = function compare_date(a, b) {
  if (a.date == b.date) {
    return 0;
  } else if (a.date > b.date) {
    return -1;
  } else {
    return 1;
  }
};
