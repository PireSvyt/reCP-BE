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
