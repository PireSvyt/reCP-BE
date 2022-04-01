const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  var log = [];
  Transaction.find()
    .then((transactions) => {
      var users = { Alice: 0, Pierre: 0 };
      var factor = 0;
      var share = 0;
      log.push("loopîng through transactions");
      var jsonTransaction = {};
      transactions
        .forEach((transaction) => {
          log.push("transaction");
          jsonTransaction = transaction.toObject();
          log.push(jsonTransaction);
          for (var [user, count] of Object.keys(users)) {
            log.push("user " + user);
            if (user === jsonTransaction.by) {
              factor = 1;
              share =
                (jsonTransaction.for.length - 1) / jsonTransaction.for.length;
            } else {
              factor = -1;
              share = 1 / jsonTransaction.for.length;
            }
            users[user] = users[user] + factor * share * jsonTransaction.amount;
            log.push(users);
          }
        })
        .catch((error) =>
          res.status(400).json({
            message: "problème de boucle dans les transactions",
            log,
            error
          })
        );
      log.push("sending res");
      res.status(200).json(users);
    })
    .catch((error) =>
      res.status(400).json({ message: "problème de recherche", log, error })
    );
};
