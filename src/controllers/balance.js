const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      var users = { Alice: 0, Pierre: 0 };
      var factor = 0;
      var share = 0;
      var jsonTransaction = {};
      transactions.forEach((transaction) => {
        jsonTransaction = transaction.toObject();
        for (var user of Object.keys(users)) {
          if (user === jsonTransaction.by) {
            factor = 1;
            share =
              Math.max(jsonTransaction.for.length - 1, 1) /
              jsonTransaction.for.length;
          } else {
            if (jsonTransaction.for.find(user)) {
              factor = -1;
              share = 1 / jsonTransaction.for.length;
            } else {
              factor = 0;
              share = 0;
            }
          }
          users[user] = users[user] + factor * share * jsonTransaction.amount;
        }
      });
      res.status(200).json(users);
    })
    .catch((error) =>
      res.status(400).json({ message: "problème de recherche", error })
    );
};
