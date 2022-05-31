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

exports.getIngredientList = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // Needs
  switch (req.body.need) {
    case "ingredients":
      fields = "name unit category";
      break;
    case "recipe":
      if (req.body.details["_ids"]) {
        filters = { _id: { $in: req.body.details["_ids"] } };
      }
      fields = "name unit";
      break;
    case "thisweek":
      where = "this.state.needed > 0";
      fields = "name unit needed available";
      break;
    case "fridge":
      where = "this.state.needed > 0";
      fields = "name unit needed available";
      break;
    case "shopping":
      where =
        "this.state.needed > 0 && this.state.needed - this.state.available > 0";
      fields = "name unit needed available shopped";
      break;
    case "shopped":
      where = "this.state.needed > 0 && this.state.shopped ";
      fields = "name unit needed available shopped";
      break;
    default:
      status = 403; // Access denied
  }

  if (status === 403) {
    res.status(status).json([]);
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
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
      });
  }
};
