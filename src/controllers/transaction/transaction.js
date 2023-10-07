//const categorytransactionAPI = require("./categorytransaction");
const Transaction = require("../../models/Transaction");
const CategoryTransaction = require("../../models/CategoryTransaction");

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
          id: transaction._id,
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
        name: category,
      });
      categorytransaction.save().then((categoryCreationRes) => {
        if (categoryCreationRes.status === 200) {
          return categoryCreationRes._id;
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
    transaction._id = req.params.id;
    Transaction.updateOne({ _id: req.params.id }, transaction)
      .then(() => {
        res.status(200).json({ message: "transaction modifiée" });
      })
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.findOneTransaction = (req, res, next) => {
  Transaction.findOne({ _id: req.params.id })
    .then((transaction) => {
      if (transaction.category.match(/^[a-zA-Z0-9]+$/) === null) {
        res.status(200).json(transaction);
      } else {
        CategoryTransaction.findOne({ _id: transaction.category })
          .then((category) => {
            transaction.category = category.name;
            res.status(200).json(transaction);
          })
          .catch((error) =>
            res.status(404).json({ message: "catégorie introuvable" }),
          );
      }
    })
    .catch((error) =>
      res.status(404).json({ message: "transaction introuvable" }),
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

// LEVERAGED
exports.getOne = (req, res, next) => {
  // Initialize
  var status = 500;

  Transaction.findOne({ _id: req.params.id })
    .then((transaction) => {
      if (transaction.category.match(/^[a-zA-Z0-9]+$/) === null) {
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "transaction ok",
          transaction: transaction,
        });
      } else {
        CategoryTransaction.findOne({ _id: transaction.category })
          .then((category) => {
            transaction.category = category.name;
            status = 200; // OK
            res.status(status).json({
              status: status,
              message: "transaction ok",
              transaction: transaction,
            });
          })
          .catch((error) => {
            status = 404; // Introuable
            res.status(status).json({
              status: status,
              message: "error on find category",
              transaction: {},
              error: error,
            });
            console.error(error);
          });
      }
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        transaction: {},
        error: error,
      });
      console.error(error);
    });
};
exports.getMany = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // useful
  function compare(a, b) {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    // a doit être égal à b
    return 0;
  }

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "mybalance":
        fields = "name amount date";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json({
      status: status,
      message: "wrong need usage",
      transactions: [],
    });
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    /*
    Ingredient.find(filters, fields)
      .$where(where)
      .exec()
      .then((ingredients) => {
        status = 200; // OK
        res.status(status).json(ingredients);
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json([]);
      });*/

    //https://www.mongodb.com/docs/manual/reference/operator/query/where/
    /*db.players.find( {$expr: { $function: {
        body: function(name) { return hex_md5(name) == "9b53e667f30cd329dca1ec9e6a83e994"; },
        args: [ "$name" ],
        lang: "js"
  } } } )
  */
    /*
    Ingredient.find(filters, fields)
      .where(where)
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          console.log("error returned");
          res.send(500, { error: "Failed insert" });
        }

        if (!data) {
          res.send(403, { error: "Authentication Failed" });
        }

        res.send(200, data);
        console.log("success generate List");
        console.log(data);
      });
      */

    Transaction.find(filters, fields)
      .where(where)
      .then((transactions) => {
        // Sort
        transactions.sort(compare);
        // Send
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          transactions: transactions,
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          transactions: [],
          error: error,
        });
        console.error(error);
      });
  }
};
exports.save = (req, res, next) => {
  // Initialize
  var status = 500;

  if (req.body._id === "" || req.body._id === undefined) {
    // Create
    delete req.body._id;
    const transaction = new Transaction({ ...req.body });
    saveCategory(transaction.category)
      .then((id) => {
        transaction.category = id;
        transaction
          .save()
          .then(() => {
            status = 201;
            res.status(status).json({
              status: status,
              message: "transaction created",
              id: transaction._id,
            });
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on create",
              error: error,
              transaction: req.body,
            });
            console.error(error);
          });
      })
      .catch((error) => {
        status = 206; // Inconsistency
        res.status(status).json({
          status: status,
          message: "error on modify category",
          error: error,
          transaction: req.body,
        });
        console.error(error);
      });
  } else {
    // Modify
    let transaction = new Transaction({ ...req.body });
    saveCategory(transaction.category)
      .then((id) => {
        transaction.category = id;
        Transaction.updateOne({ _id: transaction._id }, transaction)
          .then(() => {
            status = 200;
            res.status(status).json({
              status: status,
              message: "transaction modified",
              id: req.body._id,
            });
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on modify",
              error: error,
              transaction: req.body,
            });
            console.error(error);
          });
      })
      .catch((error) => {
        status = 206; // Inconsistency
        res.status(status).json({
          status: status,
          message: "error on modify category",
          error: error,
          transaction: req.body,
        });
        console.error(error);
      });
  }
};
exports.deleteOne = (req, res, next) => {
  // Initialize
  var status = 500;
  Transaction.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "transaction deleted",
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        transaction: req.body,
      });
      console.error(error);
    });
};
exports.deleteAll = (req, res, next) => {
  // Initialize
  var status = 500;
  Transaction.deleteMany({ _id: [] })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "all transactions deleted",
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on delete",
        error: error,
        req: req.body,
      });
      console.error(error);
    });
};
