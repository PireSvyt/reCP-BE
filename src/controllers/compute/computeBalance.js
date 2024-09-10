const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");
const computeTransactionBalance = require("./services/computeTransactionBalance.js");
const sortObject = require("../../utils/sortObject.js");

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
              users[user] = users[user] + transactionUserBalance[user];
            }
            // Balance per category
            if (jsonTransaction.for.length === 2) {
              if (jsonTransaction.categoryid !== undefined) {
                if (
                  Object.keys(categories).includes(jsonTransaction.categoryid)
                ) {
                  categories[jsonTransaction.categoryid].total =
                    categories[jsonTransaction.categoryid].total +
                    jsonTransaction.amount;
                } else {
                  categoryUndefined += jsonTransaction.amount;
                }
              } else {
                categoryUndefined += jsonTransaction.amount;
              }
              categoryTotal += jsonTransaction.amount;
            }
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
            type: "compute.balance.success",
            status: status,
            message: "balance ok",
            data: { users: users, categories: orderedCategories },
          });
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            type: "compute.balance.erroroncompute",
            status: status,
            message: "error on find transactions",
            data: {},
            error: error,
          });
          console.error(error);
        });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        type: "compute.balance.erroronfindcategories",
        status: status,
        message: "error on find categories",
        data: {},
        error: error,
      });
      console.error(error);
    });
};
