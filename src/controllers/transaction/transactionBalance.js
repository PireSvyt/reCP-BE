const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");
const BalanceRule = require("../../models/BalanceRule");
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
categoryid: category.categoryid,
};
});
console.log("categories", categories);
  // Gather balance rules
  let balancerules = [];
  BalanceRule.find()
    .then((balanceruleList) => {
      balancerules = [...balanceruleList];
      balancerules = balancerules.sort((a, b) => {
        return a.startdate - b.startdate;
      });
      console.log("balance rules", balancerules);

      Transaction.find()
        .then((transactions) => {
          var users = { Alice: 0, Pierre: 0 };
          var jsonTransaction = {};
          var categoryTotal = 0;
          var categoryUndefined = 0;
          transactions.forEach((transaction) => {
            jsonTransaction = transaction.toObject();

            // Balance per user
            transactionUserBalance = computeTransactionBalance(
              jsonTransaction,
              balancerules,
              req.body.community
            );
            for (var user of Object.keys(transactionUserBalance)) {
              users[user] = users[user] + transactionUserBalance[user];
            }
            // Balance per category
            if (jsonTransaction.for.length === 2) {
              if (jsonTransaction.categoryid !== undefined) {
                if (
                  Object.keys(categories).includes(
                    jsonTransaction.categoryid
                  )
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
            categoryid: "undefined",
          };
          categories["Total"] = {
            name: "Total",
            total: categoryTotal,
            categoryid: "total",
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
        status: status,
        message: "error on find balance rules",
        summary: {},
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