const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      var users = { Alice: 0, Pierre: 0 };
      var factor = 0;
      var share = 0;
      var jsonTransaction = {};
      var categories = {};
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
          users[user] = users[user] + factor * share * jsonTransaction.amount;
        }
        // Balance per category
        if (jsonTransaction.category !== "") {
          categories[jsonTransaction.category] += jsonTransaction.amount;
        } else {
          categories["-"] += jsonTransaction.amount;
        }
      });
      // To arrays
      var categoriesRes = [];
      var total = 0;
      for (const [key, value] of Object.entries(categories)) {
        total += categories[key].amount;
        categoriesRes.push(categories[key]);
      }
      // Merge
      let balance = { users: users, categories: categoriesRes };
      res.status(200).json(balance);
    })
    .catch((error) =>
      res.status(400).json({ message: "problème de recherche", error })
    );
};
