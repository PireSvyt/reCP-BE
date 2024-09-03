const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");
const computeTransactionBalance = require("./services/computeTransactionBalance.js");

module.exports = computeBalance = (req, res, next) => {
  // Initialize
  var status = 500;

  Category.find()
    .then((categoryList) => {
      let categories = {};
      categoryList.forEach((category) => {
        category.total = 0;
        categories[category.categoryid] = {
          total: 0,
          name: category.name,
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
            transactionUserBalance = computeTransactionBalance(jsonTransaction);
            for (var user of Object.keys(transactionUserBalance)) {
              users[user] += transactionUserBalance[user];
            }
            // Balance per category
            if (jsonTransaction.categoryid !== undefined) {
              if (categories[jsonTransaction.categoryid] !== undefined) {
                categories[jsonTransaction.categoryid].total +=
                  jsonTransaction.amount;
              }
            } else {
              categoryUndefined += jsonTransaction.amount;
            }
            categoryTotal += jsonTransaction.amount;
          });
          // Adding category undefiend and total
          categories["-"] = {
            name: "-",
            total: categoryUndefined,
          };
          categories["Total"] = {
            name: "Total",
            total: categoryTotal,
          };
          // Sort categories
          let orderedCategories = sortObject(categories, "total");
          // Merge
          status = 200; // OK
          res.status(status).json({
            status: status,
            message: "summary ok",
            summary: { users: users, categories: orderedCategories },
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on find transactions",
            summary: {},
            error: error,
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
        error: error,
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
