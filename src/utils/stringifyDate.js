module.exports = function stringifyDate(givenDate, option = "long") {
    let options = {};
    if (option === "long") {
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      return givenDate.toLocaleString("fr-FR", options);
    }
    if (option === "short") {
      options = {
        month: "numeric",
        day: "numeric",
      };
      return givenDate.toLocaleString("fr-FR", options);
    }
    if (option === "be") {
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      return givenDate.toLocaleString("en-US", options);
    }
    return givenDate.toLocaleString("fr-FR", options);
    //{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  }