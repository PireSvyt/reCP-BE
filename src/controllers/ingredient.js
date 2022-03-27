const Ingredient = require("../models/Ingredient");

exports.createIngredient = (req, res, next) => {
  delete req.body._id;
  const ingredient = new Ingredient({ ...req.body });
  ingredient
    .save()
    .then(() => {
      res.status(201).json({
        message: "ingrédient enregistré",
        id: ingredient._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyIngredient = (req, res, next) => {
  Ingredient.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "ingédient modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteIngredient = (req, res, next) => {
  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => {
      if (!ingredient) {
        return res.status(400).json({ message: "ingédient introuvable" });
      }
      Ingredient.deleteOne({ _id: req.params.id })
        .then((ingredient) =>
          res.status(200).json({ message: "ingédient supprimé" })
        )
        .catch((error) =>
          res.status(400).json({ message: "ingédient introuvable" })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "ingédient introuvable" })
    );
};

exports.findOneIngredient = (req, res, next) => {
  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => res.status(200).json(ingredient))
    .catch((error) =>
      res.status(404).json({ message: "ingédient introuvable" })
    );
};

exports.findIngredients = (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => res.status(200).json(ingredients))
    .catch((error) => res.status(400).json({ error }));
};
