const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");

exports.computeBalance = (req, res, next) => {
  // Initialize
  var status = 500;

  Category.find()
    .then((categoryList) => {
      let categories = {};
      categoryList.forEach((category) => {
        category.total = 0;
        categories[category.categoryid] = {
          categoryid: category.categoryid,
          total: 0,
          name: category.name
        };
      });
      Transaction.find()
        .then((transactions) => {
          var users = { Alice: 0, Pierre: 0 };
          var factor = 0;
          var share = 0;
          var jsonTransaction = {};
          var categoryTotal = 0;
          var categoryUndefined = 0;
          transactions.forEach((transaction) => {
            jsonTransaction = transaction.toObject();
            // Balance per user
            for (var user of Object.keys(users)) {
              if (user === jsonTransaction.by) {
                factor = 1;
                share =
                  Math.max(jsonTransaction.for.length - 1, 1) /
                  jsonTransaction.for.length;
              } else {
                factor = -1;
                share = 1 / jsonTransaction.for.length;
              }
              users[user] =
                users[user] + factor * share * jsonTransaction.amount;
            }
            // Balance per category
            if (jsonTransaction.category !== "") {
              //console.log("jsonTransaction.category");
              //console.log(jsonTransaction.category);
              //console.log("jsonTransaction.amount");
              //console.log(jsonTransaction.amount);
              if (categories[jsonTransaction.category] !== undefined) {
                categories[jsonTransaction.category].total +=
                  jsonTransaction.amount;
                //console.log("categories[jsonTransaction.category]");
                //console.log(categories[jsonTransaction.category]);
                //} else {
                //console.log("ERROR CATEGORY NOT FOUND");
              }
            } else {
              categoryUndefined += jsonTransaction.amount;
            }
            categoryTotal += jsonTransaction.amount;
          });
          // Adding category undefiend and total
          categories["-"] = {
            name: "-",
            _id: "-",
            total: categoryUndefined
          };
          categories["Total"] = {
            name: "Total",
            _id: "Total",
            total: categoryTotal
          };
          // Sort categories
          let orderedCategories = sortObject(categories, "total");
          // Merge
          status = 200; // OK
          res.status(status).json({
            status: status,
            message: "summary ok",
            summary: { users: users, categories: orderedCategories }
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on find transactions",
            summary: {},
            error: error
          });
          console.error(error);
        });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find categories",
        summary: {},
        error: error
      });
      console.error(error);
    });
};

function sortObject(obj, attribute) {
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
}
