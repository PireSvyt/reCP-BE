const Transaction = require("../models/Transaction");

exports.computeBalance = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      var balance = {
        alice: 0,
        pierre: 0
      };
      var share = 0;
      var factor = 0;
      transactions.forEach((transaction) => {
        for (const who of Object.keys(balance)) {
          if (who === transaction.by) {
            factor = 1;
            share = (transactions.for.length - 1) / transactions.for.length;
          } else {
            factor = -1;
            share = 1 / transactions.for.length;
          }
          balance[who] += factor * share * transaction.amount;
        }
      });
      res.status(200).json(balance);
    })
    .catch((error) => res.status(400).json({ error }));
};
