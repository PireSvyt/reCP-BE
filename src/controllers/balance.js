const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  var log = [];
  Transaction.find()
    .then((transactions) => {
      var users = { Alice: 0, Pierre: 0 };
      var factor = 0;
      var share = 0;
      log.push("decaled variables");
      transactions
        .forEach((transaction) => {
          log.push("loopîng through transactions");
          for (const [user] of users.keys()) {
            log.push("loopîng through users");
            if (user === transaction.by) {
              factor = 1;
              share = (transaction.for.length - 1) / transaction.for.length;
            } else {
              factor = -1;
              share = 1 / transaction.for.length;
            }
            users[user] = users[user] + factor * share * transaction.amount;
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
