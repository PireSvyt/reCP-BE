const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      var balance = [{ Alice: 0 }, { Pierre: 0 }];
      var factor = 0;
      var share = 0;
      var by = "";
      transactions.forEach((transaction) => {
        balance.forEach((balance) => {
          by = balance.key();
          if (by === transaction.by) {
            factor = 1;
            share = (transactions.for.length - 1) / transactions.for.length;
          } else {
            factor = -1;
            share = 1 / transactions.for.length;
          }
          balance[by] = balance[by] + factor * share * transaction.amount;
        });
      });
      res.status(200).json(balance);
    })
    .catch((error) => res.status(400).json({ error }));
};
