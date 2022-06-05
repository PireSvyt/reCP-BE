const CategoryTransaction = require("../models/CategoryTransaction");

exports.createCategoryTransaction = (req, res, next) => {
  delete req.body._id;
  const category = new CategoryTransaction({ ...req.body });
  category
    .save()
    .then(() => {
      res.status(201).json({
        message: "catégorie enregistrée",
        id: category._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyCategoryTransaction = (req, res, next) => {
  CategoryTransaction.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "catégorie modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteCategoryTransaction = (req, res, next) => {
  CategoryTransaction.findOne({ _id: req.params.id })
    .then((category) => {
      if (!category) {
        return res.status(400).json({ message: "catégorie introuvable" });
      }
      CategoryTransaction.deleteOne({ _id: req.params.id })
        .then((category) =>
          res.status(200).json({ message: "catégorie supprimée" })
        )
        .catch((error) =>
          res.status(400).json({ message: "catégorie introuvable" })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "catégorie introuvable" })
    );
};

exports.findOneCategoryTransaction = (req, res, next) => {
  CategoryTransaction.findOne({ _id: req.params.id })
    .then((category) => res.status(200).json(category))
    .catch((error) =>
      res.status(404).json({ message: "catégorie introuvable" })
    );
};

exports.findCategoryTransactions = (req, res, next) => {
  CategoryTransaction.find()
    .then((categories) => res.status(200).json(categories))
    .catch((error) => res.status(400).json({ error }));
};

// LEVERAGED
exports.getCategoryItem = (req, res, next) => {
  // Initialize
  var status = 500;

  CategoryTransaction.findOne({ _id: req.params.id })
    .then((category) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "category ok",
        category: category
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        category: {},
        error: error
      });
      console.error(error);
    });
};
exports.getCategoryList = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "transactiondropdown":
        fields = "name";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json({
      status: status,
      message: "wrong need usage",
      categories: []
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

    CategoryTransaction.find(filters, fields)
      .where(where)
      .then((categories) => {
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          categories: categories
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          categories: [],
          error: error
        });
        console.error(error);
      });
  }
};
exports.saveCategory = (req, res, next) => {
  // Initialize
  var status = 500;

  if (req.body._id === "") {
    // Create
    delete req.body._id;
    const category = new CategoryTransaction({ ...req.body });
    category
      .save()
      .then(() => {
        status = 201;
        res.status(status).json({
          status: status,
          message: "category created",
          id: category._id
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on create",
          error: error,
          category: req.body
        });
        console.error(error);
      });
  } else {
    // Modify
    CategoryTransaction.findByIdAndUpdate(req.body.id, ...req.body)
      .then(() => {
        status = 200;
        res.status(status).json({
          status: status,
          message: "category modified",
          id: req.body.id
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          category: req.body
        });
        console.error(error);
      });
  }
};
exports.deleteCategory = (req, res, next) => {
  // Initialize
  var status = 500;
  CategoryTransaction.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "category deleted"
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        category: req.body
      });
      console.error(error);
    });
};
