const Transaction = require("../models/Transaction");

exports.createTransaction = (req, res, next) => {
  delete req.body._id;
  const transaction = new Transaction({ ...req.body });
  transaction
    .save()
    .then(() => {
      res.status(201).json({
        message: "transaction enregistrée",
        id: transaction._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyTransaction = (req, res, next) => {
  Transaction.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "transaction modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteTransaction = (req, res, next) => {
  Transaction.findOne({ _id: req.params.id })
    .then((transaction) => {
      if (!transaction) {
        return res.status(400).json({ message: "transaction introuvable" });
      }
      Transaction.deleteOne({ _id: req.params.id })
        .then((transaction) =>
          res.status(200).json({ message: "transaction supprimée" })
        )
        .catch((error) =>
          res.status(400).json({ message: "transaction introuvable" })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "transaction introuvable" })
    );
};

exports.findOneTransaction = (req, res, next) => {
  Transaction.findOne({ _id: req.params.id })
    .then((transaction) => res.status(200).json(transaction))
    .catch((error) =>
      res.status(404).json({ message: "transaction introuvable" })
    );
};

exports.findTransactions = (req, res, next) => {
  function compare(a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    // a doit être égal à b
    return 0;
  }
  Transaction.find()
    .then((transactions) => {
      transactions.sort(compare);
      res.status(200).json(transactions);
    })
    .catch((error) => res.status(400).json({ error }));
};
