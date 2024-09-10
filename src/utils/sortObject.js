module.exports = function sortObject(obj, attribute) {
  // Build sorter
  let sorter = [];
  for (const [key, value] of Object.entries(obj)) {
    sorter.push({ key, value: value[attribute] });
  }
  // Sort
  function compare(a, b) {
    if (a.value > b.value) {
      return -1;
    }
    if (a.value < b.value) {
      return 1;
    }
    return 0;
  }
  sorter.sort(compare);
  // Build new dict
  let sorted = {};
  for (var i = 0; i < sorter.length; i++) {
    sorted[sorter[i].key] = obj[sorter[i].key];
  }
  return sorted;
};
