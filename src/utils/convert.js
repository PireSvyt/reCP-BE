import uq from "./uq.json";

module.exports = function convert(amount, cUnit, nUnit) {
  if (cUnit === nUnit) {
    // No conversion
    return amount;
  }

  // Find required units
  let currentUnit, newUnit;
  uq.units.forEach((u) => {
    if (u.short === cUnit) {
      currentUnit = { ...u };
    }
    if (u.short === nUnit) {
      newUnit = { ...u };
    }
  });

  let newAmount =
    (amount / currentUnit.conversion.factor) * newUnit.conversion.factor;

  return newAmount;
}