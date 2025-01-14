const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");
const Coefficient = require("../../models/Coefficient.js");
const computeTransactionBalance = require("./services/computeTransactionBalance.js");
const sortObject = require("../../utils/sortObject.js");

module.exports = computeBalance = (req, res, next) => {
  // Initialize
  var status = 500;

  Category.find({ communityid: req.augmented.user.communityid })
    .then((categoryList) => {
      let categories = {};
      categoryList.forEach((category) => {
        categories[category.categoryid] = {
          total: 0,
          name: category.name,
          categoryid: category.categoryid,
        };
      });
      //console.log("categories", categories);
      // Gather balance rules
      let coefficients = [];
      Coefficient.find({ communityid: req.augmented.user.communityid })
        .then((coefficientList) => {
          coefficients = [...coefficientList];
          coefficients = coefficients.sort((a, b) => {
            return a.startdate - b.startdate;
          });
          //console.log("coefficients", coefficients);
          Transaction.find({ communityid: req.augmented.user.communityid })
            .then((transactions) => {
              var users = {};
              req.body.members.forEach((member) => {
                users[member.userid] = 0;
              });
              var jsonTransaction = {};
              var categoryTotal = 0;
              var categoryUndefined = 0;
              transactions.forEach((transaction) => {
                jsonTransaction = transaction.toObject();

                // Balance per user
                transactionUserBalance = computeTransactionBalance(
                  jsonTransaction,
                  coefficients,
                  req.body.members
                );
                for (var user of Object.keys(transactionUserBalance.balance)) {
                  users[user] =
                    users[user] + transactionUserBalance.balance[user];
                }
                // Balance per category
                if (jsonTransaction.for.length > 1) {
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
                type: "transaction.balance.success",
                status: status,
                message: "balance ok",
                data: { users: users, categories: orderedCategories },
              });
            })
            .catch((error) => {
              status = 400; // OK
              console.error(error);
              res.status(status).json({
                type: "transaction.balance.erroronfindtransactions",
                status: status,
                message: "error on find balance rules",
                error: error,
              });
            });
        })
        .catch((error) => {
          status = 400; // OK
          console.error(error);
          res.status(status).json({
            type: "transaction.balance.erroronfindcoefficients",
            status: status,
            message: "error on find balance rules",
            error: error,
          });
        });
    })
    .catch((error) => {
      status = 400; // OK
      console.error(error);
      res.status(status).json({
        type: "transaction.balance.erroronfindcategories",
        status: status,
        message: "error on find categories",
        error: error,
      });
    });
};
