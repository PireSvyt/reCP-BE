const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  var log = [];
  Transaction.find()
    .then((transactions) => {
      var users = { Alice: 0, Pierre: 0 };
      var factor = 0;
      var share = 0;
      log.push("decaled variables");
      var jsonTransaction = {};
      transactions
        .forEach((transaction) => {
          jsonTransaction = transaction.toObject();
          log.push("loopîng through transactions");
          for (const [user] of users.keys()) {
            log.push("loopîng through users");
            if (user === jsonTransaction.by) {
              factor = 1;
              share =
                (jsonTransaction.for.length - 1) / jsonTransaction.for.length;
            } else {
              factor = -1;
              share = 1 / jsonTransaction.for.length;
            }
            users[user] = users[user] + factor * share * jsonTransaction.amount;
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
