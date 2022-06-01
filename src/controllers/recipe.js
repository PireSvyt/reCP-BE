const Recipe = require("../models/Recipe");

exports.createRecipe = (req, res, next) => {
  delete req.body._id;
  const recipe = new Recipe({ ...req.body });
  // Save ingredients
  if (saveIngredients(recipe)) {
    // Save recipe
    recipe
      .save()
      .then(() => {
        res.status(201).json({
          message: "recette enregistré",
          id: recipe._id
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }
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

function saveIngredients(recipe) {
  let outcome = true;

  return outcome;
}

exports.getRecipeList = (req, res, next) => {
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
      case "myrecipies":
        fields = "name selected";
        break;
      case "thisweek":
        where = "this.selected";
        fields = "name portions scale cooked";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json([]);
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    Recipe.find(filters, fields)
      .$where(where)
      .exec()
      .then((recipies) => {
        status = 200; // OK
        res.status(status).json(recipies);
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json([]);
      });
  }
};

exports.saveRecipe = (req, res, next) => {
  // FIXME
};
exports.selectRecipe = (req, res, next) => {
  // FIXME
};
exports.prepareRecipe = (req, res, next) => {
  // FIXME
};
