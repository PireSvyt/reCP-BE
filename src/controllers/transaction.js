//const categorytransactionAPI = require("./categorytransaction");
const Transaction = require("../models/Transaction");
const CategoryTransaction = require("../models/CategoryTransaction");

exports.createTransaction = (req, res, next) => {
  delete req.body._id;
  const transaction = new Transaction({ ...req.body });
  saveCategory(transaction.category).then((id) => {
    transaction.category = id;
    transaction
      .save()
      .then(() => {
        res.status(201).json({
          message: "transaction enregistrée",
          id: transaction._id
        });
      })
      .catch((error) => res.status(400).json({ error }));
  });
};

async function saveCategory(category) {
  return CategoryTransaction.find().then((categories) => {
    let categoryObject = categories.filter(function (value, index, arr) {
      return value.name === category;
    });
    if (categoryObject.length === 1) {
      return categoryObject[0]._id;
    } else {
      const categorytransaction = new CategoryTransaction({
        name: category
      });
      categorytransaction.save().then((categoryCreationRes) => {
        if (categoryCreationRes.status === 200) {
          return categoryCreationRes.id;
        } else {
          return "";
        }
      });
    }
  });
}

exports.modifyTransaction = (req, res, next) => {
  let transaction = new Transaction({ ...req.body });
  saveCategory(transaction.category).then((id) => {
    transaction.category = id;
    Transaction.updateOne(
      { _id: req.params.id },
      { transaction, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "transaction modifiée" }))
      .catch((error) => res.status(400).json({ error }));
  });
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
  //console.log("findOneTransaction req");
  //console.log(req);
  Transaction.findOne({ _id: req.params.id })
    .then((transaction) => {
      //console.log("transaction");
      //console.log(transaction);
      if (transaction.category.match(/^[a-zA-Z0-9]+$/) === null) {
        //console.log("transaction.category");
        //console.log(transaction.category);
        res.status(200).json(transaction);
      } else {
        CategoryTransaction.findOne({ _id: transaction.category })
          .then((category) => {
            //console.log("category");
            //console.log(category);
            transaction.category = category.name;
            res.status(200).json(transaction);
          })
          .catch((error) =>
            res.status(404).json({ message: "catégorie introuvable" })
          );
      }
    })
    .catch((error) =>
      res.status(404).json({ message: "transaction introuvable" })
    );
};

exports.findTransactions = (req, res, next) => {
  function compare(a, b) {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
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
