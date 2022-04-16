const Recipe = require("../models/Recipe");

exports.createRecipe = (req, res, next) => {
  delete req.body._id;
  const recipe = new Recipe({ ...req.body });
  console.log("createRecipe");
  console.log(recipe);
  recipe
    .save()
    .then(() => {
      res.status(201).json({
        message: "recette enregistré",
        id: recipe._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyRecipe = (req, res, next) => {
  Recipe.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "recette modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteRecipe = (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      if (!recipe) {
        return res.status(400).json({ message: "recette introuvable" });
      }
      Recipe.deleteOne({ _id: req.params.id })
        .then((recipe) => res.status(200).json({ message: "recette supprimé" }))
        .catch((error) =>
          res.status(400).json({ message: "recette introuvable" })
        );
    })
    .catch((error) => res.status(404).json({ message: "recette introuvable" }));
};

exports.findOneRecipe = (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(404).json({ message: "recette introuvable" }));
};

exports.findRecipes = (req, res, next) => {
  Recipe.find()
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
};
