const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      var users = [{ Alice: 0 }, { Pierre: 0 }];
      var factor = 0;
      var share = 0;
      var by = "";
      transactions
        .forEach((transaction) => {
          users
            .forEach((user) => {
              by = user.keys()[0];
              if (by === transaction.by) {
                factor = 1;
                share = (transaction.for.length - 1) / transaction.for.length;
              } else {
                factor = -1;
                share = 1 / transaction.for.length;
              }
              users[by] = users[by] + factor * share * transaction.amount;
            })
            .catch((error) =>
              res
                .status(400)
                .json({ message: "problème de boucle dans les users", error })
            );
        })
        .catch((error) =>
          res
            .status(400)
            .json({
              message: "problème de boucle dans les transactions",
              error
            })
        );
      res.status(200).json(users);
    })
    .catch((error) =>
      res.status(400).json({ message: "problème de recherche", error })
    );
};
